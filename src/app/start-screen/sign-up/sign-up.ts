import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { FormsModule, NgForm } from '@angular/forms';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-sign-up',
  imports: [NgClass, FormsModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss'
})
export class SignUp {
  user = {
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  passwordVisible = false;
  checked = false;
  invalidSignupAttempt = false;
  confirmPasswordMismatch = false;
  displayNameInvalid = false;
  passwordInvalid = false;
  emailInvalid = false;
  errorMessage = '';

  constructor(private authService: AuthService) { }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleCheckBox() {
    this.checked = !this.checked;
  }

  validateDisplayName() {
    const namePattern = /^[A-ZÄÖÜ][a-zäöüß]+ [A-ZÄÖÜ][a-zäöüß]+$/;
    this.displayNameInvalid = !namePattern.test(this.user.displayName.trim());
  }

  validatePassword() {
    this.passwordInvalid = this.user.password.length < 6;
    this.validateConfirmPassword();
  }
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

  validateConfirmPassword() {
    if (!this.user.confirmPassword) {
      this.confirmPasswordMismatch = false;
      return;
    }
    this.confirmPasswordMismatch = this.user.password !== this.user.confirmPassword;
  }

  get currentError(): string | null {
    if (this.displayNameInvalid) return 'Name must be in the format "Forename Lastname".';
    if (this.emailInvalid) return 'Please enter a valid email address.';
    if (this.passwordInvalid) return 'Password must be at least 6 characters long.';
    if (this.confirmPasswordMismatch) return 'Passwords do not match.';
    if (this.errorMessage) return this.errorMessage;
    return null;
  }



  async onSubmit(form: NgForm) {
    // Reset flags
    this.displayNameInvalid = false;
    this.passwordInvalid = false;
    this.confirmPasswordMismatch = false;
    this.emailInvalid = false;
    this.errorMessage = '';

    // Local validation
    const namePattern = /^[A-ZÄÖÜ][a-zäöüß]+ [A-ZÄÖÜ][a-zäöüß]+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!namePattern.test(this.user.displayName.trim())) {
      this.displayNameInvalid = true;
    }
    if (!this.user.email.trim() || !emailPattern.test(this.user.email.trim())) {
      this.emailInvalid = true;
    }
    if (this.user.password.length < 6) {
      this.passwordInvalid = true;
    }
    if (this.user.password !== this.user.confirmPassword) {
      this.confirmPasswordMismatch = true;
    }

    // Stop early if anything invalid
    if (
      this.displayNameInvalid ||
      this.emailInvalid ||
      this.passwordInvalid ||
      this.confirmPasswordMismatch
    ) {
      return;
    }

    try {
      const result = await this.authService.signup(
        this.user.email,
        this.user.password,
        this.user.displayName
      );

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


