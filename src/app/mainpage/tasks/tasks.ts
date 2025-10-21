import { Component, EventEmitter, inject, Input, Output, SimpleChanges, OnInit, HostListener } from '@angular/core';
import { TaskService } from '../../services/task-service';
import { ContactService } from '../../services/contact-service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { TaskInterface } from '../../interfaces/tasks.interface';
import { Timestamp } from '@angular/fire/firestore';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router, RouterLink } from '@angular/router';

/**
 * Component for adding, editing, and managing tasks.
 * 
 * Supports:
 * - Creating new tasks
 * - Editing existing tasks
 * - Managing subtasks
 * - Assigning contacts
 * - Responsive mode for mobile/desktop
 */
@Component({
  selector: 'app-tasks',
  imports: [CommonModule, FormsModule, NgSelectModule, RouterLink],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss'
})
export class Tasks {

  /** ID of the task being edited */
  @Input() taskId: string | null = null;

  /** Flag for edit mode */
  @Input() editMode = false;

  /** Flag for add mode */
  @Input() addMode = false;

  /** Emits when closing the task form */
  @Output() close = new EventEmitter<void>();

  /** Emits when a task is added to a specific stage */
  @Output() addToStage = new EventEmitter<string>();

  /** Stage of the task when adding */
  @Input() stage: "" | "To do" | "In progress" | "Await feedback" | "Done" = "To do";

  /** Router for navigation */
  router = inject(Router);

  /** Current screen width */
  screenWidth: number = window.innerWidth;

  /** Flag for responsive layout */
  isResponsive = false;

  /** Task being edited */
  edit: TaskInterface | undefined;

  /** New task object */
  newTask: TaskInterface = {
    title: '',
    description: '',
    due_date: Timestamp.now(),
    priority: 'Medium',
    category: '',
    stage: 'To do',
    subtask: [],
    assigned_to: []
  };

  /** Title for a new subtask */
  subtaskTitle = '';

  /** Currently selected contact ID for assignment */
  contactId: string | null = null;

  taskService = inject(TaskService);
  contactService = inject(ContactService);

  /** Formatted string for today's date */
  todayString: string = '';

  constructor() {
    if (this.contactService.contactsList.length > 0) {
      this.contactId = this.contactService.contactsList[0].id || null;
    }
    this.setTodayString();
    this.updateResponsiveState();
  }

  /** Returns the current task depending on mode */
  get targetTask(): TaskInterface {
    return this.editMode && this.edit ? this.edit : this.newTask;
  }

  /** Returns formatted due date string for binding */
  get targetTaskDueDateString(): string {
    const task = this.targetTask;
    if (!task.due_date) return this.todayString;
    if (task.due_date instanceof Timestamp) {
      return task.due_date.toDate().toISOString().split('T')[0];
    }
    return task.due_date as unknown as string;
  }

