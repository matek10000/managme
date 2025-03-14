import { useState, useEffect } from "react";
import TaskService from "../services/TaskService";
import UserService from "../services/UserService";

const TaskBoard = ({ projectId }) => {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState(UserService.getUsers());

    useEffect(() => {
        setTasks(TaskService.getTasksForProject(projectId));

        const handleStorageChange = () => {
            setTasks(TaskService.getTasksForProject(projectId));
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [projectId]);

    const handleAssignUser = (taskId, userId) => {
        TaskService.assignUser(taskId, userId);
        setTasks(TaskService.getTasksForProject(projectId));
    };

    const handleCompleteTask = (taskId) => {
        TaskService.completeTask(taskId);
        setTasks(TaskService.getTasksForProject(projectId));
    };

    const handleDeleteTask = (taskId) => {
        TaskService.deleteTask(taskId);
        setTasks(TaskService.getTasksForProject(projectId));
    };

    return (
        <div className="task-board">
            <h3>📌 Zadania</h3>
            <div className="task-columns">
                {["todo", "doing", "done"].map(status => (
                    <div key={status} className="task-column">
                        <h4>{status.toUpperCase()}</h4>
                        {tasks.filter(task => task.status === status).map(task => (
                            <div key={task.id} className="task-card">
                                <p><strong>{task.name}</strong></p>
                                <p>📌 Priorytet: {task.priority}</p>
                                <p>🕒 Przewidywany czas: {task.estimatedTime}h</p>
                                {task.assignedUser ? (
                                    <p>👤 {users.find(u => u.id === task.assignedUser)?.name}</p>
                                ) : (
                                    <select onChange={(e) => handleAssignUser(task.id, Number(e.target.value))}>
                                        <option value="">Wybierz użytkownika</option>
                                        {users
                                            .filter(user => ["devops", "developer"].includes(user.role))
                                            .map(user => (
                                                <option key={user.id} value={user.id}>{user.name}</option>
                                            ))}
                                    </select>
                                )}
                                {task.status === "doing" && (
                                    <button className="btn-done" onClick={() => handleCompleteTask(task.id)}>Zakończ</button>
                                )}
                                <button className="btn-delete" onClick={() => handleDeleteTask(task.id)}>Usuń</button>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskBoard;
