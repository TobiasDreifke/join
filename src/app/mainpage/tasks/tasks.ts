import { Component, EventEmitter, inject, Input, Output, SimpleChanges, OnInit, OnDestroy } from '@angular/core';
import { TaskService } from '../../services/task-service';
import { ContactService } from '../../services/contact-service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { TaskInterface } from '../../interfaces/tasks.interface';
import { Timestamp } from '@angular/fire/firestore';
import { NgSelectModule } from '@ng-select/ng-select';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tasks',
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss'
})
export class Tasks {
  @Input() taskId: string | null = null;
  @Input() editMode = false;
  @Output() close = new EventEmitter<void>();

  // ---------------- TASK REFERENCES ----------------
  edit: TaskInterface | undefined;
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
  subtaskTitle = '';
  contactId: string | null = null;

  // ---------------- SERVICES ----------------
  taskService = inject(TaskService);
  contactService = inject(ContactService);

  constructor() {
    if (this.contactService.contactsList.length > 0) {
      this.contactId = this.contactService.contactsList[0].id || null;
    }
  }

  get targetTask(): TaskInterface {
    return this.editMode && this.edit ? this.edit : this.newTask;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['taskId'] && this.taskId) {
      this.loadTask(this.taskId);
    }
  }

  // ---------------- EDIT TASK ----------------
  loadTask(taskId: string) {
    const existing = this.taskService.tasksList.find(t => t.id === taskId);
    if (existing) {
      this.edit = existing;
    } else {
      this.edit = { ...this.newTask, id: taskId };
    }
  }

  saveTask() {
    if (!this.edit) return;
    if (this.editMode && this.edit.id) {
      this.taskService.updateTask(this.edit.id, this.edit);
    } else {
      this.taskService.addTask(this.edit);
    }
    this.close.emit();
  }

  refreshEditReference() {
    if (this.editMode && this.edit?.id) {
      const updated = this.taskService.tasksList.find(t => t.id === this.edit!.id);
      if (updated) {
        Object.assign(this.edit, updated); 
      }
    }
  }

  onExit() {
    if (this.editMode) {
      this.closeEdit();
    } else {
      this.clearInputFields();
    }
  }

  closeEdit() {
    this.close.emit();
  }

  // ---------------- ADD TASK ----------------
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

  onSubmit(form: NgForm) {
    this.taskService.addTask(this.newTask);
    this.clearInputFields();
    form.resetForm();
  }

  deleteTask(taskId: string | undefined) {
    if (!taskId) return;
    this.taskService.deleteTask(taskId);
  }

  // ---------------- SUBTASKS ----------------
  addSubtask() {
    const target = this.editMode ? this.edit! : this.newTask;
    target.subtask.push({ title: this.subtaskTitle, completed: false });
    this.subtaskTitle = '';
  }

  removeSubtask(index: number) {
    const target = this.editMode ? this.edit! : this.newTask;
    target.subtask.splice(index, 1);
  }

  // ---------------- ASSIGNED TO / INITIALS ----------------
  initials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(' ').filter(p => p);
    return parts.length <= 2
      ? parts.map(p => p[0].toUpperCase()).join('')
      : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  isAssigned(contact: any): boolean {
    const target = this.editMode ? this.edit! : this.newTask;
    return target.assigned_to?.some((c: any) => c.id === contact.id);
  }

  toggleAssigned(contact: any) {
    const target = this.editMode ? this.edit! : this.newTask;
    if (this.isAssigned(contact)) {
      target.assigned_to = target.assigned_to.filter((c: any) => c.id !== contact.id);
    } else {
      target.assigned_to = [...(target.assigned_to || []), contact];
    }
  }
}
