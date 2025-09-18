import { Component } from '@angular/core';
import { Contacts } from './contacts/contacts';
import { Sidebar } from "../shared/sidebar/sidebar";
import { AddContact } from "./contacts/add-contact/add-contact";

@Component({
  selector: 'app-mainpage',
  imports: [Contacts, Sidebar, AddContact],
  templateUrl: './mainpage.html',
  styleUrl: './mainpage.scss'
})
export class Mainpage {

}
