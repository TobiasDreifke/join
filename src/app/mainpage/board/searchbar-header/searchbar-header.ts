import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface AssignedTo {
  id: string;
  name: string;
  email: string;
  phone: string;
  initial_avatar_color?: string;
}

interface Task {
  title: string;
  description: string;
  due_date: string;
  priority: string;
  assigned_to: AssignedTo[];
  category: string;
  subtask: string[];
  stage: string;
}

@Component({
  selector: 'app-searchbar-header',
  standalone: true,
  imports: [FormsModule,],
  templateUrl: './searchbar-header.html',
  styleUrls: ['./searchbar-header.scss']
})
export class SearchbarHeader {
  taskData: Task[] = [
  {
    title: "Server-Upgrade durchführen",
    description: "Upgrade des Produktionsservers auf die neueste Version.",
    due_date: "30/09/2025",
    priority: "urgent",
    assigned_to: [
      {
        id: "1",
        name: "Max Mustermann",
        email: "max.mustermann@example.com",
        phone: "+4915123456789",
        initial_avatar_color: "#FF5733"
      },
      {
        id: "2",
        name: "Laura Schmidt",
        email: "laura.schmidt@example.com",
        phone: "+4915123456790",
        initial_avatar_color: "#33C1FF"
      }
    ],
    category: "technical-task",
    subtask: ["Backup erstellen", "Upgrade testen", "Server neu starten"],
    stage: "to-do"
  },
  {
    title: "Login-Seite redesignen",
    description: "Redesign der Login-Seite für bessere UX und Mobilgeräte-Kompatibilität.",
    due_date: "10/10/2025",
    priority: "medium",
    assigned_to: [
      {
        id: "2",
        name: "Laura Schmidt",
        email: "laura.schmidt@example.com",
        phone: "+4915123456790"
      }
    ],
    category: "user-story",
    subtask: ["Wireframes erstellen", "Feedback einholen", "Finales Design implementieren"],
    stage: "in-progress"
  },
  {
    title: "API-Dokumentation aktualisieren",
    description: "Dokumentation der neuen API-Endpunkte ergänzen.",
    due_date: "05/10/2025",
    priority: "low",
    assigned_to: [
      {
        id: "3",
        name: "Tom Becker",
        email: "tom.becker@example.com",
        phone: "+4915123456791"
      },
      {
        id: "4",
        name: "Anna Müller",
        email: "anna.mueller@example.com",
        phone: "+4915123456792"
      }
    ],
    category: "technical-task",
    subtask: ["Neue Endpunkte dokumentieren", "Beispiele hinzufügen", "Review durchführen"],
    stage: "await-feedback"
  },
  {
    title: "Benutzerregistrierung testen",
    description: "Funktionalität der neuen Benutzerregistrierung prüfen.",
    due_date: "28/09/2025",
    priority: "urgent",
    assigned_to: [
      {
        id: "4",
        name: "Anna Müller",
        email: "anna.mueller@example.com",
        phone: "+4915123456792"
      }
    ],
    category: "user-story",
    subtask: ["Testplan erstellen", "Test durchführen", "Fehler dokumentieren"],
    stage: "in-progress"
  },]

  searchTerm :string ='';


    get filteredTaskList(): Task[] {
    if (!this.searchTerm.trim()) {
      return this.taskData;
    }

    const term = this.searchTerm.toLowerCase();
    return this.taskData.filter(task =>
      task.title.toLowerCase().includes(term) ||
      task.description.toLowerCase().includes(term) 
      );
  }
  onSearch(event: Event): void {
  event.preventDefault();
  console.log(this.searchTerm);
}



}





  
