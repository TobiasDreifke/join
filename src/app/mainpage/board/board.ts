import { Component, inject, Input } from '@angular/core';
import { TaskService } from '../../services/task-service';
import { ContactService } from '../../services/contact-service';
import { CommonModule } from '@angular/common';
import { NgModel } from '@angular/forms';
@Component({
  selector: 'app-board',
  imports: [CommonModule],
  templateUrl: './board.html',
  styleUrl: './board.scss'
})
export class Board {
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
