import { inject, Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { TaskInterface } from '../interfaces/tasks.interface';
; @Injectable({
  providedIn: 'root'
})
export class TaskService {
  firestore: Firestore = inject(Firestore);
  unsubscribeTasksList;
  tasksList: TaskInterface[] = [];

  constructor() {
    this.unsubscribeTasksList = onSnapshot(collection(this.firestore, "tasks"), (tasksObject) => {
      this.tasksList = [];
      tasksObject.forEach((element) => {
        console.log(element.id, element.data());
        this.tasksList.push(this.setTaskObject(element.id, element.data() as TaskInterface))
      });
    });
  }

  async addTasks(task: TaskInterface) {
    await addDoc(collection(this.firestore, "tasks"), task);
  }

  async deleteTasks(taskId: string) {
    await deleteDoc(this.getSingleTasksRef(taskId));
  }

  async updateTasks(taskId: string, taskData: TaskInterface) {
    await updateDoc(this.getSingleTasksRef(taskId), this.getCleanJson(taskData));
  }

  getCleanJson(obj: TaskInterface) {
    return {
      title: obj.title,
      description: obj.description,
      due_date: obj.due_date,
      priority: obj.priority,
      category: obj.category,
      stage: obj.stage,
      subtask: obj.subtask || [],
      // assigned_to: assignedContacts ------- HOW TO SAFE THIS
    };
  }

  getTasksRef() {
    return collection(this.firestore, 'tasks');
  }

  getSingleTasksRef(docId: string) {
    return doc(collection(this.firestore, 'tasks'), docId);
  }

  setTaskObject(id: string, obj: TaskInterface, assignedContacts: Contact[] = []): TaskInterface {
    return {
      id: id,
      title: obj.title,
      description: obj.description,
      due_date: obj.due_date,
      priority: obj.priority,
      category: obj.category,
      stage: obj.stage,
      subtask: obj.subtask || [],
      assigned_to: assignedContacts
    };

  }
  ngOnDestroy() {
    if (this.unsubscribeTasksList) {
      this.unsubscribeTasksList();
    }
  }
}
