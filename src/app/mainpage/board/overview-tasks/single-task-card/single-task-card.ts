import { NgClass, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskInterface } from '../../../../interfaces/tasks.interface';

/**
 * Component representing a single task card.
 * 
 * Displays task information, completed subtasks, and can emit events when a task is selected.
 */
@Component({
  selector: 'app-single-task-card',
  imports: [NgStyle, NgClass],
  templateUrl: './single-task-card.html',
  styleUrl: './single-task-card.scss'
})
export class SingleTaskCard {

  /** Task object to display in the card */
  @Input() task!: TaskInterface;

  /** Emits the ID of the selected task when the card is clicked */
  @Output() selectedTaskId = new EventEmitter<string>();

  /**
   * Emits the ID of the selected task
   * @param taskId ID of the task that was selected
   */
  setSelectedTaskId(taskId: string) {
    this.selectedTaskId.emit(taskId);
  }

  /**
   * Counts how many subtasks are completed
   * @param subtasks Array of subtasks with `title` and `completed` properties
   * @returns Number of completed subtasks
   */
  getCountOfCompletedSubtasks(subtasks: { title: string; completed: boolean }[]): number {
    const completedCount = subtasks.filter(subtask => subtask.completed).length;
    return completedCount;
  }

  /**
   * Extracts initials from a full name
   * @param fullName Full name string
   * @returns Uppercase initials (e.g., "John Doe" -> "JD")
   */
  getInitials(fullName: string): string {
    const words = fullName.trim().split(" ");
    const initials = words.map(word => word.charAt(0).toUpperCase()).join("");
    return initials;
  }
}
