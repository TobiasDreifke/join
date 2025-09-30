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


  tasks: TaskInterface[] = [ 
    { 
      id: "task1", 
      title: "Server-Upgrade durchführen", 
      description: "Upgrade des Produktionsservers auf die neueste Version.", 
      due_date: Timestamp.fromDate(new Date("2025-09-30")), 
      priority: "Urgent", 
      assigned_to: [ 
        { id: "1", phone: "123456789", name: "Max Mustermann", email: "max.mustermann@example.com", initial_avatar_color: "#FF5733" }, 
        { id: "2", phone: "987654321", name: "Laura Schmidt", email: "laura.schmidt@example.com", initial_avatar_color: "#33C1FF" } 
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
      id: "task2", 
      title: "Login-Seite redesignen", 
      description: "Neues Layout für die Login-Seite umsetzen.", 
      due_date: Timestamp.fromDate(new Date("2025-10-10")), 
      priority: "Medium", 
      assigned_to: [ 
        { id: "3", phone: "555555555", name: "Tom Becker", email: "tom.becker@example.com", initial_avatar_color: "#33FF57" } 
      ], 
      category: "User Story", 
      subtask: [], 
      stage: "In progress" 
    }, 
    { 
      id: "task3", 
      title: "API-Dokumentation aktualisieren", 
      description: "Neue Endpunkte ergänzen und Beispiele hinzufügen.", 
      due_date: Timestamp.fromDate(new Date("2025-10-05")), 
      priority: "Low", 
      assigned_to: [ 
        { id: "4", phone: "444444444", name: "Anna Müller", email: "anna.mueller@example.com", initial_avatar_color: "#FFC300" }, 
        { id: "5", phone: "222222222", name: "Felix Wagner", email: "felix.wagner@example.com", initial_avatar_color: "#FF33A8" }, 
        { id: "6", phone: "333333333", name: "Sophie Klein", email: "sophie.klein@example.com", initial_avatar_color: "#8E44AD" } 
      ], 
      category: "Technical Task", 
      subtask: [ 
        { title: "Neue Endpunkte dokumentieren", completed: true }, 
        { title: "Beispiele hinzufügen", completed: false } 
      ], 
      stage: "Await feedback" 
    }, 
    { 
      id: "task4", 
      title: "Benutzerregistrierung testen", 
      description: "Funktionalität der Registrierung auf Mobilgeräten prüfen.", 
      due_date: Timestamp.fromDate(new Date("2025-09-28")), 
      priority: "Urgent", 
      assigned_to: [ 
        { id: "7", phone: "111111111", name: "Julia Neumann", email: "julia.neumann@example.com", initial_avatar_color: "#1ABC9C" }, 
        { id: "8", phone: "666666666", name: "Lukas Fischer", email: "lukas.fischer@example.com", initial_avatar_color: "#E67E22" }, 
        { id: "9", phone: "777777777", name: "David Sommer", email: "david.sommer@example.com", initial_avatar_color: "#2980B9" }, 
        { id: "10", phone: "888888888", name: "Clara Weiß", email: "clara.weiss@example.com", initial_avatar_color: "#C0392B" } 
      ], 
      category: "User Story", 
      subtask: [ 
        { title: "Testplan erstellen", completed: false }, { title: "Test durchführen", completed: true }, 
        { title: "Fehler dokumentieren", completed: false } 
      ], 
      stage: "In progress" 
    },  
    { 
      id: "task5", 
      title: "Dark Mode implementieren", 
      description: "Ein optionales Dark-Theme für die App hinzufügen.", 
      due_date: Timestamp.fromDate(new Date("2025-10-20")), 
      priority: "Medium", 
      assigned_to: [ 
        { id: "11", phone: "999999999", name: "Sarah König", email: "sarah.koenig@example.com", initial_avatar_color: "#9B59B6" }, 
        { id: "12", phone: "121212121", name: "Paul Braun", email: "paul.braun@example.com", initial_avatar_color: "#2ECC71" }, 
        { id: "13", phone: "131313131", name: "Mia Hoffmann", email: "mia.hoffmann@example.com", initial_avatar_color: "#F39C12" }, 
        { id: "14", phone: "141414141", name: "Jan Vogel", email: "jan.vogel@example.com", initial_avatar_color: "#16A085" }, 
        { id: "15", phone: "151515151", name: "Nina Scholz", email: "nina.scholz@example.com", initial_avatar_color: "#D35400" } 
      ], 
      category: "User Story", 
      subtask: [], 
      stage: "Done" 
    } 
  ];

  tasksToDo: TaskInterface[] = []
  tasksInProgress: TaskInterface[] = []
  tasksAwaitFeedback: TaskInterface[] = []
  tasksDone: TaskInterface[] = []

  constructor(){
    this.tasksToDo = this.tasks.filter(task => task.stage == 'To do');
    this.tasksInProgress = this.tasks.filter(task => task.stage == 'In progress');
    this.tasksAwaitFeedback = this.tasks.filter(task => task.stage == 'Await feedback');
    this.tasksDone = this.tasks.filter(task => task.stage == 'Done');
  }

}
