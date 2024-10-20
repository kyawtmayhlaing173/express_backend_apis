const express = require("express");
const router = express.Router();
const { auth, isOwner } = require("../middlewares/auth");
const { TASK_STATUS } = require("../task_status.ts");

const prisma = require("../prismaClient");

router.get("/task", auth, async (req, res) => {
  try {
    const userId = res.locals.user.id;
    const { status } = req.body;

    const data = await prisma.task.findMany({
      where: {
        user: {
          id: userId,
        },
        ...(status && { status: status }),
      },
      orderBy: { id: "desc" },
      take: 20,
      include: {
        user: true,
      },
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.post("/task", auth, async (req, res) => {
  try {
    const { description, status } = req.body;
    const user = res.locals.user;

    if (!TASK_STATUS.includes(status)) {
      res.status(400).json({ message: "Invalid task status" })
    }

    const task = await prisma.task.create({
      data: { description, status, userId: user.id },
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to add task", error });
  }
});

router.put("/task/:id", auth, isOwner(), async (req, res) => {
  const { id } = req.params;
  const { description, status } = req.body;

  try {
    const task = prisma.task.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!task) {
      res.status(404).json({ message: "No task found to update" });
    }

    await prisma.task.updateMany({
      where: {
        id: Number(id),
      },
      data: {
        description: description,
        status: status,
      },
    });
    res.status(200).json({ message: "Successfully updated the task" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update the task" });
  }
});

router.delete("/task/:id", auth, isOwner(), async (req, res) => {
  const { id } = req.params;

  try {
    const task = await prisma.task.findUnique({
      where: { id: Number(id) },
    });
    if (!task) {
      return res.status(404).json({
        error: "Task not found or already deleted",
      });
    }

    await prisma.task.deleteMany({
      where: { id: Number(id) },
    });

    res.json({ message: "Task is successfully deleted" });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete task",
    });
  }
});

module.exports = { taskRouter: router };
