import { Component } from '@angular/core';
import { Login } from "./login/login";

@Component({
  selector: 'app-start-screen',
  imports: [Login],
  templateUrl: './start-screen.html',
  styleUrl: './start-screen.scss'
})
export class StartScreen {

}
