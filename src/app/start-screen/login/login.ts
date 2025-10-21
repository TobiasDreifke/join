import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth-service';

/**
 * Login component responsible for user authentication.
 * 
 * Features:
 * - Handles email/password login
 * - Supports guest login
 * - Toggles password visibility
 */
@Component({
  selector: 'app-login',
  imports: [FormsModule, NgClass],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  /** Tracks whether the password field is visible */
  passwordVisible = false;

  /** Tracks if the last login attempt was invalid */
  invalidLogginAttempt = false;

  /** AuthService instance for authentication operations */
  authService = inject(AuthService);

  /** Object storing the user's email and password inputs */
  user = {
    email: '',
    password: ''
  }

  /**
   * Handles form submission for login.
   * Calls AuthService.login with user credentials.
   * Sets `invalidLogginAttempt` if login fails.
   * @param ngForm The Angular form object
   */
  async onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.valid) {
      this.invalidLogginAttempt = await this.authService.login(this.user.email, this.user.password);
    }
  }

  /**
   * Performs a guest login with predefined credentials.
   * Sets local storage flags for guest mode and welcome message.
   */
  guestLogIn() {
    this.authService.login('sofia.müller@gmail.com', 'sofiamu');
    localStorage.setItem('guestLogin', 'true');
    localStorage.removeItem('hasSeenWelcome');
  }

  /**
   * Toggles the visibility of the password input field.
   */
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
