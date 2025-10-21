import { inject, Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';

/**
 * Service for handling user authentication using Firebase Auth.
 * 
 * Provides methods for:
 * - Signing up new users
 * - Logging in existing users
 * - Logging out
 * - Retrieving current user display name
 * - Observing authentication state
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /** Firebase Auth instance */
  auth = inject(Auth);

  /** Angular Router for navigation after login/signup/logout */
  router = inject(Router);

  /** BehaviorSubject tracking login status */
  logStatus = new BehaviorSubject<boolean>(false);

  /**
   * Sign up a new user with email, password, and display name
   * @param email User email
   * @param password User password
   * @param displayName User display name
   * @returns Success status and optional error message
   */
  async signup(
    email: string,
    password: string,
    displayName: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
        console.log('Display name set:', displayName);
      }

      this.router.navigate(['/summary']);
      this.logStatus.next(true);

      return { success: true };
    } catch (error: any) {
      console.error('Signup failed:', error);

      let message = 'An unexpected error occurred. Please try again.';

      if (error?.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            message = 'This email address is already registered.';
            break;
          case 'auth/invalid-email':
            message = 'The provided email address is invalid.';
            break;
          case 'auth/missing-email':
            message = 'Please enter your email address.';
            break;
          case 'auth/weak-password':
            message = 'Password should be at least 6 characters.';
            break;
          case 'auth/missing-password':
            message = 'Please enter a password.';
            break;
          case 'auth/operation-not-allowed':
            message = 'Email/password sign-up is currently disabled. Contact support.';
            break;
          case 'auth/network-request-failed':
            message = 'Network error. Please check your internet connection.';
            break;
          case 'auth/internal-error':
            message = 'An internal error occurred. Please try again.';
            break;
          case 'auth/too-many-requests':
            message = 'Too many attempts. Please wait a moment and try again.';
            break;
          case 'auth/invalid-credential':
            message = 'Invalid credential. Please check your input.';
            break;
          case 'auth/credential-already-in-use':
            message = 'This credential is already in use by another account.';
            break;
          case 'auth/account-exists-with-different-credential':
            message = 'An account already exists with the same email using a different sign-in method.';
            break;
          default:
            message = error.message || message;
            break;
        }
      } else if (error?.message) {
        message = error.message;
      }

      return { success: false, message };
    }
  }

  /**
   * Log in an existing user using email and password
   * @param email User email
   * @param password User password
   * @returns Boolean indicating if an error occurred
   */
  async login(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      this.router.navigate(['/summary']);
      this.logStatus.next(true);
      return false;
    } catch (error) {
      return true;
    }
  }

  /** Observable that emits true if a user is logged in, false otherwise */
  loggedIn$: Observable<boolean> = authState(this.auth).pipe(
    map(user => !!user)
  );

  /**
   * Logs out the current user and navigates to login page
   */
  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
    console.log("Logout");
  }

  /**
   * Retrieves the display name of the currently logged-in user
   * @returns Display name string or undefined
   */
  getDisplayName() {
    return this.auth.currentUser?.displayName;
  }
}
