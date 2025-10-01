import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { ContactService } from '../../../services/contact-service';
import { TaskService } from '../../../services/task-service';

@Component({
  selector: 'app-single-task-popup',
  imports: [],
  templateUrl: './single-task-popup.html',
  styleUrl: './single-task-popup.scss'
})
export class SingleTaskPopup {
    taskService = inject(TaskService)
    contactService = inject(ContactService);
    @Input() taskId!: string;
    @Output() delete = new EventEmitter<string>();

  contactId: string | null = null;

  constructor() {
    if (this.contactService.contactsList.length > 0) {
      this.contactId = this.contactService.contactsList[0].id || null;
    }
  }
  


onDelete() {
  this.delete.emit(this.taskId);
}

  get contact(): Contact | undefined {
    return this.contactService.contactsList.find(c => c.id === this.contactId);
  }

  

  getInitials(name?: string): string {
    if (!name) return '';
    const parts = name.trim().split(' ').filter(p => p);
    if (parts.length <= 2) {
      return parts.map(p => p[0].toUpperCase()).join('');
    } else {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
  } 

  /**
 * Converts a given due date (either a JavaScript Date or a Firebase Timestamp)
 * into a readable date string.
 * If the input has a `toDate()` method (i.e., it's a Timestamp), it converts it to a Date object.
 * The resulting date is formatted using the 'en-GB' locale (DD/MM/YYYY).
 *
 * @param due - The date value to be formatted (Date or Timestamp)
 * @returns A string representation of the date
 */

  formatDueDate(due: any): string {
  if (!due) return '';
  const date = due.toDate ? due.toDate() : new Date(due); 
  return date.toLocaleDateString('en-GB'); 
}


  
}


