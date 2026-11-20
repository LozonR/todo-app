import express from "express";
import { getAll, create, update, remove } from "./store.js";


const app = express();
const port = 3000;

app.use(express.json());


app.get('/api/todos', (req, res) => {
  res.json(getAll());
});


app.post('/api/todos', (req, res) => {
  const bodyText = req.body?.text;

  if (typeof bodyText !== "string" || bodyText.trim() === "") {
    res.status(400).json({ error: "text is required" });
    return;
  }

  const todo = create(bodyText.trim());

  res.status(201).json(todo);
});


app.patch('/api/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const bodyText = req.body?.text;
  const bodyDone = req.body?.done;

  const changes: { text?: string, done?: boolean } = {};

  if (typeof bodyText === "string" && bodyText.trim() !== "") {
    changes.text = bodyText.trim();
  }
  if (typeof bodyDone === "boolean") {
    changes.done = bodyDone;
  }

  const result = update(id, changes);

  if (!result) {
    res.status(404).json({ error: "todo id not found" });
    return;
  }

  res.status(200).json(result);
});


app.delete('/api/todos/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!remove(id)) {
    res.status(404).json({ error: "todo id not found" });
    return;
  }

  res.sendStatus(204);
});


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
