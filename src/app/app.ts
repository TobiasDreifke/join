import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Sidebar } from './shared/sidebar/sidebar';
import { Header } from './shared/header/header';
import { StartScreen } from './start-screen/start-screen';
import { AuthService } from './services/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, Header, StartScreen],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('join');

  router = inject(Router)
  authService = inject(AuthService);

  animationTime = 1.5;

  constructor(){
    setTimeout(() => {
      this.animationTime = 0;
    }, 3000);
  }
  
}

