import { Component, EventEmitter, HostListener, inject, Input, Output } from '@angular/core';
import { SingleTaskCard } from './single-task-card/single-task-card';
import { TaskInterface } from '../../../interfaces/tasks.interface';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList
} from '@angular/cdk/drag-drop';
import { TaskService } from '../../../services/task-service';
import { isEqual } from 'lodash';
import { Router } from '@angular/router';

/**
 * Component that displays an overview of tasks divided into stages (To do, In progress, Await feedback, Done)
 * 
 * This component supports drag-and-drop of tasks between stages and filtering by search term.
 */
@Component({
  selector: 'app-overview-tasks',
  imports: [SingleTaskCard, CdkDropList, CdkDrag],
  templateUrl: './overview-tasks.html',
  styleUrl: './overview-tasks.scss'
})
export class OverviewTasks {

  /** Indicates if the screen width is small (≤1080px) */
  isSmallScreen = window.innerWidth <= 1080;

  /** Used to prevent multiple index updates at the same time */
  checkIndex = true;

  /** Current search term for filtering tasks */
  searchTerm = '';

  /** Task service instance injected */
  taskService = inject(TaskService);

  /** Router instance injected for navigation */
  router = inject(Router);

  /** Event emitted when a new task should be added to a stage */
  @Output() addTaskToStage = new EventEmitter<string>();

  /** Event emitted when a task is selected */
  @Output() selectedTaskId = new EventEmitter<string>();

  /**
   * Input property to set the search term for tasks.
   * Trims and lowercases the term, then refreshes filtered task data.
   */
  @Input()
  set searchTermForTask(term: string) {
    this.searchTerm = term.trim().toLowerCase();
    this.setNewTasksData();
  }

  /** Updates screen size when window is resized */
  @HostListener('window:resize')
  onResize() {
    this.isSmallScreen = window.innerWidth <= 1080;
  }

  /** Full list of tasks from the service */
  tasksList: TaskInterface[] = [];

  /** Tasks filtered for each stage */
  toDoTasksFiltered: TaskInterface[] = [];
  inProgressTasksFiltered: TaskInterface[] = [];
  awaitFeedbackTasksFiltered: TaskInterface[] = [];
  doneTasksFiltered: TaskInterface[] = [];

  constructor() { }

  /**
   * Lifecycle hook to detect changes in the tasks list and update filtered views
   */
  ngDoCheck() {
    if (this.tasksList.length !== this.taskService.tasksList.length) {
      this.setNewTasksData();
    } else {
      const hasChanged = !isEqual(this.tasksList, this.taskService.tasksList);
      if (hasChanged && this.checkIndex) {
        this.setNewTasksData();
      }
    }
  }

  /**
   * Refreshes all task lists by stage
   */
  setNewTasksData() {
    this.tasksList = this.taskService.tasksList;
    this.getTasksToDo();
    this.getTasksInProgress();
    this.getTasksAwaitFeedback();
    this.getTasksDone();
  }

  /** Filters tasks for "To do" stage */
  async getTasksToDo() {
    this.toDoTasksFiltered = await this.filterTasksForView('To do');
  }

  /** Filters tasks for "In progress" stage */
  async getTasksInProgress() {
    this.inProgressTasksFiltered = await this.filterTasksForView('In progress');
  }

  /** Filters tasks for "Await feedback" stage */
  async getTasksAwaitFeedback() {
    this.awaitFeedbackTasksFiltered = await this.filterTasksForView('Await feedback');
  }

  /** Filters tasks for "Done" stage */
  async getTasksDone() {
    this.doneTasksFiltered = await this.filterTasksForView('Done');
  }

