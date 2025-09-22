import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-single-contact',
  imports: [CommonModule],
  templateUrl: './single-contact.html',
  styleUrl: './single-contact.scss'
})
export class SingleContact {
  @Output() edit = new EventEmitter<void>();

  isMenuOpen = false;

toggleMenu() {
  this.isMenuOpen = !this.isMenuOpen;
}


}
