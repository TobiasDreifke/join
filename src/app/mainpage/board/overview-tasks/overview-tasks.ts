import { Component } from '@angular/core';
import { SingleTaskCard } from './single-task-card/single-task-card';
import { Timestamp } from '@angular/fire/firestore';
import { TaskInterface } from '../../../interfaces/tasks.interface';

@Component({
  selector: 'app-overview-tasks',
  imports: [SingleTaskCard],
  templateUrl: './overview-tasks.html',
  styleUrl: './overview-tasks.scss'
})
export class OverviewTasks {

  tasksData: TaskInterface[] = [
    {
      id: "task1",
      title: "Server-Upgrade durchführen",
      description: "Upgrade des Produktionsservers auf die neueste Version.",
      due_date: Timestamp.fromDate(new Date("2025-09-30")),
      priority: "Urgent",
      assigned_to: [
        { id: "1", phone: "123456789", name: "Max Mustermann", email: "max.mustermann@example.com", initial_avatar_color: "#FF5733" },
        { id: "2", phone: "123456789", name: "Laura Schmidt", email: "laura.schmidt@example.com", initial_avatar_color: "#33C1FF" },
        { id: "1", phone: "123456789", name: "Max Mustermann", email: "max.mustermann@example.com", initial_avatar_color: "#6d33ffff" },
        // { id: "1", phone: "123456789", name: "Max Mustermann", email: "max.mustermann@example.com", initial_avatar_color: "#33ffc2ff" },
        // { id: "1", phone: "123456789", name: "Max Mustermann", email: "max.mustermann@example.com", initial_avatar_color: "#ff335cff" },
        // { id: "1", phone: "123456789", name: "Max Mustermann", email: "max.mustermann@example.com", initial_avatar_color: "#6d33ffff" },
        // { id: "1", phone: "123456789", name: "Max Mustermann", email: "max.mustermann@example.com", initial_avatar_color: "#33ffe4ff" },
        // { id: "1", phone: "123456789", name: "Max Mustermann", email: "max.mustermann@example.com", initial_avatar_color: "#6d33ffff" },
        // { id: "1", phone: "123456789", name: "Max Mustermann", email: "max.mustermann@example.com", initial_avatar_color: "#33ff63ff" },
        // { id: "1", phone: "123456789", name: "Max Mustermann", email: "max.mustermann@example.com", initial_avatar_color: "#605f61ff" }
      ],
      category: "Technical Task",
      subtask: [
        { title: "Backup erstellen", completed: false },
        { title: "Upgrade testen", completed: false },
        { title: "Server neu starten", completed: true }
      ],
      stage: "To do"
    },
    {
      id: "task1",
      title: "Server-Upgrade durchführen",
      description: "Upgrade des Produktionsservers auf die neueste Version.",
      due_date: Timestamp.fromDate(new Date("2025-09-30")),
      priority: "Urgent",
      assigned_to: [
        { id: "1", phone: "123456789", name: "Max Mustermann", email: "max.mustermann@example.com", initial_avatar_color: "#FF5733" },
        { id: "2", phone: "123456789", name: "Laura Schmidt", email: "laura.schmidt@example.com", initial_avatar_color: "#33C1FF" },
        { id: "1", phone: "123456789", name: "Max Mustermann", email: "max.mustermann@example.com", initial_avatar_color: "#6d33ffff" },
        { id: "1", phone: "123456789", name: "Max Mustermann", email: "max.mustermann@example.com", initial_avatar_color: "#33ffc2ff" },
        { id: "1", phone: "123456789", name: "Max Mustermann", email: "max.mustermann@example.com", initial_avatar_color: "#ff335cff" },
        { id: "1", phone: "123456789", name: "Max Mustermann", email: "max.mustermann@example.com", initial_avatar_color: "#6d33ffff" },
        { id: "1", phone: "123456789", name: "Max Mustermann", email: "max.mustermann@example.com", initial_avatar_color: "#33ffe4ff" },
        { id: "1", phone: "123456789", name: "Max Mustermann", email: "max.mustermann@example.com", initial_avatar_color: "#6d33ffff" },
        { id: "1", phone: "123456789", name: "Max Mustermann", email: "max.mustermann@example.com", initial_avatar_color: "#33ff63ff" },
        { id: "1", phone: "123456789", name: "Max Mustermann", email: "max.mustermann@example.com", initial_avatar_color: "#605f61ff" }
      ],
      category: "Technical Task",
      subtask: [
        // { title: "Backup erstellen", completed: true },
        // { title: "Upgrade testen", completed: false },
        // { title: "Server neu starten", completed: true }
      ],
      stage: "To do"
    }
  ]
}