  /**
   * Checks if tasks have undefined indexes and updates them
   * @param tasksList List of tasks to check
   * @returns Updated tasks list
   */
  async checkIfTaskIsAddedNew(tasksList: TaskInterface[]) {
    const hasNoIndexTask = tasksList.some(task => task.index === undefined);
    if (hasNoIndexTask) {
      this.checkIndex = false;
      for (const task of tasksList) {
        if (task.index !== undefined) {
          task.index += 1;
          await this.taskService.updateTask(task.id!, task);
        } else {
          const updatedTask = this.getCleanJsonWithIndexZero(task);
          await this.taskService.updateTask(task.id!, updatedTask);
        }
      }
      this.checkIndex = true;
    }
    return tasksList;
  }

  /**
   * Filters tasks by stage and search term
   * @param stage Stage name to filter
   * @returns Filtered and sorted tasks
   */
  async filterTasksForView(stage: string) {
    let tasksToDo = this.tasksList.filter(task => {
      const stageMatch = task.stage === stage;
      const searchTermMatchTitle = this.searchTerm.length >= 1 ? task.title?.toLowerCase().includes(this.searchTerm) : true;
      const searchTermMatchDescription = this.searchTerm.length >= 1 ? task.description?.toLowerCase().includes(this.searchTerm) : true;
      return stageMatch && (searchTermMatchTitle || searchTermMatchDescription);
    });
    tasksToDo = await this.checkIfTaskIsAddedNew(tasksToDo);
    tasksToDo.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
    return tasksToDo;
  }

  /**
   * Returns a clean task object with index set to 0
   * @param obj Task object
   */
  getCleanJsonWithIndexZero(obj: TaskInterface) {
    return {
      index: 0,
      title: obj.title,
      description: obj.description,
      due_date: obj.due_date,
      priority: obj.priority,
      category: obj.category,
      stage: obj.stage,
      subtask: obj.subtask || [],
      assigned_to: obj.assigned_to,
    }
  }

  /**
   * Maps a cdk-drop-list ID to its corresponding stage
   * @param id Drop list ID
   * @returns Stage name
   */
  getStageByListId(id: string): "To do" | "In progress" | "Await feedback" | "Done" {
    switch (id) {
      case 'cdk-drop-list-0':
        return 'To do';
      case 'cdk-drop-list-1':
        return 'In progress';
      case 'cdk-drop-list-2':
        return 'Await feedback';
      case 'cdk-drop-list-3':
        return 'Done';
      default:
        return 'To do';
    }
  }

  /**
   * Updates indexes of tasks and optionally their stage after drag/drop
   * @param eventList List of tasks to reorder
   * @param event Optional drag-drop event
   */
  async reorderListInternal(eventList: TaskInterface[], event?: CdkDragDrop<TaskInterface[]>) {
    const updatePromises = eventList.map((item, idx) => {
      item.index = idx;
      if (event) {
        if (item.id === event.container.data[event.currentIndex].id) {
          item.stage = this.getStageByListId(event.container.id);
        }
      }
      return this.taskService.updateTask(item.id!, item);
    });
    await Promise.all(updatePromises);
  }

  /**
   * Handles task drop events from drag and drop
   * @param event CdkDragDrop event
   */
  drop(event: CdkDragDrop<TaskInterface[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.changeStageOfTask(event);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.changeStageOfTask(event);
    }
  }

  /**
   * Updates tasks after drag-drop stage change
   * @param event CdkDragDrop event
   */
  async changeStageOfTask(event: CdkDragDrop<TaskInterface[]>) {
    this.checkIndex = false;
    await this.reorderListInternal(event.container.data, event);
    this.checkIndex = true;
  }

  /**
   * Emits the selected task ID
   * @param taskId Task ID
   */
  getSelectedTaskId(taskId: string) {
    this.selectedTaskId.emit(taskId);
  }

  /**
   * Adds a new task to a stage or navigates to tasks page on small screens
   * @param stage Stage name
   */
  addTask(stage: string) {
    if (window.innerWidth >= 1080) {
      this.addTaskToStage.emit(stage);
    } else {
      this.router.navigate(['/tasks']);
    }
  }
}
