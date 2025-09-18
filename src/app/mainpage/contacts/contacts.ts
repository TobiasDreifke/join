import { Component } from '@angular/core';
import { AddContact } from "./add-contact/add-contact";
import { OverviewContact } from "./overview-contact/overview-contact";
import { SingleContact } from "./single-contact/single-contact";

@Component({
  selector: 'app-contacts',
  imports: [AddContact, OverviewContact, SingleContact],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss'
})
export class Contacts {

}
