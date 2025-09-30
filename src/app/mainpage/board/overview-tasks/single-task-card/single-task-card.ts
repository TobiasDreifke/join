import { NgClass, NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TaskInterface } from '../../../../interfaces/tasks.interface';

@Component({
  selector: 'app-single-task-card',
  imports: [NgStyle, NgClass],
  templateUrl: './single-task-card.html',
  styleUrl: './single-task-card.scss'
})
export class SingleTaskCard {

  @Input() task!: TaskInterface;

  getCountOfCompletedSubtasks(subtasks: {title: string; completed: boolean}[]): number{
    const completedCount = subtasks.filter(subtask => subtask.completed).length;
    return completedCount
  }

  getInitials(fullName: string): string {
    const words = fullName.trim().split(" ");
    const initials = words.map(word => word.charAt(0).toUpperCase()).join("");
    return initials;
  }
}
