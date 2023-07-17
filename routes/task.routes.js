const router = require("express").Router();
// const mongoose = require("mongoose");

const Task = require("../models/Task.model");
const Project = require("../models/Project.model");

//  POST /api/tasks  -  Creates a new task
router.post("/tasks", (req, res, next) => {
  const { title, description, projectId } = req.body;

  Task.create({ title, description, project: projectId })
    .then((newTask) => {
      return Project.findByIdAndUpdate(projectId, {
        $push: { tasks: newTask._id },
      });
    })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

router.delete("/tasks/:taskId", (req, res, next) => {
  const taskId = req.params.taskId;

  Task.deleteOne({ _id: taskId })
    .then((removalTask) => {
      return Project.findOneAndUpdate(
        {},
        { $pull: { tasks: taskId } },
        { new: true } // To get the updated project after the task removal
      );
    })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});
module.exports = router;
