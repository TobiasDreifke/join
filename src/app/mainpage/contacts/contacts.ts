import { Component, HostBinding, inject, Input } from '@angular/core';
import { AddContact } from "./add-contact/add-contact";
import { OverviewContact } from "./overview-contact/overview-contact";
import { SingleContact } from "./single-contact/single-contact";
import { CommonModule } from '@angular/common';

/**
 * Main contacts component that manages contact overview, single contact view,
 * and adding/editing contacts.
 * 
 * Handles switching between contact list and single contact view, opening add/edit popups,
 * and tracking active contact.
 */
@Component({
  selector: 'app-contacts',
  imports: [AddContact, OverviewContact, SingleContact, CommonModule],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss'
})
export class Contacts {

  /** Input property (currently not typed correctly in original, placeholder) */
  @Input() isActive = Event;

  /** ID of the currently active contact */
  activeContactId: string | null = null;

  /** Flag to show temporary state after adding a contact */
  addedContactParam = false;

  /**
   * Sets the active contact ID when a contact is selected
   * @param contactId ID of the selected contact
   */
  onSelectContact(contactId: string | null) {
    this.activeContactId = contactId;
  }

  /**
   * Receives selected contact data and updates active contact
   * @param contactId ID of the selected contact
   */
  receiveSelectedData(contactId: string | null) {
    this.activeContactId = contactId;
  }

  /** HostBinding to toggle display of the contacts list */
  @HostBinding('class.display-contacts-list')
  displayContactList = true;

  /** HostBinding to toggle display of a single contact */
  @HostBinding('class.display-single-contact')
  displaySingleContact = false;

  /** Shows the contacts list and hides the single contact view */
  showContactList() {
    this.displayContactList = true;
    this.displaySingleContact = false;
  }

  /** Shows the single contact view and hides the contacts list */
  showSingleContact() {
    this.displayContactList = false;
    this.displaySingleContact = true;
  }

  /** Flag to show/hide the add/edit contact popup */
  showPopUpAddContact = false;

  /** Flag indicating whether the popup is in edit mode */
  editMode = false;

  /** Opens the add new contact popup */
  onAddNewContact() {
    this.editMode = false;
    this.showPopUpAddContact = true;
  }

  /** Opens the edit contact popup */
  onEditContact() {
    this.editMode = true;
    this.showPopUpAddContact = true;
  }

  /** Closes the add/edit contact popup */
  onClosePopup() {
    this.showPopUpAddContact = false;
  }

  /**
   * Handles a newly added contact
   * @param createdContactId ID of the newly created contact
   */
  addedContact(createdContactId: string) {
    this.showSingleContact();
    this.activeContactId = createdContactId;
    this.addedContactParam = true;
    setTimeout(() => {
      this.addedContactParam = false;
    }, 4000);
  }
}
