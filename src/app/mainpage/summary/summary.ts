import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task-service';
import { AuthService } from '../../services/auth-service';
import { TaskInterface } from '../../interfaces/tasks.interface';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.html',
  styleUrls: ['./summary.scss']
  styleUrls: ['./summary.scss']
})
export class Summary implements OnInit {
export class Summary implements OnInit {

  router = inject(Router);
  taskService = inject(TaskService);
  authService = inject(AuthService);  

  userName: string = 'Guest';  

  todoCount = 0;
  doneCount = 0;
  inProgressCount = 0;
  feedbackCount = 0;
  totalCount = 0;
  urgentCount = 0;
  todayDate!: string;

  ngOnInit() {
    this.todayDate = this.getTodayDate();
    this.getUserName();      
    this.observeTasks();
  }

  getUserName() {
    const name = this.authService.getDisplayName();
    if (name) {
      this.userName = name;
    }
  }

  getTodayDate(): string {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString('en-US', options);
  }

  observeTasks() {
    const interval = setInterval(() => {
      if (this.taskService.tasksList.length > 0) {
        this.updateTaskCounts(this.taskService.tasksList);
        clearInterval(interval);
      }
    }, 500);

    setTimeout(() => clearInterval(interval), 5000);
  }

  updateTaskCounts(allTasks: TaskInterface[]) {
    this.todoCount = allTasks.filter(t => t.stage === 'To do').length;
    this.inProgressCount = allTasks.filter(t => t.stage === 'In progress').length;
    this.feedbackCount = allTasks.filter(t => t.stage === 'Await feedback').length;
    this.doneCount = allTasks.filter(t => t.stage === 'Done').length;
    this.totalCount = allTasks.length - 10;
    this.urgentCount = allTasks.filter(t => t.priority === 'Urgent').length;
  }

  goToBoard() {
    this.router.navigate(['/board']);
  }
}
