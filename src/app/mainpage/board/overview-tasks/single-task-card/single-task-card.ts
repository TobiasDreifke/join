import { NgStyle } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-single-task-card',
  imports: [NgStyle],
  templateUrl: './single-task-card.html',
  styleUrl: './single-task-card.scss'
})
export class SingleTaskCard {

  allTasksList = [
  {
    "title": "Server-Upgrade durchführen",
    "description": "Upgrade des Produktionsservers auf die neueste Version.",
    "due_date": "30/09/2025",
    "priority": "urgent",
    "assigned_to": [
      {
        "id": "1",
        "name": "Max Mustermann",
        "email": "max.mustermann@example.com",
        "phone": "+4915123456789",
        "initial_avatar_color": "#FF5733"
      },
      {
        "id": "2",
        "name": "Laura Schmidt",
        "email": "laura.schmidt@example.com",
        "phone": "+4915123456790",
        "initial_avatar_color": "#33C1FF"
      }
    ],
    "category": "Technical Task",
    "subtask": ["Backup erstellen", "Upgrade testen", "Server neu starten"],
    "stage": "to-do"
  },
  {
    "title": "Login-Seite redesignen",
    "description": "Redesign der Login-Seite für bessere UX und Mobilgeräte-Kompatibilität.",
    "due_date": "10/10/2025",
    "priority": "medium",
    "assigned_to": [
      {
        "id": "2",
        "name": "Laura Schmidt",
        "email": "laura.schmidt@example.com",
        "phone": "+4915123456790",
        "initial_avatar_color": "#33C1FF"
      }
    ],
    "category": "user-story",
    "subtask": ["Wireframes erstellen", "Feedback einholen", "Finales Design implementieren"],
    "stage": "in-progress"
  },
  {
    "title": "API-Dokumentation aktualisieren",
    "description": "Dokumentation der neuen API-Endpunkte ergänzen.",
    "due_date": "05/10/2025",
    "priority": "low",
    "assigned_to": [
      {
        "id": "3",
        "name": "Tom Becker",
        "email": "tom.becker@example.com",
        "phone": "+4915123456791",
        "initial_avatar_color": "#FFAA33"
      },
      {
        "id": "4",
        "name": "Anna Müller",
        "email": "anna.mueller@example.com",
        "phone": "+4915123456792",
        "initial_avatar_color": "#AA33FF"
      }
    ],
    "category": "technical-task",
    "subtask": ["Neue Endpunkte dokumentieren", "Beispiele hinzufügen", "Review durchführen"],
    "stage": "await-feedback"
  },
  {
    "title": "Benutzerregistrierung testen",
    "description": "Funktionalität der neuen Benutzerregistrierung prüfen.",
    "due_date": "28/09/2025",
    "priority": "urgent",
    "assigned_to": [
      {
        "id": "4",
        "name": "Anna Müller",
        "email": "anna.mueller@example.com",
        "phone": "+4915123456792",
        "initial_avatar_color": "#AA33FF"
      }
    ],
    "category": "user-story",
    "subtask": ["Testplan erstellen", "Test durchführen", "Fehler dokumentieren"],
    "stage": "in-progress"
  },
  {
    "title": "Performance-Optimierung Webseite",
    "description": "Ladezeiten der Hauptseite um 20% reduzieren.",
    "due_date": "15/10/2025",
    "priority": "medium",
    "assigned_to": [
      {
        "id": "5",
        "name": "Felix Wagner",
        "email": "felix.wagner@example.com",
        "phone": "+4915123456793",
        "initial_avatar_color": "#33FFAA"
      },
      {
        "id": "6",
        "name": "Sophie Klein",
        "email": "sophie.klein@example.com",
        "phone": "+4915123456796",
        "initial_avatar_color": "#FF33AA"
      }
    ],
    "category": "technical-task",
    "subtask": ["Bilder komprimieren", "Caching implementieren", "Code refactoring"],
    "stage": "to-do"
  },
  {
    "title": "Feedback-Formular implementieren",
    "description": "Ein neues Formular für Nutzerfeedback einbauen.",
    "due_date": "12/10/2025",
    "priority": "medium",
    "assigned_to": [
      {
        "id": "7",
        "name": "Julia Neumann",
        "email": "julia.neumann@example.com",
        "phone": "+4915123456794",
        "initial_avatar_color": "#33AAFF"
      }
    ],
    "category": "user-story",
    "subtask": ["Formular erstellen", "Backend-Anbindung", "Design finalisieren"],
    "stage": "to-do"
  },
  {
    "title": "E-Mail Benachrichtigungen testen",
    "description": "Überprüfung, ob E-Mail-Benachrichtigungen korrekt versendet werden.",
    "due_date": "29/09/2025",
    "priority": "urgent",
    "assigned_to": [
      {
        "id": "8",
        "name": "Lukas Fischer",
        "email": "lukas.fischer@example.com",
        "phone": "+4915123456795",
        "initial_avatar_color": "#AAFF33"
      },
      {
        "id": "1",
        "name": "Max Mustermann",
        "email": "max.mustermann@example.com",
        "phone": "+4915123456789",
        "initial_avatar_color": "#FF5733"
      }
    ],
    "category": "technical-task",
    "subtask": ["Testaccounts erstellen", "Benachrichtigungen senden", "Ergebnisse dokumentieren"],
    "stage": "await-feedback"
  },
  {
    "title": "Dark Mode für App hinzufügen",
    "description": "Dark Mode als optionales Theme implementieren.",
    "due_date": "20/10/2025",
    "priority": "low",
    "assigned_to": [
      {
        "id": "6",
        "name": "Sophie Klein",
        "email": "sophie.klein@example.com",
        "phone": "+4915123456796",
        "initial_avatar_color": "#FF33AA"
      },
      {
        "id": "5",
        "name": "Felix Wagner",
        "email": "felix.wagner@example.com",
        "phone": "+4915123456793",
        "initial_avatar_color": "#33FFAA"
      }
    ],
    "category": "user-story",
    "subtask": ["Design entwerfen", "Implementierung", "Testen auf Geräten"],
    "stage": "to-do"
  }
]


  getInitials(fullName: string): string {
    const words = fullName.trim().split(" ");
    const initials = words.map(word => word.charAt(0).toUpperCase()).join("");
    return initials;
  }
}
