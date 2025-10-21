import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task-service';
import { AuthService } from '../../services/auth-service';
import { TaskInterface } from '../../interfaces/tasks.interface';

/**
 * Summary component showing an overview of tasks for the user.
 * 
 * Displays counts of tasks by stage and priority, welcome message for first-time mobile users,
 * and provides navigation to the task board.
 */
@Component({
  selector: 'app-summary',
  templateUrl: './summary.html',
  styleUrls: ['./summary.scss']
})
export class Summary implements OnInit {

  /** Injected Router for navigation */
  router = inject(Router);

  /** Injected TaskService to access tasks */
  taskService = inject(TaskService);

  /** Injected AuthService to get user information */
  authService = inject(AuthService);

  /** Name of the current user */
  userName: string = 'Guest';

  /** Task counts by stage */
  todoCount = 0;
  doneCount = 0;
  inProgressCount = 0;
  feedbackCount = 0;

  /** Total number of tasks */
  totalCount = 0;

  /** Number of urgent tasks */
  urgentCount = 0;

  /** Current date string */
  todayDate!: string;

  /** Flag to show welcome message */
  showWelcome = false;

  /** Flag to show main content */
  showMainContent = true;

  /** Lifecycle hook: initialize date, username, and task counts */
  ngOnInit() {
    this.todayDate = this.getTodayDate();
    this.getUserName();
    this.observeTasks();
    this.checkScreenWidth();
  }

  /** Checks screen width and shows welcome message for first-time mobile users */
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
      }, 3000);
    } else {
      this.showWelcome = false;
      this.showMainContent = true;
    }
  }

  /** Gets the current user's display name, defaults to 'Guest' */
  getUserName() {
    const isGuestLogin = localStorage.getItem('guestLogin');

    if (isGuestLogin) {
      this.userName = 'Guest';
    } else {
      const name = this.authService.getDisplayName();
      this.userName = name ? name : 'Guest';
    }
  }

  /** Returns today's date as a formatted string */
  getTodayDate(): string {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString('en-US', options);
  }

  /** Observes the tasks list and updates counts when tasks are loaded */
  observeTasks() {
    const interval = setInterval(() => {
      if (this.taskService.tasksList.length > 0) {
        this.updateTaskCounts(this.taskService.tasksList);
        clearInterval(interval);
      }
    }, 500);

    // Safety: stop interval after 5 seconds
    setTimeout(() => clearInterval(interval), 5000);
  }

  /**
   * Updates task counts by stage and priority
   * @param allTasks Array of all tasks
   */
  updateTaskCounts(allTasks: TaskInterface[]) {
    this.todoCount = allTasks.filter(t => t.stage === 'To do').length;
    this.inProgressCount = allTasks.filter(t => t.stage === 'In progress').length;
    this.feedbackCount = allTasks.filter(t => t.stage === 'Await feedback').length;
    this.doneCount = allTasks.filter(t => t.stage === 'Done').length;
    this.totalCount = allTasks.length;
    this.urgentCount = allTasks.filter(t => t.priority === 'Urgent').length;
  }

  /** Navigates to the board page */
  goToBoard() {
    this.router.navigate(['/board']);
  }
}