  /** Updates internal state when inputs change */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['stage'] && this.addMode) {
      this.newTask.stage = this.stage;
    }

    if (changes['taskId'] && this.taskId) {
      this.loadTask(this.taskId);
    }
  }

  /** Initializes component and sets default stage */
  ngOnInit() {
    this.screenWidth = window.innerWidth;
    this.updateResponsiveState();
    this.newTask.stage = this.stage;
  }

  /** Updates screen width and responsive state on window resize */
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
    this.updateResponsiveState();
  }

  /** Updates responsive flag based on edit mode */
  private updateResponsiveState() {
    if (this.editMode) {
      this.isResponsive = true;
    }
  }

  /** Switches mode between edit and add */
  switchMode(mode: 'edit' | 'add') {
    this.editMode = mode === 'edit';
    this.updateResponsiveState();
  }

  /** Sets today's date string for default values */
  setTodayString() {
    const today = new Date();
    this.todayString = today.toISOString().split('T')[0];
  }

  /** Updates due date of the target task */
  set targetTaskDueDateString(value: string) {
    const task = this.targetTask;
    task.due_date = Timestamp.fromDate(new Date(value));
  }

  /** Loads a task by ID for editing */
  loadTask(taskId: string) {
    const existing = this.taskService.tasksList.find(t => t.id === taskId);
    if (existing) {
      this.edit = existing;
    } else {
      this.edit = { ...this.newTask, id: taskId };
    }
  }

  /** Refreshes the edit reference if task was updated externally */
  refreshEditReference() {
    if (this.editMode && this.edit?.id) {
      const updated = this.taskService.tasksList.find(t => t.id === this.edit!.id);
      if (updated) {
        Object.assign(this.edit, updated);
      }
    }
  }

  /** Exits the form, closing edit/add mode or clearing inputs */
  onExit() {
    if (this.editMode) {
      this.closeEdit();
    } else if (this.addMode) {
      this.close.emit();
    } else {
      this.clearInputFields();
    }
  }

  /** Emits close event for editing */
  closeEdit() {
    this.close.emit();
  }

  /** Validates current task */
  isTaskValid(): boolean {
    if (!this.edit) return false;
    return !!this.edit.title && this.edit.title.length >= 2 && !!this.edit.category && !!this.edit.due_date;
  }

  /** Clears form inputs for a new task */
  clearInputFields(form?: NgForm) {
    this.newTask = {
      title: '',
      description: '',
      due_date: Timestamp.now(),
      priority: 'Medium',
      category: '',
      stage: '',
      subtask: [],
      assigned_to: []
    };

    form?.resetForm({
      title: '',
      description: '',
      due_date: this.todayString,
      priority: 'Medium',
      category: '',
      stage: this.stage || 'To do',
      subtask: [],
      assigned_to: []
    });

    this.subtaskTitle = '';
  }

  /**
   * Handles form submission for adding or saving a task
   * @param form NgForm instance
   */
  onSubmitOrSave(form: NgForm) {
    form.control.markAllAsTouched();

    if (!form.valid) return;

    if (this.editMode && this.edit) {
      this.taskService.updateTask(this.edit.id!, this.edit);
    } else {
      this.taskService.addTask(this.newTask);
      this.addToStage.emit(this.newTask.stage);
      this.clearInputFields(form);
      this.router.navigate(['/board']);
    }

    this.close.emit();

    if (this.addMode) {
      this.router.navigate(['/board']).then(() => {
        this.clearInputFields(form);
      });
    }
  }

  /** Deletes a task by ID */
  deleteTask(taskId: string | undefined) {
    if (!taskId) return;
    this.taskService.deleteTask(taskId);
  }

  /** Tracks which subtasks are in edit mode */
  subtaskEditMap: Record<number, boolean> = {};

  /** Stores original subtask titles for cancellation */
  subtaskOriginalMap: Record<number, string> = {};

  /** Toggles edit mode for a subtask */
  toggleEditSubtask(index: number) {
    const target = this.editMode ? this.edit! : this.newTask;
    const subtask = target.subtask[index];

    if (!this.subtaskEditMap[index]) {
      this.subtaskOriginalMap[index] = subtask.title;
    }
    this.subtaskEditMap[index] = !this.subtaskEditMap[index];
  }

  /** Confirms subtask edit */
  confirmEditSubtask(index: number) {
    this.subtaskEditMap[index] = false;
    delete this.subtaskOriginalMap[index];
  }

  /** Cancels subtask edit and restores original value */
  cancelEditSubtask(index: number) {
    const target = this.editMode ? this.edit! : this.newTask;
    const subtask = target.subtask[index];
    subtask.title = this.subtaskOriginalMap[index] ?? subtask.title;
    this.subtaskEditMap[index] = false;
    delete this.subtaskOriginalMap[index];
  }

  /** Adds a new subtask */
  addSubtask() {
    const target = this.editMode ? this.edit! : this.newTask;
    target.subtask.push({
      title: this.subtaskTitle,
      completed: false,
    });
    this.subtaskTitle = '';
  }

  /** Removes a subtask by index */
  removeSubtask(index: number) {
    const target = this.editMode ? this.edit! : this.newTask;
    target.subtask.splice(index, 1);
  }

  /** Cancels subtask input */
  cancelSubtask() {
    this.subtaskTitle = '';
  }

  /**
   * Generates initials for a contact name
   * @param name Full name string
   */
  initials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(' ').filter(p => p);
    return parts.length <= 2
      ? parts.map(p => p[0].toUpperCase()).join('')
      : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  /** Checks if a contact is assigned to the current task */
  isAssigned(contact: any): boolean {
    const target = this.editMode ? this.edit! : this.newTask;
    return target.assigned_to?.some((c: any) => c.id === contact.id);
  }

  /** Toggles assignment of a contact to the current task */
  toggleAssigned(contact: any) {
    const target = this.editMode ? this.edit! : this.newTask;
    if (this.isAssigned(contact)) {
      target.assigned_to = target.assigned_to.filter((c: any) => c.id !== contact.id);
    } else {
      target.assigned_to = [...(target.assigned_to || []), contact];
    }
  }
}
