import { Component, EventEmitter, inject, Input, Output, SimpleChanges, OnInit, OnDestroy, HostListener } from '@angular/core';
import { TaskService } from '../../services/task-service';
import { ContactService } from '../../services/contact-service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { TaskInterface } from '../../interfaces/tasks.interface';
import { Timestamp } from '@angular/fire/firestore';
import { NgSelectModule } from '@ng-select/ng-select';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-tasks',
  imports: [CommonModule, FormsModule, NgSelectModule, RouterLink],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss'
})
export class Tasks {
  @Input() taskId: string | null = null;
  @Input() editMode = false;
  @Input() addMode = false;
  @Output() close = new EventEmitter<void>();
  @Output() addToStage = new EventEmitter<string>();
  @Input() stage: "" | "To do" | "In progress" | "Await feedback" | "Done" = "To do";
  router = inject(Router);
  screenWidth: number = window.innerWidth;
  isResponsive = false;
  // ---------------- TASK REFERENCES ----------------
  edit: TaskInterface | undefined;
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
  subtaskTitle = '';
  contactId: string | null = null;

  // ---------------- SERVICES ----------------
  taskService = inject(TaskService);
  contactService = inject(ContactService);
  todayString: string = '';

  constructor() {
    if (this.contactService.contactsList.length > 0) {
      this.contactId = this.contactService.contactsList[0].id || null;
    }
    this.setTodayString();
    this.updateResponsiveState();

  }

  get targetTask(): TaskInterface {
    return this.editMode && this.edit ? this.edit : this.newTask;
  }

  get targetTaskDueDateString(): string {
    const task = this.targetTask;
    if (!task.due_date) return this.todayString;
    if (task.due_date instanceof Timestamp) {
      return task.due_date.toDate().toISOString().split('T')[0];
    }
    return task.due_date as unknown as string;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['editMode'] || changes['addMode']) {
    }

    if (changes['stage'] && this.addMode) {
      this.newTask.stage = this.stage;
    }

    if (changes['taskId'] && this.taskId) {
      this.loadTask(this.taskId);
    }
  }


  ngOnInit() {
    this.screenWidth = window.innerWidth;
    this.updateResponsiveState();
    this.newTask.stage = this.stage;
  }


  // --------- FORCE RESPONSIVE IN EDITMODE ---------------

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
    this.updateResponsiveState();
  }

  private updateResponsiveState() {
    if (this.editMode) {
      this.isResponsive = true;
    } 
    // else {
    //   this.isResponsive = this.screenWidth <= 1080;
    // }
  }

  switchMode(mode: 'edit' | 'add') {
    this.editMode = mode === 'edit';
    this.updateResponsiveState();
  }

  // --------------- SETTING THE DATE --------------
  setTodayString() {
    const today = new Date();
    this.todayString = today.toISOString().split('T')[0];
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
    } else if (this.addMode) {
      this.close.emit();
    } else {
      this.clearInputFields();
    }
  }

  closeEdit() {
    this.close.emit();
  }

  isTaskValid(): boolean {
    if (!this.edit) return false;
    return !!this.edit.title && this.edit.title.length >= 2 && !!this.edit.category && !!this.edit.due_date;
  }

  // ---------------- ADD TASK ----------------


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

  onSubmitOrSave(form: NgForm) {
    form.control.markAllAsTouched();

    if (!form.valid) return;

    if (this.editMode && this.edit) {
      this.taskService.updateTask(this.edit.id!, this.edit);
    } else {
      this.taskService.addTask(this.newTask);
      this.addToStage.emit(this.newTask.stage);
      this.clearInputFields(form);
      this.router.navigate(['/board'])

    }

    this.close.emit();

    if (this.addMode) {
      this.router.navigate(['/board']).then(() => {
        this.clearInputFields(form);
      });
    }
  }



  deleteTask(taskId: string | undefined) {
    if (!taskId) return;
    this.taskService.deleteTask(taskId);
  }

  // ---------------- SUBTASKS LIST EDIT ----------------
  subtaskEditMap: Record<number, boolean> = {};
  subtaskOriginalMap: Record<number, string> = {};

  toggleEditSubtask(index: number) {
    const target = this.editMode ? this.edit! : this.newTask;
    const subtask = target.subtask[index];

    if (!this.subtaskEditMap[index]) {
      this.subtaskOriginalMap[index] = subtask.title;
    }
    this.subtaskEditMap[index] = !this.subtaskEditMap[index];
  }

  confirmEditSubtask(index: number) {
    this.subtaskEditMap[index] = false;
    delete this.subtaskOriginalMap[index];
  }

  cancelEditSubtask(index: number) {
    const target = this.editMode ? this.edit! : this.newTask;
    const subtask = target.subtask[index];
    subtask.title = this.subtaskOriginalMap[index] ?? subtask.title;
    this.subtaskEditMap[index] = false;
    delete this.subtaskOriginalMap[index];
  }

  // ---------------- SUBTASKS ----------------
  addSubtask() {
    const target = this.editMode ? this.edit! : this.newTask;
    target.subtask.push({
      title: this.subtaskTitle,
      completed: false,
    });
    this.subtaskTitle = '';
  }

  removeSubtask(index: number) {
    const target = this.editMode ? this.edit! : this.newTask;
    target.subtask.splice(index, 1);
  }

  cancelSubtask() {
    this.subtaskTitle = '';
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
