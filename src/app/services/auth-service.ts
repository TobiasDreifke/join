import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  auth = inject(Auth);
  router = inject(Router);
  logStatus = new BehaviorSubject<boolean>(false);

  async login(email: string, password: string){
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      this.logStatus.next(true);
      this.router.navigate(['/summary']);
      return false;
    }catch(error){
      return true;
    }
  }

  async logout(){
    await signOut(this.auth);
    this.router.navigate(['/login']);
    this.logStatus.next(false);
  }

  getDisplayName(){
    return this.auth.currentUser?.displayName;
  }
}
