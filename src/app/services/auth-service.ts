import { inject, Injectable, signal } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  auth = inject(Auth);
  router = inject(Router);
  logStatus = signal(false);

  async login(email: string, password: string){
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      this.logStatus.set(true);
      this.router.navigate(['/summary']);
    }catch(error){
      console.log("Error in logg in: ", error);
    }
  }

  async logout(){
    await signOut(this.auth);
    this.logStatus.set(false);
    this.router.navigate(['/login']);
  }
}
