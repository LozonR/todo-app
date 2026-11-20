import { useState } from "react";

type TodoFormProps = {
  onAdd: (text: string) => Promise<void>;
}

export function TodoForm({ onAdd }: TodoFormProps) {
  const [newText, setNewText] = useState<string>("");

  async function submitForm(event: React.SubmitEvent) {
    event.preventDefault();
    if (newText.trim() === "") {
      return;
    }

    try {
      await onAdd(newText.trim());
      setNewText("");
    } catch (error) {}
}

  return (
    <form onSubmit={submitForm}>
      <input name="newText" type="text" value={newText} onChange={(event) => setNewText(event.target.value)} />
      <button type="submit">Submit</button>
    </form>
  );
}
