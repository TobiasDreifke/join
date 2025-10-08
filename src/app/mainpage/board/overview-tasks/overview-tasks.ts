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

@Component({
  selector: 'app-overview-tasks',
  imports: [SingleTaskCard, CdkDropList, CdkDrag],
  templateUrl: './overview-tasks.html',
  styleUrl: './overview-tasks.scss'
})
export class OverviewTasks {

  isSmallScreen = window.innerWidth <= 1080;
  checkIndex = true;
  searchTerm = '';
  taskService = inject(TaskService);

  @Output() selectedTaskId = new EventEmitter<string>();
  @Input()
  set searchTermForTask(term: string){
    this.searchTerm = term.trim().toLowerCase();
    this.setNewTasksData();
  }
  @HostListener('window:resize')
  onResize(){
    this.isSmallScreen = window.innerWidth <= 1080;
  }

  tasksList: TaskInterface[] = [];
  toDoTasksFiltered: TaskInterface[] = [];
  inProgressTasksFiltered: TaskInterface[] = [];
  awaitFeedbackTasksFiltered: TaskInterface[] = [];
  doneTasksFiltered: TaskInterface[] = [];
  
  constructor() {}

  ngDoCheck() {
    if(this.tasksList.length !== this.taskService.tasksList.length){
      this.setNewTasksData();
    }else{
      const hasChanged = !isEqual(this.tasksList, this.taskService.tasksList);
      if (hasChanged && this.checkIndex) {
        this.setNewTasksData();
        console.log("Änderungen");
      }
    }
  }

  setNewTasksData(){
    console.log("Render");
    this.tasksList = this.taskService.tasksList;
    this.getTasksToDo();
    this.getTasksInProgress();
    this.getTasksAwaitFeedback();
    this.getTasksDone();
  }

  async getTasksToDo() {
    this.toDoTasksFiltered = await this.filterTasksForView('To do');
  }

  async getTasksInProgress(){
    this.inProgressTasksFiltered = await this.filterTasksForView('In progress');
  }

  async getTasksAwaitFeedback(){
    this.awaitFeedbackTasksFiltered = await this.filterTasksForView('Await feedback');
  }

  async getTasksDone(){
    this.doneTasksFiltered = await this.filterTasksForView('Done');
  }

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

  getCleanJsonWithIndexZero(obj: TaskInterface){
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

  async reorderListInternal(eventList: TaskInterface[], event?: CdkDragDrop<TaskInterface[]>) {
    const updatePromises = eventList.map((item, idx) => {
      item.index = idx;
      if(event){
        if(item.id === event.container.data[event.currentIndex].id){
          item.stage = this.getStageByListId(event.container.id);
        }
      }
      return this.taskService.updateTask(item.id!, item);
    });
    await Promise.all(updatePromises);
  }

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

  async changeStageOfTask(event: CdkDragDrop<TaskInterface[]>){
    this.checkIndex = false;
    await this.reorderListInternal(event.container.data, event);
    // this.setNewTasksData();
    this.checkIndex = true;
  }

  getSelectedTaskId(taskId: string){
    this.selectedTaskId.emit(taskId);
  }
}
