import { Component } from '@angular/core';
import { SingleTaskCard } from './single-task-card/single-task-card';

@Component({
  selector: 'app-overview-tasks',
  imports: [SingleTaskCard],
  templateUrl: './overview-tasks.html',
  styleUrl: './overview-tasks.scss'
})
export class OverviewTasks {

}
