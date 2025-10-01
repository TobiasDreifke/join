import { Component, inject, Input } from '@angular/core';
import { TaskService } from '../../services/task-service';
import { ContactService } from '../../services/contact-service';
import { CommonModule } from '@angular/common';

import { FormsModule, NgForm, NgModel } from '@angular/forms';

import { OverviewTasks } from './overview-tasks/overview-tasks';
import { SearchbarHeader } from './searchbar-header/searchbar-header';
import { SingleTaskPopup } from './single-task-popup/single-task-popup';
import { TaskInterface } from '../../interfaces/tasks.interface';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-board',
  imports: [CommonModule, OverviewTasks, SearchbarHeader, SingleTaskPopup, FormsModule],
  templateUrl: './board.html',
  styleUrl: './board.scss'
})
export class Board {



  //  ------------ EVERYTHING TO RUN YOUR COMPONENT WITH THE SERVICE -----------------
  taskService = inject(TaskService)
  contactService = inject(ContactService);

  contactId: string | null = null;
  selectedTaskId: string | null = null;


openTaskPopup(taskId: string) {
  this.selectedTaskId = taskId;
}

closePopup() {
  this.selectedTaskId = null;
}

  subtaskTitle = '';

  newTask: TaskInterface = {
    title: '',
    description: '',
    due_date: Timestamp.now(),
    priority: 'Low',
    category: 'Technical Task',
    stage: 'To do',
    subtask: [],
    assigned_to: []
  };

  constructor() {
    if (this.contactService.contactsList.length > 0) {
      this.contactId = this.contactService.contactsList[0].id || null;
    }
  }

  async onSubmit(form: NgForm) {
    const addedTaskId = await this.taskService.addTask(this.newTask);
    console.log(this.taskService.tasksList);

    this.clearInputFields();
    form.resetForm();
  }

  // --------------- Delete and Clear ----------------

  async deleteTask(taskId: string | undefined) {
    if (!taskId) return;
    await this.taskService.deleteTask(taskId);
  }

  clearInputFields() {
    this.newTask = {
      title: '',
      description: '',
      due_date: Timestamp.now(),
      priority: 'Low',
      category: 'Technical Task',
      stage: 'To do',
      subtask: [],
      assigned_to: []
    };
    this.subtaskTitle = '';
  }

  // --------------- Subtask ----------------

  addSubtask() {
    this.newTask.subtask.push({ title: this.subtaskTitle, completed: false });
    this.subtaskTitle = '';
  }

  removeSubtask(index: number) {
    this.newTask.subtask.splice(index, 1);
  }

  // --------------- toggle assigned not yet working ---------------

  toggleAssigned(contact: Contact, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.newTask.assigned_to.push(contact);
    } else {
      this.newTask.assigned_to = this.newTask.assigned_to.filter(c => c.id !== contact.id);
    }
  }

}
