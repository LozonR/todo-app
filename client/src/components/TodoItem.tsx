import type { Todo } from "../../../server/src/types";

type TodoItemProps = {
  todo: Todo,
  onToggle: () => void,
  onDelete: () => void
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li>
      <input type="checkbox" checked={todo.done} onChange={onToggle} />
      {todo.text}
      <button onClick={onDelete}>X</button>
    </li>
  )
}
