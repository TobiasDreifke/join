import { Component } from '@angular/core';
import { Contacts } from './contacts/contacts';
import { Sidebar } from "../shared/sidebar/sidebar";

@Component({
  selector: 'app-mainpage',
  imports: [Contacts, Sidebar],
  templateUrl: './mainpage.html',
  styleUrl: './mainpage.scss'
})
export class Mainpage {

}
