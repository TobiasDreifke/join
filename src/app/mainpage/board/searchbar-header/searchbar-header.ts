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

  @Output() searchResult = new EventEmitter<string>();
  @Output() add = new EventEmitter<string>();

  searchInput(): void {
    this.searchResult.emit(this.searchTerm); 
  }

  onSearch(event: Event): void {
    event.preventDefault();
    // console.log(this.searchTerm);
    this.searchInput(); 
  }
}





  
