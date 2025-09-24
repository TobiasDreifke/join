import { Component, EventEmitter, HostListener, inject, Output } from '@angular/core';
import { ContactService } from '../../../services/contact-service';

@Component({
  selector: 'app-overview-contact',
  imports: [],
  templateUrl: './overview-contact.html',
  styleUrl: './overview-contact.scss'
})
export class OverviewContact {
  @Output() addNew = new EventEmitter<void>();
  @Output() isActive = new EventEmitter<string | null>();
  @Output() showSingleContact = new EventEmitter<void>();
  contactService = inject(ContactService);

  letters = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );
  contactsByLetter: { [key: string]: Contact[] } = {};
  activeContactId: string | null = null;
  isMobile = false;
  contactListFromService = [];

  constructor() {
    this.checkViewport();
  }

  selectContact(contact: Contact) {
    this.activeContactId = contact.id!;
    this.sendSelectedData();
  }

  onShowSingleContact(){
    this.showSingleContact.emit(); 
  }

  sendSelectedData() {
    this.isActive.emit(this.activeContactId);
  }

  getContactData() {
    return this.contactService.contactsList
  }

  ngOnInit() {
    this.letters.forEach(l => this.contactsByLetter[l] = []);
  }

  groupContacts(contacts: Contact[]) {
    this.contactsByLetter = {};
    this.letters.forEach(l => this.contactsByLetter[l] = []);

    contacts.forEach(contact => {
      const firstLetter = contact.name[0]?.toUpperCase();
      if (this.contactsByLetter[firstLetter]) {
        this.contactsByLetter[firstLetter].push(contact);
      }
    });
    return this.contactsByLetter;
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

  @HostListener('window:resize')
  onResize() {
    this.checkViewport();
  }

  private checkViewport() {
    this.isMobile = window.innerWidth <= 500;
  }
}