import { Component, inject } from '@angular/core';
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

  contactId: string | null = null;

  constructor() {
    if (this.contactService.contactsList.length > 0) {
      this.contactId = this.contactService.contactsList[0].id || null;
    }
  }
  
  get contact(): Contact | undefined {
    return this.contactService.contactsList.find(c => c.id === this.contactId);
  }

  
  toggleActive(item: any) {
    item.active = !item.active;
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

  
}


