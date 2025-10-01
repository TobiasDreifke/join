import { Component, inject } from '@angular/core';
import { TaskService } from '../../services/task-service';
import { ContactService } from '../../services/contact-service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { TaskInterface } from '../../interfaces/tasks.interface';
import { Timestamp } from '@angular/fire/firestore';
@Component({
  selector: 'app-tasks',
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss'
})
export class Tasks {
  taskService = inject(TaskService)
  contactService = inject(ContactService);
  contactId: string | null = null;
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
    await this.taskService.addTask(this.newTask);
    this.clearInputFields();
    form.resetForm();
  }

  async deleteTask(taskId: string | undefined) {
    if (!taskId) return;
    await this.taskService.deleteTask(taskId);
  }

  clearInputFields() {
    this.newTask = {
      title: '',
      description: '',
      due_date: Timestamp.now(),
      priority: '',
      category: '',
      stage: '',
      subtask: [],
      assigned_to: []
    };
    this.subtaskTitle = '';
  }

  addSubtask() {
    this.newTask.subtask.push({ title: this.subtaskTitle, completed: false });
    this.subtaskTitle = '';
  }

  removeSubtask(index: number) {
    this.newTask.subtask.splice(index, 1);
  }

  toggleAssigned(contact: Contact, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.newTask.assigned_to.push(contact);
    } else {
      this.newTask.assigned_to = this.newTask.assigned_to.filter(c => c.id !== contact.id);
    }
  }
}