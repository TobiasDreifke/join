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
      contactsList.docs.forEach((contact, index)=> {
        this.contactsList.push(this.setObjectTypeToContact(contact.data(), contact.id, index))
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

  setObjectTypeToContact(obj: any, id: string, index: number): Contact{
    return {
      id: id,
      name: obj.name,
      email: obj.email,
      phone: obj.phone,
      initial_avatar_color: this.setInitialAvatarColor(index),
    }
  }

  setInitialAvatarColor(index: number): string{
    const contactColors = [
      '#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8',
      '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701',
      '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B'
    ];

    return contactColors[index % contactColors.length]
  }

  ngOnDestroy(): void {
    this.unsubContactsList();
  }
}
