import { Component, inject } from '@angular/core';
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

@Component({
  selector: 'app-overview-tasks',
  imports: [SingleTaskCard, CdkDropList, CdkDrag],
  templateUrl: './overview-tasks.html',
  styleUrl: './overview-tasks.scss'
})
export class OverviewTasks {

  checkIndex = true;

  taskService = inject(TaskService);

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
      for (let i = 0; i < this.tasksList.length; i++) {
        if(this.tasksList[i].index !== this.taskService.tasksList[i].index || this.tasksList[i].stage !== this.taskService.tasksList[i].stage){
          if(this.checkIndex){
            this.setNewTasksData();
            return;
          }
        }
      }
    }
  }

  setNewTasksData(){
    this.tasksList = this.taskService.tasksList;
    this.getTasksToDo();
    this.getTasksInProgress();
    this.getTasksAwaitFeedback();
    this.getTasksDone();
  }

  async getTasksToDo() {
    let tasksToDo = this.tasksList.filter(task => task.stage === 'To do');
    tasksToDo = await this.checkIfTaskIsAddedNew(tasksToDo);
    tasksToDo.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));  
    this.toDoTasksFiltered.splice(0, this.toDoTasksFiltered.length, ...tasksToDo);
  }

  async getTasksInProgress(){
    let tasksInProgress = this.tasksList.filter(task => task.stage == 'In progress');
    tasksInProgress = await this.checkIfTaskIsAddedNew(tasksInProgress);
    tasksInProgress.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
    this.inProgressTasksFiltered.splice(0, this.inProgressTasksFiltered.length, ...tasksInProgress);
  }

  async getTasksAwaitFeedback(){
    let tasksAwaitFeedback = this.tasksList.filter(task => task.stage == 'Await feedback');
    tasksAwaitFeedback = await this.checkIfTaskIsAddedNew(tasksAwaitFeedback);
    tasksAwaitFeedback.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
    this.awaitFeedbackTasksFiltered.splice(0, this.awaitFeedbackTasksFiltered.length, ...tasksAwaitFeedback);
  }

  async getTasksDone(){
    const tasksDone = this.tasksList.filter(task => task.stage == 'Done');
    tasksDone.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
    this.doneTasksFiltered.splice(0, this.doneTasksFiltered.length, ...tasksDone);
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
      this.reorderListInternal(event.container.data);
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
    this.setNewTasksData();
    this.checkIndex = true;
  }
}
