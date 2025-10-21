import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ContactService } from '../../../services/contact-service';

/**
 * Component to add or edit a contact.
 * 
 * Handles form input, emits events on adding or closing, and can delete a contact in edit mode.
 */
@Component({
  selector: 'app-add-contact',
  imports: [FormsModule],
  templateUrl: './add-contact.html',
  styleUrl: './add-contact.scss'
})
export class AddContact {

  /** Injected contact service */
  contactService = inject(ContactService);

  /** ID of the contact being edited (if any) */
  @Input() contactId: string | null = null;

  /** Flag indicating whether the component is in edit mode */
  @Input() editMode = false;

  /** Emits when the popup should be closed */
  @Output() close = new EventEmitter<void>();

  /** Emits the ID of the newly added contact */
  @Output() addedContact = new EventEmitter<string>();

  /** Currently selected contact (if editing) */
  currentContact?: Contact;

  /** Initials of the current contact */
  currentContactInitials: string = '';

  /** Form input values */
  htmlinput = {
    name: "",
    email: "",
    phone: ""
  };

  /** Returns the contact object from the service based on contactId */
  get contact() {
    return this.contactService.contactsList.find(contact => contact.id === this.contactId);
  }

  /** Lifecycle hook: initialize the form and set input values */
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

  /** Closes the add/edit contact popup. Deletes contact if in edit mode */
  onClose() {
    if (this.editMode && this.contactId) {
      this.contactService.deleteContact(this.contactId);
    }
    this.close.emit();
  }

  /**
   * Handles form submission for adding or editing a contact
   * @param form NgForm instance representing the contact form
   */
  async onSubmit(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.editMode && this.contactId) {
      this.contactService.updateContact(this.contactId, this.htmlinput);
      this.close.emit();
    } else if (!this.editMode) {
      const addedContactId = await this.contactService.addContact(this.htmlinput);
      this.clearInputFields();
      this.close.emit();
      this.addedContact.emit(addedContactId);
    }
  }

  /** Clears the input fields of the form */
  clearInputFields() {
    this.htmlinput.name = "";
    this.htmlinput.email = "";
    this.htmlinput.phone = "";
  }
}
