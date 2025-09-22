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
  contactService = inject(ContactService);

  letters = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );
  contactsByLetter: { [key: string]: Contact[] } = {};
  activeContactId: string | null = null;
  isMobile = false;

  constructor() {
    this.checkViewport();
  }

  ngOnInit() {
    this.letters.forEach(l => this.contactsByLetter[l] = []);
    this.contactService.unsubContactsList;

    setInterval(() => {
      this.groupContacts(this.contactService.contactsList);
    }, 500);
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
  }

  selectContact(contact: Contact) {
    this.activeContactId = contact.id!;
  }

  getInitials(fullName: string): string {
    if (!fullName) return '';
    const parts = fullName.trim().split(' ');
    if (parts.length < 2) return parts[0][0].toUpperCase();
    return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkViewport();
  }

  private checkViewport() {
    this.isMobile = window.innerWidth <= 1080;
  }
}
