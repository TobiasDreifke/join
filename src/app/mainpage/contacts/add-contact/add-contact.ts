import { Component, inject } from '@angular/core';
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

  htmlinput = {
    name: "",
    email: "",
    phone: ""
  }

  onSubmit() {
    console.log(this.htmlinput);
    this.contactService.addContact(this.htmlinput);
    this.clearInputFields();
  }

  clearInputFields() {
    this.htmlinput.name = "";
    this.htmlinput.email = "";
    this.htmlinput.phone = "";
  }
}
