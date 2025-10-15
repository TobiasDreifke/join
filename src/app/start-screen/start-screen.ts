import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-start-screen',
  imports: [RouterLink],
  templateUrl: './start-screen.html',
  styleUrl: './start-screen.scss'
})
export class StartScreen {

  router = inject(Router);
  @Input() animationTime!: number; 

}
