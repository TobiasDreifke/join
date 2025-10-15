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
  errorMessage = '';

  constructor(private authService: AuthService) { }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleCheckBox() {
    this.checked = !this.checked;
  }

  async onSubmit(form: NgForm) {
    this.invalidSignupAttempt = false;
    this.confirmPasswordMismatch = false;
    this.errorMessage = '';

    if (this.user.password !== this.user.confirmPassword) {
      this.confirmPasswordMismatch = true;
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    const namePattern = /^[A-ZÄÖÜ][a-zäöüß]+ [A-ZÄÖÜ][a-zäöüß]+$/;
    if (!namePattern.test(this.user.displayName.trim())) {
      this.invalidSignupAttempt = true;
      this.errorMessage = 'Name must be in the format "Forename Lastname".';
      return;
    }

    if (this.user.password.length < 6) {
      this.invalidSignupAttempt = true;
      this.errorMessage = 'Password must be at least 6 characters long.';
      return;
    }

    const result = await this.authService.signup(
      this.user.email,
      this.user.password,
      this.user.displayName
    );

    if (!result.success) {
      this.invalidSignupAttempt = true;
      this.errorMessage = result.message || 'Sign-up failed. Please try again.';
    }
  }

}
