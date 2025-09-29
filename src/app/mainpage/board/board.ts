import { Component, inject, Input } from '@angular/core';
import { TaskService } from '../../services/task-service';
import { ContactService } from '../../services/contact-service';
import { CommonModule } from '@angular/common';

import { NgModel } from '@angular/forms';

import { OverviewTasks } from './overview-tasks/overview-tasks';
import { SearchbarHeader } from './searchbar-header/searchbar-header';
import { SingleTaskPopup } from './single-task-popup/single-task-popup';

@Component({
  selector: 'app-board',
  imports: [CommonModule, OverviewTasks, SearchbarHeader, SingleTaskPopup],
  templateUrl: './board.html',
  styleUrl: './board.scss'
})
export class Board {





  
  // ↓↓↓↓↓↓↓↓↓↓↓ HOW TO INJECT BOTH SERVICES ↓↓↓↓↓↓↓↓↓↓↓
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
