import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../services/task-service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-searchbar-header',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './searchbar-header.html',
  styleUrls: ['./searchbar-header.scss']
})
export class SearchbarHeader {
  taskService = inject(TaskService);
  router = inject(Router);
  searchTerm: string = '';

  @Output() searchResult = new EventEmitter<string>();
  @Output() addTaskToStage = new EventEmitter<string>();
  @Output() add = new EventEmitter<string>();

  searchInput(): void {
    this.searchResult.emit(this.searchTerm);
  }

  onSearch(event: Event): void {
    event.preventDefault();
    this.searchInput();
  }

  addResponsiveTask(stage: string) {
    if (window.innerWidth >= 1375) {
      this.addTaskToStage.emit(stage);
    } else {
      this.router.navigate(['/tasks']);
    }
  }

  addTask(): void {
  this.add.emit();
}
}
