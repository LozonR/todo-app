import { useState, useEffect } from "react";
import { DELETE, GET, PATCH, POST } from "./api";
import type { Todo } from "../../server/src/types"
import { TodoItem } from "./components/TodoItem";
import { TodoForm } from "./components/TodoForm";


function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorText, setErrorText] = useState<string>("");

  // Get todo array from api
  async function loadTodos() {
    try {
      const response = await GET("/api/todos");
      const data: Todo[] = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Request failed:", error);
      setErrorText("Cannot load todos, is the server running?");
    }
  }

  // Update todo array initially
  useEffect(() => { loadTodos() }, []);

  async function toggleTodo(todo: Todo) {
    try {
      setErrorText("");
      await PATCH(`/api/todos/${todo.id}`, { "done": !todo.done });
      await loadTodos();
    } catch (error) {
      console.error("Request failed:", error);
      setErrorText("Cannot update todo, is the server running?");
    }
  }

  async function deleteTodo(id: number) {
    try {
      setErrorText("");
      await DELETE(`/api/todos/${id}`)
      await loadTodos();
    } catch (error) {
      console.error("Request failed:", error);
      setErrorText("Cannot delete todo, is the server running?");
    }
  }

  async function addTodo(text: string) {
    try {
      setErrorText("");
      await POST("/api/todos", { text });
      await loadTodos();
    } catch (error) {
      console.error("Request failed:", error);
      setErrorText("Cannot add todo, is the server running?");
      throw error;
    }
  }

  return (
    <div>
      <h1>Todos</h1>

      <TodoForm onAdd={addTodo} />

      <ul>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={() => toggleTodo(todo)}
            onDelete={() => deleteTodo(todo.id)}
          />
        ))}
      </ul>

      {errorText && <p>{errorText}</p>}
    </div>
  );
}

export default App;
