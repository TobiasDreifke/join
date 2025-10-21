import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, inject, Input, Output, ViewChild, OnChanges } from '@angular/core';
import { ContactService } from '../../../services/contact-service';

/**
 * Component representing a single contact card with menu actions.
 * 
 * Supports editing, deleting, and emitting events to show contact list.
 */
@Component({
  selector: 'app-single-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-contact.html',
  styleUrls: ['./single-contact.scss'],
})
export class SingleContact implements OnChanges {

  /** Flag indicating if the menu is open */
  isMenuOpen = false;

  /** Flag for handling closing animation of menu */
  isClosing = false;

  /** Flag indicating the contact has been deleted */
  contactDeleted = true;

  /** Flag indicating the contact is deleted */
  isDeleted = true;

  /** Emits when user wants to show the full contact list */
  @Output() showContactList = new EventEmitter<void>();

  /** Emits when user wants to edit the contact */
  @Output() edit = new EventEmitter<void>();

  /** Emits when the contact is deleted */
  @Output() delete = new EventEmitter<void>();

  /** ID of the contact being displayed */
  @Input() contactId: string | null = null;

  /** Flag indicating if this is a newly created contact */
  @Input() createdContact = false;

  /** Reference to the contact card element */
  @ViewChild('appSection', { static: true }) appSection!: ElementRef<HTMLElement>;

  /** Injected contact service */
  contactService = inject(ContactService);

  /** Returns the contact object from the service based on contactId */
  get contact() {
    return this.contactService.contactsList.find(contact => contact.id === this.contactId);
  }

  /** Lifecycle hook: update deleted flags when input changes */
  ngOnChanges() {
    const contactExists = this.contactService.contactsList.some(contact => contact.id === this.contactId);
    if (contactExists) {
      this.isDeleted = false;
      this.contactDeleted = false;
    }
  }

  /** Toggles the menu open/close state */
  toggleMenu() {
    if (this.isMenuOpen) {
      this.startClosing();
    } else {
      this.isMenuOpen = true;
    }
  }

  /** Starts menu closing animation and resets state after delay */
  startClosing() {
    this.isClosing = true;
    setTimeout(() => {
      this.isMenuOpen = false;
      this.isClosing = false;
    }, 300);
  }

  /** Host listener for document clicks to close menu if open */
  @HostListener('document:click')
  handleClick() {
    if (this.isMenuOpen) {
      this.startClosing();
    }
  }

  /** Deletes the contact, updates flags, emits delete event, and closes menu */
  deleteElements() {
    this.contactService.deleteContact(this.contactId!);
    this.isDeleted = true;
    this.contactDeleted = true;
    this.delete.emit();
    this.isMenuOpen = false;
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

  /** Emits event to show the full contact list */
  onShowContactList() {
    this.showContactList.emit();
  }
}
