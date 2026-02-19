const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createTask = async (req, res) => {
  try {
    const { title, description, columnId, order } = req.body;
    const task = await prisma.task.create({
      data: { 
        title, 
        description, 
        columnId: parseInt(columnId), 
        order: parseInt(order) 
      }
    });
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description, columnId, order } = req.body;
    const task = await prisma.task.update({
      where: { id: parseInt(req.params.id) },
      data: { 
        title, 
        description, 
        columnId: parseInt(columnId), 
        order: parseInt(order) 
      }
    });
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    await prisma.task.delete({ 
      where: { id: parseInt(req.params.id) } 
    });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createTask, updateTask, deleteTask };