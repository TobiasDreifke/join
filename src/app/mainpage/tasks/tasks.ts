import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TaskService } from '../../services/task-service';
import { ContactService } from '../../services/contact-service';

@Component({
  selector: 'app-tasks',
  imports: [FormsModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss'
})
export class Tasks {
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
}
