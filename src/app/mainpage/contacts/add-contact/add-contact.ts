import { Component, EventEmitter, inject, Input, OnDestroy, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
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


  get contact() {
    return this.contactService.contactsList.find(contact => contact.id === this.contactId);
  }

  ngOnInit() {
    if (this.contact && this.editMode) {
      this.htmlinput = {
        name: this.contact.name,
        email: this.contact.email,
        phone: this.contact.phone
      };
      console.log("contact add-contact received contactId:", this.contact);

    } else {
      this.clearInputFields();
      this.editMode = false;
      console.log("no ID was send");

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
      console.log("you deleted:", this.contact);
    }

    this.close.emit(); 
  }

  onSubmit() {
    if (this.editMode && this.contactId) {
      this.contactService.updateContact(this.contactId, this.htmlinput)
      console.log("you edited something old:", this.htmlinput);
      this.close.emit();

    } if (!this.editMode) {
      // ------------------ ENABLE THIS FOR LIVE DATABASE SAVING ----------------
       this.contactService.addContact(this.htmlinput);
      console.log("you created something new:", this.htmlinput);
      this.clearInputFields();
      this.close.emit();
    } else {
      console.log("something went wrong");
    }
  }

  // onSubmit() {
  //   this.contactService.addContact(this.htmlinput);
  //   console.log("you created something new:", this.htmlinput);
  //   this.clearInputFields();
  //   this.close.emit();
  // }

  clearInputFields() {
    this.htmlinput.name = "";
    this.htmlinput.email = "";
    this.htmlinput.phone = "";
  }
}
