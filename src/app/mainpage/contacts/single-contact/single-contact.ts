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
  isMenuOpen = false;
  isClosing = false;
  contactDeleted = true;
  isDeleted = true;

  @Output() showContactList = new EventEmitter<void>();

  @ViewChild('appSection', { static: true }) appSection!: ElementRef<HTMLElement>;
  @Output() edit = new EventEmitter<void>();

  contactService = inject(ContactService);
  
  @Input() contactId: string | null = null;

  get contact() {
    return this.contactService.contactsList.find(contact => contact.id === this.contactId);
  }

  ngOnChanges() {
    const contactExists = this.contactService.contactsList.some(contact => contact.id === this.contactId);
    if (contactExists) {
      this.isDeleted = false;
      this.contactDeleted = false;
    }
  }

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

  deleteElements() {
    this.contactService.deleteContact(this.contactId!);
    this.isDeleted = true;
    this.contactDeleted = true;
  }

  getInitials(name?: string): string {
    if (!name) return '';
    const parts = name.trim().split(' ').filter(p => p);
    if (parts.length <= 2) {
      return parts.map(p => p[0].toUpperCase()).join('');
    } else {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
  } 

  onShowContactList(){
    this.showContactList.emit();
  }
}
