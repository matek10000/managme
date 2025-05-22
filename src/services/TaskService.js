// src/services/TaskService.js
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where
} from "firebase/firestore"
import { db } from "../firebase"

// referencja do subkolekcji "tasks" pod danym projektem
function tasksCol(projectId) {
  return collection(db, "projects", projectId, "tasks")
}

export default {
  /** pobiera wszystkie zadania dla projektu, posortowane po utworzeniu */
  async getTasksForProject(projectId) {
    const q = query(tasksCol(projectId), orderBy("createdAt", "asc"))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  },

  /** dodaje nowe zadanie do Firestore */
  async addTask({ projectId, storyId, name, description, priority, estimatedTime }) {
    const now = Date.now()
    await addDoc(tasksCol(projectId), {
      storyId,
      name,
      description,
      priority,
      estimatedTime,
      status: "todo",
      createdAt: now,
      startDate: null,
      endDate: null,
      assignedUser: null
    })
  },

  /** aktualizuje dowolne pola zadania */
  async updateTask(projectId, taskId, data) {
    const ref = doc(tasksCol(projectId), taskId)
    await updateDoc(ref, { ...data, updatedAt: Date.now() })
  },

  /** oznacza zadanie jako zakończone */
  async completeTask(projectId, taskId) {
    const ref = doc(tasksCol(projectId), taskId)
    await updateDoc(ref, {
      status: "done",
      endDate: Date.now(),
    })
  },

  /** usuwa zadanie */
  async deleteTask(projectId, taskId) {
    const ref = doc(tasksCol(projectId), taskId)
    await deleteDoc(ref)
  }
}
