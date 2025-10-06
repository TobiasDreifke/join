import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../services/task-service';
import { TaskInterface } from '../../../interfaces/tasks.interface';
import { ContactService } from '../../../services/contact-service';



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

  filteredTaskList(): TaskInterface[] {
  const term = this.searchTerm.trim().toLowerCase();
  if (!term) return this.taskService.tasksList;

  return this.taskService.tasksList.filter(task =>
    task.title?.toLowerCase().includes(term) ||
    task.description?.toLowerCase().includes(term)
  );
}



  
  onSearch(event: Event): void {
  event.preventDefault();
  console.log(this.searchTerm);
}



}





  
