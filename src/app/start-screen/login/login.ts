import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgClass],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  passwordVisible = false;
  invalidLogginAttempt = false;
  authService = inject(AuthService);

  user = {
    email: '',
    password: ''
  }

  async onSubmit(ngForm: NgForm){
    if(ngForm.submitted && ngForm.valid){
      this.invalidLogginAttempt = await this.authService.login(this.user.email, this.user.password);
    }
  }

  guestLogIn(){
    console.log("Guest Log in");
  }

  togglePasswordVisibility(){
    this.passwordVisible = !this.passwordVisible
  }
}
