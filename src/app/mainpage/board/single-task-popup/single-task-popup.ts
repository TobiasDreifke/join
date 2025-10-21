import { Component, inject, Input, Output, EventEmitter, OnInit, SimpleChanges } from '@angular/core';
import { ContactService } from '../../../services/contact-service';
import { TaskService } from '../../../services/task-service';
import { TaskInterface } from '../../../interfaces/tasks.interface';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { updateDoc } from '@angular/fire/firestore';

/**
 * Popup component to display a single task with details and subtasks.
 * 
 * Supports editing, deleting, closing the popup, and toggling subtasks as completed.
 */
@Component({
  selector: 'app-single-task-popup',
  templateUrl: './single-task-popup.html',
  imports: [CommonModule],
  styleUrls: ['./single-task-popup.scss']
})
export class SingleTaskPopup implements OnInit {

  /** Injected task service */
  taskService = inject(TaskService);

  /** Injected contact service */
  contactService = inject(ContactService);

  /** ID of the task to display in the popup */
  @Input() taskId!: string;

  /** Emits the task ID when deletion is requested */
  @Output() delete = new EventEmitter<string>();

  /** Emits when the popup should be closed */
  @Output() close = new EventEmitter<void>();

  /** Emits the task ID when editing is requested */
  @Output() edit = new EventEmitter<string>();

  /** ID of the first contact, used for assigning tasks */
  contactId: string | null = null;

  /** Currently selected task object */
  selectedTask: TaskInterface | undefined;

  constructor(private router: Router) {
    if (this.contactService.contactsList.length > 0) {
      this.contactId = this.contactService.contactsList[0].id || null;
    }
  }

  /** Lifecycle hook: initialize and load the task */
  ngOnInit() {
    this.loadTask();
  }

  /**
   * Lifecycle hook: detect changes to inputs
   * @param changes Changes object containing updated inputs
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['taskId']) {
      this.loadTask();
    }
  }

  /**
   * Loads the task based on `taskId`
   */
  private loadTask() {
    this.selectedTask = this.taskService.tasksList.find(t => t.id === this.taskId);
  }

  /**
   * Deletes the task and closes the popup
   */
  onDelete() {
    this.delete.emit(this.taskId);
    this.close.emit();
  }

  /**
   * Closes the popup without any additional actions
   */
  onClose() {
    this.close.emit();
  }

  /**
   * Generates initials from a full name
   * @param name Full name string
   * @returns Uppercase initials
   */
  getInitials(name?: string): string {
    if (!name) return '';
    const parts = name.trim().split(' ').filter(p => p);
    if (parts.length <= 2) {
      return parts.map(p => p[0].toUpperCase()).join('');
    } else {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
  }

  /**
   * Formats a due date as a readable string
   * @param due Firestore timestamp or Date
   * @returns Date string in "dd/mm/yyyy" format
   */
  formatDueDate(due: any): string {
    if (!due) return '';
    const date = due.toDate ? due.toDate() : new Date(due);
    return date.toLocaleDateString('en-GB');
  }

  /**
   * Emits edit event for the current task and closes the popup
   */
  onEditTask() {
    if (this.taskId) {
      this.edit.emit(this.taskId);
      console.log("editing ID:", this.taskId);
      this.close.emit();
    }
  }

  /**
   * Toggles the completed status of a subtask
   * @param subtaskIndex Index of the subtask to toggle
   */
  async toggleSubtaskCompleted(subtaskIndex: number) {
    if (!this.selectedTask) return;
    this.selectedTask.subtask[subtaskIndex].completed = !this.selectedTask.subtask[subtaskIndex].completed;
    await this.taskService.updateTask(this.taskId, this.selectedTask);
  }
}
