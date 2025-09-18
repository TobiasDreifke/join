import { Component } from '@angular/core';
import { Contacts } from './contacts/contacts';

@Component({
  selector: 'app-mainpage',
  imports: [Contacts],
  templateUrl: './mainpage.html',
  styleUrl: './mainpage.scss'
})
export class Mainpage {

}
