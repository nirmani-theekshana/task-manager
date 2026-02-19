const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getBoards = async (req, res) => {
  try {
    const boards = await prisma.board.findMany({
      where: { userId: req.userId },
      include: {
        columns: {
          include: { tasks: true },
          orderBy: { order: 'asc' }
        }
      }
    });
    res.json(boards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createBoard = async (req, res) => {
  try {
    const { title } = req.body;
    const board = await prisma.board.create({
      data: { title, userId: req.userId },
      include: {
        columns: {
          include: { tasks: true }
        }
      }
    });
    res.status(201).json(board);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteBoard = async (req, res) => {
  try {
    await prisma.board.delete({ 
      where: { id: parseInt(req.params.id) } 
    });
    res.json({ message: 'Board deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getBoards, createBoard, deleteBoard };
