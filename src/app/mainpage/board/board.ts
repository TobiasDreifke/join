import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TaskService } from '../../services/task-service';
import { ContactService } from '../../services/contact-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OverviewTasks } from './overview-tasks/overview-tasks';
import { SearchbarHeader } from './searchbar-header/searchbar-header';
import { SingleTaskPopup } from './single-task-popup/single-task-popup';
import { Tasks } from '../tasks/tasks';

/**
 * Main board component displaying tasks in stages, search, and task popups.
 * 
 * Manages task selection, editing, adding new tasks, and filtering via search.
 */
@Component({
  selector: 'app-board',
  imports: [CommonModule, OverviewTasks, SearchbarHeader, SingleTaskPopup, FormsModule, Tasks],
  templateUrl: './board.html',
  styleUrl: './board.scss'
})
export class Board {

  /** Currently selected task ID for popup */
  selectedTaskId: string | null = null;

  /** Indicates if edit mode is active */
  editMode = false;

  /** Indicates if add mode is active */
  addMode = false;

  /** ID of the task being edited */
  editingTaskId: string | null = null;

  /** Injected task service */
  taskService = inject(TaskService);

  /** Injected contact service */
  contactService = inject(ContactService);

  /** Currently selected contact ID */
  contactId: string | null = null;

  /** Current search term for filtering tasks */
  searchTerm: string = '';

  /** Stage for newly added task */
  stageForNewTask: "" | "To do" | "In progress" | "Await feedback" | "Done" = "To do";

  /**
   * Deletes a task by its ID
   * @param taskId ID of the task to delete
   */
  async deleteTask(taskId: string | undefined) {
    if (!taskId) return;
    await this.taskService.deleteTask(taskId);
  }

  /**
   * Opens the task popup for a specific task
   * @param taskId ID of the task to open
   */
  openTaskPopup(taskId: string) {
    this.editMode = false;
    this.selectedTaskId = taskId;
    console.log("opening ID", this.selectedTaskId);
  }

  /** Closes the task popup */
  closePopup() {
    this.selectedTaskId = null;
  }

  /**
   * Handles search input result
   * @param result The search term entered by the user
   */
  handleSearch(result: string) {
    this.searchTerm = result;
  }

  /**
   * Opens the edit mode for a specific task
   * @param taskId ID of the task to edit
   */
  onEditTask(taskId: string) {
    this.selectedTaskId = null;
    this.editingTaskId = taskId;
    this.editMode = true;
  }

  /** Closes edit mode */
  closeEdit() {
    this.editMode = false;
    this.editingTaskId = null;
  }

  /**
   * Sets the selected task ID
   * @param taskId ID of the task to select
   */
  setSelectedTaskId(taskId: string) {
    this.selectedTaskId = taskId;
  }

  /** Activates add mode for a new task (default stage: "To do") */
  addTask() {
    this.stageForNewTask = "To do";
    this.selectedTaskId = null;
    this.editingTaskId = null;
    this.addMode = true;
  }

  /**
   * Activates add mode for a new task in a specific stage
   * @param stage Stage to assign the new task to
   */
  addTaskWithStage(stage: string) {
    this.stageForNewTask = stage as "" | "To do" | "In progress" | "Await feedback" | "Done";
    this.selectedTaskId = null;
    this.editingTaskId = null;
    this.addMode = true;
  }

  /** Closes add mode */
  closeAdd() {
    this.addMode = false;
    this.editingTaskId = null;
  }
}
