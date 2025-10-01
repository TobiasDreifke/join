import { Component, inject, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ContactService } from '../../../services/contact-service';
import { TaskService } from '../../../services/task-service';
import { TaskInterface } from '../../../interfaces/tasks.interface';


@Component({
  selector: 'app-single-task-popup',
  templateUrl: './single-task-popup.html',
  styleUrls: ['./single-task-popup.scss']
})
export class SingleTaskPopup implements OnInit {
  taskService = inject(TaskService);
  contactService = inject(ContactService);

  @Input() taskId!: string;
  @Output() delete = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();




  contactId: string | null = null;
  selectedTask: TaskInterface | undefined;

  constructor() {
    if (this.contactService.contactsList.length > 0) {
      this.contactId = this.contactService.contactsList[0].id || null;
    }
  }

  ngOnInit() {
    this.selectedTask = this.taskService.tasksList.find(t => t.id === this.taskId);
  }

  onDelete() {
    this.delete.emit(this.taskId);
  }

  onClose() {
    this.close.emit();
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

  formatDueDate(due: any): string {
    if (!due) return '';
    const date = due.toDate ? due.toDate() : new Date(due);
    return date.toLocaleDateString('en-GB');
  }
}
