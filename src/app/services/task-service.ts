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
      tasksObject.docs.forEach((element) => {
        // console.log(element.id, element.data());
        this.tasksList.push(this.setTaskObject(element.id, element.data() as TaskInterface));
      });
    });
  }

  async addTask(task: TaskInterface) {
    await addDoc(collection(this.firestore, "tasks"), task);
  }

  async deleteTask(taskId: string) {
    await deleteDoc(this.getSingleTaskRef(taskId));
  }

  async updateTask(taskId: string, taskData: TaskInterface) {
    await updateDoc(this.getSingleTaskRef(taskId), this.getCleanJson(taskData));
  }

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

  getTaskRef() {
    return collection(this.firestore, 'tasks');
  }

  getSingleTaskRef(docId: string) {
    return doc(collection(this.firestore, 'tasks'), docId);
  }

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
  ngOnDestroy() {
    if (this.unsubscribeTasksList) {
      this.unsubscribeTasksList();
    }
  }
}
