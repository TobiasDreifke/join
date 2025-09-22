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
    console.log("contact add-contact received contactId:", this.contact);
  }

  htmlinput = {
    name: "",
    email: "",
    phone: ""
  }


  onSubmit() {
    console.log(this.htmlinput);
    // ------------------ ENABLE THIS FOR LIVE DATABASE SAVING ----------------
    this.contactService.addContact(this.htmlinput);
    this.clearInputFields();
    this.close.emit();
  }

  clearInputFields() {
    this.htmlinput.name = "";
    this.htmlinput.email = "";
    this.htmlinput.phone = "";
  }
}
