import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  collectionGroup,
  where
} from "firebase/firestore"
import { db } from "../firebase"

// helper: kolekcja tasków dla danej historyjki
function tasksCol(projectId, storyId) {
  return collection(db, "projects", projectId, "stories", storyId, "tasks")
}

export default {
  /** Pobiera wszystkie taski w projekcie (ze wszystkich story) */
  async getTasksForProject(projectId) {
    const q = query(
      collectionGroup(db, "tasks"),
      where("projectId", "==", projectId),
      orderBy("createdAt", "asc")
    )
    const snap = await getDocs(q)
    return snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
      // firestore path: projects/{projectId}/stories/{storyId}/tasks/{taskId}
      storyId: d.ref.parent.parent.id
    }))
  },

  /** Pobiera jedynie taski dla jednej story */
  async getTasksForStory(projectId, storyId) {
    const q = query(
      tasksCol(projectId, storyId),
      orderBy("createdAt", "asc")
    )
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  },

  /** Dodaje task do podkolekcji danej story */
  async addTask({ projectId, storyId, name, description, priority, estimatedTime }) {
    const now = Date.now()
    await addDoc(tasksCol(projectId, storyId), {
      projectId,
      storyId,
      name,
      description,
      priority,
      estimatedTime,
      status: "todo",
      createdAt: now,
      startDate: null,
      endDate: null,
      assignedUser: null,
    })
  },

  /** Aktualizuje task (koniecznie podaj projectId, storyId, taskId) */
  async updateTask(projectId, storyId, taskId, data) {
    const ref = doc(tasksCol(projectId, storyId), taskId)
    await updateDoc(ref, { ...data, updatedAt: Date.now() })
  },

  /** Ustawia status done */
  async completeTask(projectId, storyId, taskId) {
    const ref = doc(tasksCol(projectId, storyId), taskId)
    await updateDoc(ref, { status: "done", endDate: Date.now() })
  },

  /** Usuwa task */
  async deleteTask(projectId, storyId, taskId) {
    const ref = doc(tasksCol(projectId, storyId), taskId)
    await deleteDoc(ref)
  }
}
