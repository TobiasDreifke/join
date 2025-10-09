import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TaskService } from '../../services/task-service';
import { ContactService } from '../../services/contact-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OverviewTasks } from './overview-tasks/overview-tasks';
import { SearchbarHeader } from './searchbar-header/searchbar-header';
import { SingleTaskPopup } from './single-task-popup/single-task-popup';
import { Tasks } from '../tasks/tasks';

@Component({
  selector: 'app-board',
  imports: [CommonModule, OverviewTasks, SearchbarHeader, SingleTaskPopup, FormsModule, Tasks],
  templateUrl: './board.html',
  styleUrl: './board.scss'
})
export class Board {

  selectedTaskId: string | null = null;
  editMode = false;
  addMode = false;
  editingTaskId: string | null = null;

  taskService = inject(TaskService)
  contactService = inject(ContactService);

  contactId: string | null = null;
  searchTerm: string = '';

  stageForNewTask: "" | "To do" | "In progress" | "Await feedback" | "Done" = "To do";


  async deleteTask(taskId: string | undefined) {
    if (!taskId) return;
    await this.taskService.deleteTask(taskId);
  }

  openTaskPopup(taskId: string) {
    this.editMode = false;
    this.selectedTaskId = taskId;
    console.log("opening ID", this.selectedTaskId);
  }

  closePopup() {
    this.selectedTaskId = null;
  }

  handleSearch(result: string) {
    this.searchTerm = result;
  }

  onEditTask(taskId: string) {
    this.selectedTaskId = null;
    this.editingTaskId = taskId;
    this.editMode = true;
  }

  closeEdit() {
    this.editMode = false;
    this.editingTaskId = null;
  }

  setSelectedTaskId(taskId: string) {
    this.selectedTaskId = taskId;
  }

  addTask() {
    this.stageForNewTask = "To do";
    this.selectedTaskId = null;
    this.editingTaskId = null;
    this.addMode = true;
  }

  addTaskWithStage(stage: string) {
  this.stageForNewTask = stage as "" | "To do" | "In progress" | "Await feedback" | "Done";
    this.selectedTaskId = null;
    this.editingTaskId = null;
    this.addMode = true;
  }

  closeAdd() {
    this.addMode = false;
    this.editingTaskId = null;
  }

}
