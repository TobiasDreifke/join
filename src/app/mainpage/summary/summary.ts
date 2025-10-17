import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task-service';
import { AuthService } from '../../services/auth-service';
import { TaskInterface } from '../../interfaces/tasks.interface';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.html',
  styleUrls: ['./summary.scss']

})
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
  showWelcome = false;
  showMainContent = true;


  ngOnInit() {
    this.todayDate = this.getTodayDate();
    this.getUserName();
    this.observeTasks();
    this.checkScreenWidth();
  }

  checkScreenWidth() {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    const isGuestLogin = localStorage.getItem('guestLogin');
    if (!hasSeenWelcome && window.innerWidth <= 1080) {
      this.showWelcome = true;
      this.showMainContent = false;
      setTimeout(() => {
        this.showWelcome = false;
        this.showMainContent = true;

        localStorage.setItem('hasSeenWelcome', 'true');

        if (!isGuestLogin) {
          this.router.navigate(['/summary']);
        }
      }, 3000);
    } else {
      this.showWelcome = false;
      this.showMainContent = true;
      if (!isGuestLogin) {
        this.router.navigate(['/summary']);
      }
    }
  }



  getUserName() {
    const isGuestLogin = localStorage.getItem('guestLogin');

    if (isGuestLogin) {
      this.userName = 'Guest';
    } else {
      const name = this.authService.getDisplayName();
      this.userName = name ? name : 'Guest';
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
    this.totalCount = allTasks.length;
    this.urgentCount = allTasks.filter(t => t.priority === 'Urgent').length;
  }

  goToBoard() {
    this.router.navigate(['/board']);
  }
}
