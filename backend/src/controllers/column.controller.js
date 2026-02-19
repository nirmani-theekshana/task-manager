const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createColumn = async (req, res) => {
  try {
    const { title, boardId, order } = req.body;
    const column = await prisma.column.create({
      data: { title, boardId: parseInt(boardId), order: parseInt(order) },
      include: { tasks: true }
    });
    res.status(201).json(column);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteColumn = async (req, res) => {
  try {
    await prisma.column.delete({ 
      where: { id: parseInt(req.params.id) } 
    });
    res.json({ message: 'Column deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createColumn, deleteColumn };