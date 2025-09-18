import { inject, Injectable, OnDestroy } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, onSnapshot, orderBy, query, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ContactService implements OnDestroy{
  
  firestore: Firestore = inject(Firestore);
  unsubContactsList;
  contactsList: Contact[] = [];

  constructor(){
    this.unsubContactsList = this.getContactData();
  }

  getContactData(){
    const q = query(this.getContactsRef(), orderBy("name"))
    return onSnapshot(q, (contactsList) => {
      contactsList.forEach((contact)=> {
        this.contactsList.push(this.setObjectTypeToContact(contact.data(), contact.id))
      })
    })
  }

  async addContact(contact: Contact){
    await addDoc(this.getContactsRef(), contact);
  }

  async deleteContact(contactId: string){
    await deleteDoc(this.getSingleContactRef(contactId));
  }

  async updateContact(contactId: string, contactData: Contact){
    await updateDoc(this.getSingleContactRef(contactId), this.getCleanJson(contactData))
  }

  getContactsRef(){
    return collection(this.firestore, 'contact');
  }

  getSingleContactRef(docId: string){
    return doc(collection(this.firestore, 'contact'), docId)
  }

  getCleanJson(obj: Contact){
    return {
      name: obj.name,
      email: obj.email,
      phone: obj.phone
    }
  }

  setObjectTypeToContact(obj: any, id: string): Contact{
    return {
      id: id,
      name: obj.name,
      email: obj.email,
      phone: obj.phone
    }
  }

  ngOnDestroy(): void {
    this.unsubContactsList();
  }
}
