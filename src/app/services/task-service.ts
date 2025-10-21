import { inject, Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { TaskInterface } from '../interfaces/tasks.interface';

/**
 * Service for managing tasks in Firestore.
 * 
 * Provides methods to:
 * - Retrieve tasks in real-time
 * - Add, update, and delete tasks
 * - Generate clean task objects
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  
  /** Firestore instance */
  firestore: Firestore = inject(Firestore);

  /** Function to unsubscribe from Firestore tasks listener */
  unsubscribeTasksList: () => void;

  /** Array storing all tasks */
  tasksList: TaskInterface[] = [];

  constructor() {
    // Subscribe to Firestore 'tasks' collection in real-time
    this.unsubscribeTasksList = onSnapshot(collection(this.firestore, "tasks"), (tasksSnapshot) => {
      this.tasksList = [];
      tasksSnapshot.docs.forEach((docItem) => {
        this.tasksList.push(this.setTaskObject(docItem.id, docItem.data() as TaskInterface));
      });
    });
  }

  /**
   * Adds a new task to Firestore.
   * @param task Task object
   */
  async addTask(task: TaskInterface) {
    await addDoc(collection(this.firestore, "tasks"), task);
  }

  /**
   * Deletes a task by ID.
   * @param taskId Firestore document ID
   */
  async deleteTask(taskId: string) {
    await deleteDoc(this.getSingleTaskRef(taskId));
  }

  /**
   * Updates a task by ID.
   * @param taskId Firestore document ID
   * @param taskData Updated task object
   */
  async updateTask(taskId: string, taskData: TaskInterface) {
    await updateDoc(this.getSingleTaskRef(taskId), this.getCleanJson(taskData));
  }

  /**
   * Returns a clean JSON object containing only relevant task properties.
   * @param obj Task object
   */
  getCleanJson(obj: TaskInterface) {
    return {
      index: obj.index,
      title: obj.title,
      description: obj.description,
      due_date: obj.due_date,
      priority: obj.priority,
      category: obj.category,
      stage: obj.stage,
      subtask: obj.subtask || [],
      assigned_to: obj.assigned_to,
    };
  }

  /**
   * Returns a reference to the 'tasks' collection in Firestore.
   */
  getTaskRef() {
    return collection(this.firestore, 'tasks');
  }

  /**
   * Returns a reference to a single task document by ID.
   * @param docId Firestore document ID
   */
  getSingleTaskRef(docId: string) {
    return doc(this.getTaskRef(), docId);
  }

  /**
   * Converts a raw Firestore document into a TaskInterface object.
   * @param id Firestore document ID
   * @param obj Task data
   * @returns TaskInterface object with ID included
   */
  setTaskObject(id: string, obj: TaskInterface): TaskInterface {
    return {
      index: obj.index,
      id: id,
      title: obj.title,
      description: obj.description,
      due_date: obj.due_date,
      priority: obj.priority,
      category: obj.category,
      stage: obj.stage,
      subtask: obj.subtask || [],
      assigned_to: obj.assigned_to,
    };
  }

  /**
   * Unsubscribes from Firestore listener when service is destroyed.
   */
  ngOnDestroy() {
    if (this.unsubscribeTasksList) {
      this.unsubscribeTasksList();
    }
  }
}
