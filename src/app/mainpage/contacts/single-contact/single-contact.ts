import { CommonModule } from '@angular/common';
import {Component,ElementRef,EventEmitter,HostListener,inject,Input,Output, ViewChild,} from '@angular/core';
import { ContactService } from '../../../services/contact-service';

@Component({
  selector: 'app-single-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-contact.html',
  styleUrl: './single-contact.scss',
})
export class SingleContact {

  @ViewChild('appSection',{ static: true }) appSection!: ElementRef<HTMLElement>;

  @Output() edit = new EventEmitter<void>();

 


   isMenuOpen = false;
  isClosing = false;

toggleMenu() {
  if (this.isMenuOpen) {
    this.startClosing();
  } else {
    this.isMenuOpen = true;
  }
}

startClosing() {
  this.isClosing = true;
  setTimeout(() => {
    this.isMenuOpen = false;
    this.isClosing = false;
  }, 300); 
}

@HostListener('document:click', ['$event'])
handleClick(event: MouseEvent) {
  if (this.appSection.nativeElement.contains(event.target as Node)) {
    if (this.isMenuOpen) {
      this.startClosing();
    
  }

  }
}}
