import { Component, inject } from '@angular/core';
import { AddContact } from "./add-contact/add-contact";
import { OverviewContact } from "./overview-contact/overview-contact";
import { SingleContact } from "./single-contact/single-contact";
import { CommonModule } from '@angular/common';
import { ContactService } from '../../services/contact-service';
@Component({
  selector: 'app-contacts',
  imports: [AddContact, OverviewContact, SingleContact, CommonModule],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss'
})
export class Contacts {

  activeContact: Contact | null = null;
  
  onSelectContact(contact: Contact) {
    this.activeContact = contact;
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
