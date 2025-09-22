import { Component, HostListener } from '@angular/core';
import { ContactService } from '../../../services/contact-service';

@Component({
  selector: 'app-overview-contact',
  imports: [],
  templateUrl: './overview-contact.html',
  styleUrl: './overview-contact.scss'
})
export class OverviewContact {

  contactColors = [
    '#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8',
    '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701',
    '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B'
  ];
  letters = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );
  contactsByLetter: { [key: string]: Contact[] } = {};
  assignedColorById: { [contactId: string]: string } = {};
  activeContactId: string | null = null;
  activeContactData: { name: string; color: string } | null = null;
  isMobile = false;

  constructor(private contactService: ContactService) {
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
    this.letters.forEach(l => this.contactsByLetter[l] = []);
    let counter = 0;

    contacts.forEach(contact => {
      const firstLetter = contact.name[0]?.toUpperCase();
      if (this.contactsByLetter[firstLetter]) {
        this.contactsByLetter[firstLetter].push(contact);
      }
    });

    for (let letter of this.letters) {
      for (let contact of this.contactsByLetter[letter]) {
        if (!this.assignedColorById[contact.id!]) {
          this.assignedColorById[contact.id!] =
            this.contactColors[counter % this.contactColors.length];
          counter++;
        }
      }
    }
  }

  selectContact(contact: Contact) {
    this.activeContactId = contact.id!;
    this.activeContactData = {
      name: contact.name,
      color: this.assignedColorById[contact.id!]
    };
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
    this.isMobile = window.innerWidth <= 900;
  }
}
