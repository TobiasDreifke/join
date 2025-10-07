import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../services/task-service';
import { TaskInterface } from '../../../interfaces/tasks.interface';



@Component({
  selector: 'app-searchbar-header',
  standalone: true,
  imports: [FormsModule,],
  templateUrl: './searchbar-header.html',
  styleUrls: ['./searchbar-header.scss']
})
export class SearchbarHeader {


  taskService = inject(TaskService);
  searchTerm: string = '';

  @Output() searchResult = new EventEmitter<TaskInterface[]>();
  @Output() add = new EventEmitter<string>();


  filteredTaskList(): TaskInterface[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.taskService.tasksList;

    return this.taskService.tasksList.filter(task =>
      task.title?.toLowerCase().includes(term) ||
      task.description?.toLowerCase().includes(term)
    );
  }


  searchInput(): void {
    const filtered = this.filteredTaskList();
    this.searchResult.emit(filtered); 
  }

  onSearch(event: Event): void {
    event.preventDefault();
    console.log(this.searchTerm);
    this.searchInput(); 
  }
}





  
