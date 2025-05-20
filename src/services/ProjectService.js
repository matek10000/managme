import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
  } from "firebase/firestore"
  import { db } from "../firebase"
  
  const projectsCol = collection(db, "projects")
  
  export default {
    async getProjects() {
      const snap = await getDocs(query(projectsCol, orderBy("createdAt", "desc")))
      return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    },
    async getProject(id) {
      const d = await getDoc(doc(projectsCol, id))
      return d.exists() ? { id: d.id, ...d.data() } : null
    },
    async addProject(data) {
      const now = Date.now()
      return addDoc(projectsCol, { ...data, createdAt: now })
    },
    async updateProject(id, data) {
      await updateDoc(doc(projectsCol, id), { ...data, updatedAt: Date.now() })
    },
    async deleteProject(id) {
      await deleteDoc(doc(projectsCol, id))
    },
  
    // STORIES
    storiesCol(projectId) {
      return collection(projectsCol, projectId, "stories")
    },
    async getStories(projectId) {
      const snap = await getDocs(this.storiesCol(projectId))
      return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    },
    async addStory(projectId, story) {
      const now = Date.now()
      await addDoc(this.storiesCol(projectId), { ...story, createdAt: now })
    },
    async updateStory(projectId, id, story) {
      await updateDoc(doc(this.storiesCol(projectId), id), { ...story, updatedAt: Date.now() })
    },
    async deleteStory(projectId, id) {
      await deleteDoc(doc(this.storiesCol(projectId), id))
    },
  }
  