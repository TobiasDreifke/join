import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgClass],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  passwordVisible = false;

  user = {
    email: '',
    password: ''
  }

  onSubmit(ngForm: NgForm){
    if(ngForm.submitted && ngForm.valid){
      console.log("Valid Form: ", this.user.email, this.user.password);
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
