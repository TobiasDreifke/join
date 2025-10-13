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

  authService = inject(AuthService);

  user = {
    email: '',
    password: ''
  }

  onSubmit(ngForm: NgForm){
    if(ngForm.submitted && ngForm.valid){
      console.log("Valid Form: ", this.user.email, this.user.password);
      this.authService.login(this.user.email, this.user.password);
    }else{
      console.log("Invalid Form");
    }
  }

  guestLogIn(){
    console.log("Guest Log in");
  }

  togglePasswordVisibility(){
    this.passwordVisible = !this.passwordVisible
  }
}
