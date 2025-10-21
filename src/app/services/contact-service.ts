import { inject, Injectable, OnDestroy } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  onSnapshot,
  orderBy,
  query,
  updateDoc
} from '@angular/fire/firestore';

/**
 * Service for managing contacts in Firestore.
 * 
 * Provides methods to:
 * - Retrieve contacts in real-time
 * - Add, update, and delete contacts
 * - Generate clean contact objects and assign avatar colors
 */
@Injectable({
  providedIn: 'root'
})
export class ContactService implements OnDestroy {

  /** Firestore instance */
  firestore: Firestore = inject(Firestore);

  /** Function to unsubscribe from Firestore contacts listener */
  unsubContactsList: () => void;

  /** Array storing all contacts */
  contactsList: Contact[] = [];

  constructor() {
    this.unsubContactsList = this.getContactData();
  }

  /**
   * Subscribes to Firestore 'contact' collection and updates contactsList in real-time.
   * @returns Unsubscribe function
   */
  getContactData() {
    const q = query(this.getContactsRef(), orderBy("name"));

    return onSnapshot(q, (contactsSnapshot) => {
      this.contactsList = [];
      contactsSnapshot.docs.forEach((contactDoc, index) => {
        this.contactsList.push(this.setObjectTypeToContact(contactDoc.data(), contactDoc.id, index));
      });
    });
  }

  /**
   * Adds a new contact to Firestore.
   * @param contact Contact object
   * @returns ID of the newly created contact
   */
  async addContact(contact: Contact) {
    const addedContact = await addDoc(this.getContactsRef(), contact);
    return addedContact.id;
  }

  /**
   * Deletes a contact by ID.
   * @param contactId Firestore document ID
   */
  async deleteContact(contactId: string) {
    await deleteDoc(this.getSingleContactRef(contactId));
  }

  /**
   * Updates a contact by ID.
   * @param contactId Firestore document ID
   * @param contactData Updated contact object
   */
  async updateContact(contactId: string, contactData: Contact) {
    await updateDoc(this.getSingleContactRef(contactId), this.getCleanJson(contactData));
  }

  /**
   * Returns a reference to the 'contact' collection.
   */
  getContactsRef() {
    return collection(this.firestore, 'contact');
  }

  /**
   * Returns a reference to a single contact document by ID.
   * @param docId Firestore document ID
   */
  getSingleContactRef(docId: string) {
    return doc(this.getContactsRef(), docId);
  }

  /**
   * Returns a clean JSON object containing only name, email, and phone.
   * @param obj Contact object
   */
  getCleanJson(obj: Contact) {
    return {
      name: obj.name,
      email: obj.email,
      phone: obj.phone
    };
  }

  /**
   * Converts a raw Firestore object into a Contact type and assigns an avatar color.
   * @param obj Raw Firestore object
   * @param id Firestore document ID
   * @param index Index in the contact list
   */
  setObjectTypeToContact(obj: any, id: string, index: number): Contact {
    return {
      id: id,
      name: obj.name,
      email: obj.email,
      phone: obj.phone,
      initial_avatar_color: this.setInitialAvatarColor(index),
    };
  }

  /**
   * Determines the initial avatar color for a contact based on its index.
   * @param index Index in contact list
   */
  setInitialAvatarColor(index: number): string {
    const contactColors = [
      '#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8',
      '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701',
      '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B'
    ];
    return contactColors[index % contactColors.length];
  }

  /**
   * Unsubscribes from Firestore listener when service is destroyed
   */
  ngOnDestroy(): void {
    this.unsubContactsList();
  }
}
