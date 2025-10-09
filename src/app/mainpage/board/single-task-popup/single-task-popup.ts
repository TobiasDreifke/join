import { Component, inject, Input, Output, EventEmitter, OnInit, SimpleChanges } from '@angular/core';
import { ContactService } from '../../../services/contact-service';
import { TaskService } from '../../../services/task-service';
import { TaskInterface } from '../../../interfaces/tasks.interface';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-single-task-popup',
  templateUrl: './single-task-popup.html',
   imports: [ CommonModule],
  styleUrls: ['./single-task-popup.scss']
})
export class SingleTaskPopup implements OnInit {
  taskService = inject(TaskService);
  contactService = inject(ContactService);

  @Input() taskId!: string;
  @Output() delete = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<string>();


  contactId: string | null = null;
  selectedTask: TaskInterface | undefined;

  constructor( private router: Router) {
    if (this.contactService.contactsList.length > 0) {
      this.contactId = this.contactService.contactsList[0].id || null;
    }
  }


  ngOnInit() {
    this.loadTask();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['taskId']) {
      this.loadTask();
    }
  }

  private loadTask() {
    this.selectedTask = this.taskService.tasksList.find(t => t.id === this.taskId);
  }

  onDelete() {
    this.delete.emit(this.taskId);
    this.close.emit();
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

  onEditTask() {
    if (this.taskId) {
      this.edit.emit(this.taskId);
      console.log("editing ID:", this.taskId);
      this.close.emit();
    }
  }
  async toggleSubtaskCompleted(subtaskIndex: number) {
  if (!this.selectedTask) return;
  this.selectedTask.subtask[subtaskIndex].completed = !this.selectedTask.subtask[subtaskIndex].completed;
    await this.taskService.updateTask(this.taskId, this.selectedTask);
}


 

}
