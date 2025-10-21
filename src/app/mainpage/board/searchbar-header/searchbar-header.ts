import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../services/task-service';
import { Router, RouterModule } from '@angular/router';

/**
 * Header component containing a search bar and task creation actions.
 * 
 * Allows users to search for tasks, add new tasks, and handles responsive navigation.
 */
@Component({
  selector: 'app-searchbar-header',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './searchbar-header.html',
  styleUrls: ['./searchbar-header.scss']
})
export class SearchbarHeader {

  /** Injected task service for managing tasks */
  taskService = inject(TaskService);

  /** Injected Angular router for navigation */
  router = inject(Router);

  /** Current search term entered in the input field */
  searchTerm: string = '';

  /** Emits the current search term when a search is triggered */
  @Output() searchResult = new EventEmitter<string>();

  /** Emits a request to add a new task to a specific stage */
  @Output() addTaskToStage = new EventEmitter<string>();

  /** Emits a generic add task event */
  @Output() add = new EventEmitter<string>();

  /**
   * Emits the current search term to the parent component
   */
  searchInput(): void {
    this.searchResult.emit(this.searchTerm);
  }

  /**
   * Handles the search form submission
   * @param event Form submit event
   */
  onSearch(event: Event): void {
    event.preventDefault();
    this.searchInput();
  }

  /**
   * Adds a new task to a specific stage or navigates to the tasks page
   * depending on screen size
   * @param stage Stage to add the task to
   */
  addResponsiveTask(stage: string) {
    if (window.innerWidth >= 1080) {
      this.addTaskToStage.emit(stage);
    } else {
      this.router.navigate(['/tasks']);
    }
  }

  /**
   * Emits a generic add task event to the parent
   */
  addTask(): void {
    this.add.emit();
  }
}
