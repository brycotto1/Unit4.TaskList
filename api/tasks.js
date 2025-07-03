import express from "express";
const taskRouter = express.Router();
export default taskRouter;

import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";

import { createTask, getTasksByUserId, updateTask, deleteTask } from "#db/queries/tasks";
import getUserFromToken from "#middleware/getUserFromToken";

taskRouter.use(requireUser);

taskRouter.route('/')
  .get(
    getUserFromToken,
    async (req, res) => {
      const tasks = await getTasksByUserId(req.user.id);
      res.send(tasks);
  })
  .post(
    requireBody(["title", "done"]),
    getUserFromToken,
    async (req, res) => {
      const task = await createTask(req.body.title, req.body.done, req.user.id);
      res.status(201).send(task);    
  })

taskRouter.route('/:id')
  .put(
    requireBody(["title", "done"]),
    getUserFromToken,
    async (req, res) => {
      const {id} = req.params;

      const tasks = await getTasksByUserId(req.user.id);
      tasks.forEach((task) => {
        if(task.id != id) return res.status(403).send("You are not authorized to update this task");
      });

      const updatedTask = await updateTask(req.body.title, req.body.done, id);
      res.send(updatedTask);
  })
  .delete(
    getUserFromToken,
    async (req, res) => {
      const {id} = req.params;

      const tasks = await getTasksByUserId(req.user.id);
      tasks.forEach((task) => {
        if(task.id != id) return res.status(403).send("You are not authorized to update this task");
      });

      const deletedTask = await deleteTask(id);
      res.status(204).send(deletedTask);
  })