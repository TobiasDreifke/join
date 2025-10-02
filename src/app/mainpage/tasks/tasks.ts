import { Component, inject } from '@angular/core';
import { TaskService } from '../../services/task-service';
import { ContactService } from '../../services/contact-service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { TaskInterface } from '../../interfaces/tasks.interface';
import { Timestamp } from '@angular/fire/firestore';
import { NgSelectModule } from '@ng-select/ng-select';
@Component({
  selector: 'app-tasks',
  imports: [CommonModule, FormsModule, NgSelectModule],
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

  initials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(' ').filter(p => p);
    if (parts.length <= 2) {
      return parts.map(p => p[0].toUpperCase()).join('');
    } else {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
  }

  isAssigned(contact: any): boolean {
    return this.newTask.assigned_to?.some((c: any) => c.id === contact.id);
  }

  toggleAssigned(contact: any) {
    if (this.isAssigned(contact)) {
      this.newTask.assigned_to = this.newTask.assigned_to.filter((c: any) => c.id !== contact.id);
    } else {
      this.newTask.assigned_to = [...(this.newTask.assigned_to || []), contact];
    }
  }
}