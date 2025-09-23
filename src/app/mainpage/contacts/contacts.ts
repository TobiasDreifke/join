import { Component, inject, Input } from '@angular/core';
import { AddContact } from "./add-contact/add-contact";
import { OverviewContact } from "./overview-contact/overview-contact";
import { SingleContact } from "./single-contact/single-contact";
import { CommonModule } from '@angular/common';
import { ContactService } from '../../services/contact-service';
@Component({
  selector: 'app-contacts',
  imports: [AddContact, OverviewContact, SingleContact, CommonModule],
  templateUrl: './contacts.html',
  styleUrls: ['./contacts.scss']
})
export class Contacts {
  @Input() isActive = Event;

  activeContactId: string | null = null;

  onSelectContact(contactId: string | null) {
    this.activeContactId = contactId;
  }

  receiveSelectedData(contactId: string | null) {
    console.log("Contact main is receiving:", contactId);
    this.activeContactId = contactId;
  }

  // ---------- working tree beneath -----------

  showPopUpAddContact = false;
  editMode = false;

  onAddNewContact() {
    this.editMode = false;
    this.showPopUpAddContact = true;
  }

  onEditContact() {
    this.editMode = true;
    this.showPopUpAddContact = true;
  }

  onClosePopup() {
    this.showPopUpAddContact = false;
  }
}