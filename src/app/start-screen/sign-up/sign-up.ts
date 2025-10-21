import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { FormsModule, NgForm } from '@angular/forms';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

/**
 * SignUp component handles user registration with form validation.
 * Features:
 * - Validates display name, email, password, and password confirmation
 * - Provides inline error messages
 * - Supports password visibility toggle
 */
@Component({
  selector: 'app-sign-up',
  imports: [NgClass, FormsModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss'
})
export class SignUp {

  /** Stores the user's input data */
  user = {
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  /** Toggles password input visibility */
  passwordVisible = false;

  /** Tracks checkbox acceptance (e.g., terms) */
  checked = false;

  /** Flags for validation */
  invalidSignupAttempt = false;
  confirmPasswordMismatch = false;
  displayNameInvalid = false;
  passwordInvalid = false;
  emailInvalid = false;
  errorMessage = '';

  /** AuthService for handling sign-up */
  private authService = inject(AuthService);

  /** Toggle password field visibility */
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  /** Toggle acceptance checkbox */
  toggleCheckBox() {
    this.checked = !this.checked;
  }

  /** Validate display name format "Firstname Lastname" */
  validateDisplayName() {
    const namePattern = /^[A-ZÄÖÜ][a-zäöüß]+ [A-ZÄÖÜ][a-zäöüß]+$/;
    this.displayNameInvalid = !namePattern.test(this.user.displayName.trim());
  }

  /** Validate password length (minimum 6 characters) */
  validatePassword() {
    this.passwordInvalid = this.user.password.length < 6;
    this.validateConfirmPassword();
  }

  /** Validate email format */
  validateEmail() {
    const value = this.user.email.trim();
    this.errorMessage = '';
    if (!value) {
      this.emailInvalid = true;
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailInvalid = !emailPattern.test(value);
  }

  /** Check if password confirmation matches */
  validateConfirmPassword() {
    if (!this.user.confirmPassword) {
      this.confirmPasswordMismatch = false;
      return;
    }
    this.confirmPasswordMismatch = this.user.password !== this.user.confirmPassword;
  }

  /** Returns the current validation error message, if any */
  get currentError(): string | null {
    if (this.displayNameInvalid) return 'Name must be in the format "Forename Lastname".';
    if (this.emailInvalid) return 'Please enter a valid email address.';
    if (this.passwordInvalid) return 'Password must be at least 6 characters long.';
    if (this.confirmPasswordMismatch) return 'Passwords do not match.';
    if (this.errorMessage) return this.errorMessage;
    return null;
  }

  /**
   * Handles sign-up form submission.
   * Performs local validation and calls AuthService.signup.
   * @param form NgForm submitted form object
   */
  async onSubmit(form: NgForm) {
    this.displayNameInvalid = false;
    this.passwordInvalid = false;
    this.confirmPasswordMismatch = false;
    this.emailInvalid = false;
    this.errorMessage = '';

    const namePattern = /^[A-ZÄÖÜ][a-zäöüß]+ [A-ZÄÖÜ][a-zäöüß]+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!namePattern.test(this.user.displayName.trim())) this.displayNameInvalid = true;
    if (!this.user.email.trim() || !emailPattern.test(this.user.email.trim())) this.emailInvalid = true;
    if (this.user.password.length < 6) this.passwordInvalid = true;
    if (this.user.password !== this.user.confirmPassword) this.confirmPasswordMismatch = true;

    if (this.displayNameInvalid || this.emailInvalid || this.passwordInvalid || this.confirmPasswordMismatch) return;

    try {
      const result = await this.authService.signup(this.user.email, this.user.password, this.user.displayName);
      if (!result.success) {
        this.errorMessage = result.message || 'Sign-up failed. Please try again.';
      }
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        this.errorMessage = 'This email is already registered.';
        this.emailInvalid = true;
      } else {
        this.errorMessage = 'An unexpected error occurred. Please try again.';
      }
    }
  }
}
