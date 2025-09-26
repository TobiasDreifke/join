import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './shared/sidebar/sidebar';
import { ContactService } from './services/contact-service';
import { Header } from './shared/header/header';
import { TaskService } from './services/task-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('join');
  taskData = inject(TaskService)
  contactData = inject(ContactService);
}

