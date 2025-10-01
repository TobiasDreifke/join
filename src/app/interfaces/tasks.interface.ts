import { Timestamp } from '@angular/fire/firestore';

export interface TaskInterface {
    id?: string;
    title: string;
    description: string;
    due_date: Timestamp;
    priority: 'Urgent' | 'Medium' | 'Low' | string;
    assigned_to: Contact[];
    category: 'Technical Task' | 'User Story' | string;
    subtask:
    {
        title: string;
        completed: boolean;
    }[];
    stage: 'To do' | 'In progress' | 'Await feedback' | 'Done' | string;
}