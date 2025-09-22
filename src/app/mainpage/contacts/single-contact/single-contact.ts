import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-single-contact',
  imports: [CommonModule],
  templateUrl: './single-contact.html',
  styleUrl: './single-contact.scss'
})
export class SingleContact {

  isMenuOpen = false;

toggleMenu() {
  this.isMenuOpen = !this.isMenuOpen;
}


}
