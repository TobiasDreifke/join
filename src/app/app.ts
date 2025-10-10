import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './shared/sidebar/sidebar';
import { Header } from './shared/header/header';
import { StartScreen } from './start-screen/start-screen';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, Header, StartScreen],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('join');

  loggedIn = false;
}

