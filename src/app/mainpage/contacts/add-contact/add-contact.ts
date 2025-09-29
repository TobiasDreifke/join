import { Component, EventEmitter, inject, Input, OnDestroy, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ContactService } from '../../../services/contact-service';
@Component({
  selector: 'app-add-contact',
  imports: [FormsModule],
  templateUrl: './add-contact.html',
  styleUrl: './add-contact.scss'
})
export class AddContact {
  contactService = inject(ContactService)

  @Input() contactId: string | null = null;
  @Input() editMode = false;
  @Output() close = new EventEmitter<void>();
  @Output() addedContact = new EventEmitter<string>();

  currentContact?: Contact;
  currentContactInitials: string = '';


  get contact() {
    return this.contactService.contactsList.find(contact => contact.id === this.contactId);
  }

  ngOnInit() {
    if (this.contactId) {
      this.currentContact = this.contactService.contactsList.find(currentContact => currentContact.id === this.contactId);
      this.currentContactInitials = this.getInitials(this.currentContact?.name);
    }

    if (this.contact && this.editMode) {
      this.htmlinput = {
        name: this.contact.name,
        email: this.contact.email,
        phone: this.contact.phone
      };

    } else {
      this.clearInputFields();
      this.editMode = false;

    }
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

  htmlinput = {
    name: "",
    email: "",
    phone: ""
  }

  onClose() {
    if (this.editMode && this.contactId) {
      this.contactService.deleteContact(this.contactId);
    }

    this.close.emit();
  }

  async onSubmit(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.editMode && this.contactId) {
      this.contactService.updateContact(this.contactId, this.htmlinput)
      this.close.emit();

    } if (!this.editMode) {
      // ------------------ ENABLE THIS FOR LIVE DATABASE SAVING ----------------
      let addedContactId = await this.contactService.addContact(this.htmlinput);
      this.clearInputFields();
      this.close.emit();
      this.addedContact.emit(addedContactId);
    }
  }

  clearInputFields() {
    this.htmlinput.name = "";
    this.htmlinput.email = "";
    this.htmlinput.phone = "";
  }
}
