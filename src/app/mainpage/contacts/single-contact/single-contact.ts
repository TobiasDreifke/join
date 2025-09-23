import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, inject, Input, Output, ViewChild, OnChanges } from '@angular/core';
import { ContactService } from '../../../services/contact-service';

@Component({
  selector: 'app-single-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-contact.html',
  styleUrls: ['./single-contact.scss'],
})
export class SingleContact implements OnChanges {

  @ViewChild('appSection', { static: true }) appSection!: ElementRef<HTMLElement>;

  contactService = inject(ContactService);
  @Input() contactId: string | null = null;

  get contact() {
    return this.contactService.contactsList.find(contact => contact.id === this.contactId);
  }

  ngOnChanges() {
    console.log("single-contacts received contactId:", this.contact);
  }

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
    if (!this.appSection.nativeElement.contains(event.target as Node) && this.isMenuOpen) {
      this.startClosing();
    }
  }//#endregion

contactDeleted = false;

deleteElements() {
  this.contactService.deleteContact(this.contactId!);
  this.contactDeleted = true; 
}

  getInitials(name?: string): string {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();
}

}
