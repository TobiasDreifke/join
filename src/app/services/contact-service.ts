import { inject, Injectable, OnDestroy } from '@angular/core';
import { collection, Firestore, onSnapshot } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ContactService implements OnDestroy{
  
  firestore: Firestore = inject(Firestore);
  unsubContactsList;
  contactsList: Contact[] = [];

  constructor(){

    this.unsubContactsList = onSnapshot(this.getContactsRef(), (contactsList) => {
      contactsList.forEach((contact)=> {
        this.contactsList.push(this.setObjectTypeToContact(contact.data()))
      })
    })

  }

  getContactsRef(){
    return collection(this.firestore, 'contact');
  }

  setObjectTypeToContact(obj: any): Contact{
    return {
      name: obj.name,
      email: obj.email,
      phone: obj.phone
    }
  }

  ngOnDestroy(): void {
    this.unsubContactsList();
  }
}
