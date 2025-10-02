import { Timestamp } from '@angular/fire/firestore';

export interface TaskInterface {
    id?: string;
    title: string;
    description: string;
    due_date: Timestamp;
    priority: 'Urgent' | 'Medium' | 'Low' | '';
    assigned_to: Contact[];
    category: 'Technical Task' | 'User Story' | '';
    subtask:
    {
        title: string;
        completed: boolean;
    }[];
    stage: 'To do' | 'In progress' | 'Await feedback' | 'Done' | '';
}