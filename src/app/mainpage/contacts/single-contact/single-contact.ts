import { CommonModule } from '@angular/common';
import {Component,ElementRef,EventEmitter,HostListener,Output,} from '@angular/core';

@Component({
  selector: 'app-single-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-contact.html',
  styleUrl: './single-contact.scss',
})
export class SingleContact {
  @Output() edit = new EventEmitter<void>();

  isMenuOpen = false;
  hoverActive = false;


  constructor(private elementRef: ElementRef) {}

toggleMenu() {
  this.isMenuOpen = !this.isMenuOpen;

  if (!this.isMenuOpen) {
    this.hoverActive = true;
    setTimeout(() => {
      this.hoverActive = false;
    }, 300); 
  }
}
  
  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);

    if (this.isMenuOpen) {
      this.isMenuOpen = false;
    }
  }
}
