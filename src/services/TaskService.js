class TaskService {
  static getTasks() {
    const tasks = localStorage.getItem("tasks")
    return tasks ? JSON.parse(tasks) : []
  }

  static saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks))
    window.dispatchEvent(new Event("storage"))
  }

  static getTasksForProject(projectId) {
    return this.getTasks().filter((task) => task.projectId === projectId)
  }

  static getTaskById(taskId) {
    return this.getTasks().find((task) => task.id === taskId)
  }

  static addTask(task) {
    const tasks = this.getTasks()
    const newTask = {
      id: Date.now(),
      name: task.name || "Nowe zadanie",
      description: task.description || "",
      priority: task.priority || "medium",
      storyId: task.storyId,
      projectId: task.projectId,
      estimatedTime: task.estimatedTime || 0,
      status: "todo",
      createdAt: new Date().toISOString(),
      startDate: null,
      endDate: null,
      assignedUser: null,
    }
    tasks.push(newTask)
    this.saveTasks(tasks)
  }

  static updateTask(updatedTask) {
    let tasks = this.getTasks()
    tasks = tasks.map((task) =>
      task.id === updatedTask.id ? { ...task, ...updatedTask } : task
    )
    this.saveTasks(tasks)
  }

  static deleteTask(taskId) {
    let tasks = this.getTasks().filter((task) => task.id !== taskId)
    this.saveTasks(tasks)
  }

  static assignUser(taskId, userId) {
    let tasks = this.getTasks()
    tasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          assignedUser: userId,
          status: "doing",
          startDate: new Date().toISOString(),
        }
      }
      return task
    })
    this.saveTasks(tasks)
  }

  static completeTask(taskId) {
    let tasks = this.getTasks()
    tasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          status: "done",
          endDate: new Date().toISOString(),
        }
      }
      return task
    })
    this.saveTasks(tasks)
  }
}

export default TaskService
