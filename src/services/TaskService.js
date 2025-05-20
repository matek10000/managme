import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  where,
  query,
} from "firebase/firestore"
import { db } from "../firebase"

const tasksCol = collection(db, "tasks")

export default {
  async getTasksForProject(projectId) {
    // bez orderBy, żeby nie wymagać indeksu
    const q = query(tasksCol, where("projectId", "==", projectId))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  },
  async addTask(task) {
    await addDoc(tasksCol, { ...task, status: "todo", createdAt: Date.now() })
  },
  async updateTask(id, data) {
    await updateDoc(doc(tasksCol, id), { ...data, updatedAt: Date.now() })
  },
  async deleteTask(id) {
    await deleteDoc(doc(tasksCol, id))
  },
}
