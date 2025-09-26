import { Timestamp } from '@angular/fire/firestore';

export interface TaskInterface {
    id?: string;
    title: string;
    description: string;
    due_date: Timestamp;
    priority: 'urgent' | 'medium' | 'low';    
    assigned_to: Contact[];
    category: 'technical-task' | 'user-story';
    subtask: string[];
    stage: 'to-do' | 'in-progress' | 'await-feedback' | 'done';
}