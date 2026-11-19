
const express = require("express");
const Task = require("../models/Task");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

// Convert progress percentage into task status
const getStatusFromProgress = (progress) => {
  if (progress === 0) return "Pending";
  if (progress === 100) return "Completed";
  return "In Progress";
};

// Convert task status into progress percentage
const getProgressFromStatus = (status, currentProgress = 0) => {
  if (status === "Pending") return 0;
  if (status === "Completed") return 100;

  if (status === "In Progress") {
    return currentProgress > 0 && currentProgress < 100
      ? currentProgress
      : 1;
  }

  return currentProgress;
};

// CREATE TASK
router.post("/", async (req, res) => {
  try {
    const {
  title,
  description,
  category,
  priority,
  status,
  progress,
  dueDate,
  subtasks,
} = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    const taskProgress =
      progress !== undefined
        ? Number(progress)
        : getProgressFromStatus(status || "Pending");

    if (
      !Number.isInteger(taskProgress) ||
      taskProgress < 0 ||
      taskProgress > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Progress must be a whole number between 0 and 100",
      });
    }

    const task = await Task.create({
      title,
      description,
      category,
      priority,
      progress: taskProgress,
      status: getStatusFromProgress(taskProgress),
      dueDate: dueDate || null,
      subtasks: Array.isArray(subtasks)
  ? subtasks
      .filter((item) => typeof item.title === "string" && item.title.trim())
      .map((item) => ({
        title: item.title.trim(),
        completed: Boolean(item.completed),
      }))
  : [],
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("CREATE TASK ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create task",
    });
  }
});

// GET ALL TASKS OF LOGGED-IN USER
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("FETCH TASKS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
});

// UPDATE TASK
router.put("/:id", async (req, res) => {
  try {
    const allowedFields = [
  "title",
  "description",
  "category",
  "priority",
  "status",
  "progress",
  "dueDate",
  "subtasks",
];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (
      updates.title !== undefined &&
      (typeof updates.title !== "string" || !updates.title.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Task title cannot be empty",
      });
    }

    if (updates.progress !== undefined) {
      updates.progress = Number(updates.progress);

      if (
        !Number.isInteger(updates.progress) ||
        updates.progress < 0 ||
        updates.progress > 100
      ) {
        return res.status(400).json({
          success: false,
          message: "Progress must be a whole number between 0 and 100",
        });
      }
    }
    if (updates.subtasks !== undefined) {
  if (!Array.isArray(updates.subtasks)) {
    return res.status(400).json({
      success: false,
      message: "Subtasks must be an array",
    });
  }

  updates.subtasks = updates.subtasks
    .filter(
      (item) =>
        item &&
        typeof item.title === "string" &&
        item.title.trim()
    )
    .map((item) => ({
      title: item.title.trim(),
      completed: Boolean(item.completed),
    }));
}

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Apply the requested updates
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        task[field] = updates[field];
      }
    }

    // Progress takes priority when both progress and status are supplied
    if (updates.progress !== undefined) {
      task.status = getStatusFromProgress(updates.progress);
    } else if (updates.status !== undefined) {
      task.progress = getProgressFromStatus(
        updates.status,
        task.progress
      );
    }

    await task.save();

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("UPDATE TASK ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update task",
    });
  }
});

// DELETE TASK
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("DELETE TASK ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
});

module.exports = router;
