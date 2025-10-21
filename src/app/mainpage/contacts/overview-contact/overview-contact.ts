import { Component, EventEmitter, HostListener, inject, Input, Output } from '@angular/core';
import { ContactService } from '../../../services/contact-service';

/**
 * Component to display an overview of contacts, grouped alphabetically.
 * 
 * Supports selecting a contact, emitting events for active contact, showing single contact,
 * and handling responsive layouts.
 */
@Component({
  selector: 'app-overview-contact',
  imports: [],
  templateUrl: './overview-contact.html',
  styleUrl: './overview-contact.scss'
})
export class OverviewContact {

  /** Event emitted to add a new contact */
  @Output() addNew = new EventEmitter<void>();

  /** Event emitted when a contact is selected or becomes active */
  @Output() isActive = new EventEmitter<string | null>();

  /** Event emitted to show the single contact view */
  @Output() showSingleContact = new EventEmitter<void>();

  /** ID of the currently active contact */
  @Input() activeContactId: string | null = null;

  /** Injected contact service */
  contactService = inject(ContactService);

  /** Letters A-Z for grouping contacts */
  letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

  /** Object mapping letters to arrays of contacts */
  contactsByLetter: { [key: string]: Contact[] } = {};

  /** Flag indicating if the viewport is mobile-sized */
  isMobile = false;

  /** Local copy of contact list from service */
  contactListFromService = [];

  constructor() {
    this.checkViewport();
  }

  /**
   * Selects a contact and emits the active contact ID
   * @param contact Contact to select
   */
  selectContact(contact: Contact) {
    this.activeContactId = contact.id!;
    this.sendSelectedData();
  }

  /** Emits event to show a single contact view */
  onShowSingleContact() {
    this.showSingleContact.emit();
  }

  /** Emits the currently active contact ID */
  sendSelectedData() {
    this.isActive.emit(this.activeContactId);
  }

  /** Returns the list of contacts from the service */
  getContactData() {
    return this.contactService.contactsList;
  }

  /** Lifecycle hook: initialize the contactsByLetter object */
  ngOnInit() {
    this.letters.forEach(l => this.contactsByLetter[l] = []);
  }

  /**
   * Groups contacts alphabetically by first letter of their name
   * @param contacts Array of contacts to group
   * @returns Object mapping letters to arrays of contacts
   */
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

  /**
   * Generates initials from a full name
   * @param name Full name string
   * @returns Uppercase initials (e.g., "John Doe" -> "JD")
   */
  getInitials(name?: string): string {
    if (!name) return '';
    const parts = name.trim().split(' ').filter(p => p);
    if (parts.length <= 2) {
      return parts.map(p => p[0].toUpperCase()).join('');
    } else {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
  }

  /** Host listener for window resize to update mobile flag */
  @HostListener('window:resize')
  onResize() {
    this.checkViewport();
  }

  /** Updates the isMobile flag based on window width */
  private checkViewport() {
    this.isMobile = window.innerWidth <= 500;
  }
}
