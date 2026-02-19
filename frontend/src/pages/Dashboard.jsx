import { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Column from '../components/Column';
import api from '../api/axios';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);
  const [boardTitle, setBoardTitle] = useState('');
  const [columnTitle, setColumnTitle] = useState('');

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const res = await api.get('/boards');
      setBoards(res.data);
      if (res.data.length > 0) setActiveBoard(res.data[0]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateBoard = async () => {
    if (!boardTitle.trim()) return;
    try {
      const res = await api.post('/boards', { title: boardTitle });
      setBoards([...boards, res.data]);
      setActiveBoard(res.data);
      setBoardTitle('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateColumn = async () => {
    if (!columnTitle.trim() || !activeBoard) return;
    try {
      const res = await api.post('/columns', {
        title: columnTitle,
        boardId: activeBoard.id,
        order: activeBoard.columns.length
      });
      const updatedBoard = {
        ...activeBoard,
        columns: [...activeBoard.columns, { ...res.data, tasks: [] }]
      };
      setActiveBoard(updatedBoard);
      setBoards(boards.map(b => b.id === updatedBoard.id ? updatedBoard : b));
      setColumnTitle('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleTaskCreated = (columnId, newTask) => {
    const updatedBoard = {
      ...activeBoard,
      columns: activeBoard.columns.map(col =>
        col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col
      )
    };
    setActiveBoard(updatedBoard);
    setBoards(boards.map(b => b.id === updatedBoard.id ? updatedBoard : b));
  };

  const handleTaskDeleted = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      const updatedBoard = {
        ...activeBoard,
        columns: activeBoard.columns.map(col => ({
          ...col,
          tasks: col.tasks.filter(t => t.id !== taskId)
        }))
      };
      setActiveBoard(updatedBoard);
      setBoards(boards.map(b => b.id === updatedBoard.id ? updatedBoard : b));
    } catch (err) {
      console.error(err);
    }
  };

  const handleColumnDeleted = async (columnId) => {
    try {
      await api.delete(`/columns/${columnId}`);
      const updatedBoard = {
        ...activeBoard,
        columns: activeBoard.columns.filter(col => col.id !== columnId)
      };
      setActiveBoard(updatedBoard);
      setBoards(boards.map(b => b.id === updatedBoard.id ? updatedBoard : b));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceCol = activeBoard.columns.find(c => String(c.id) === source.droppableId);
    const destCol = activeBoard.columns.find(c => String(c.id) === destination.droppableId);
    const task = sourceCol.tasks.find(t => String(t.id) === draggableId);

    const newSourceTasks = sourceCol.tasks.filter(t => String(t.id) !== draggableId);
    const newDestTasks = [...destCol.tasks];
    newDestTasks.splice(destination.index, 0, task);

    const updatedBoard = {
      ...activeBoard,
      columns: activeBoard.columns.map(col => {
        if (col.id === sourceCol.id) return { ...col, tasks: newSourceTasks };
        if (col.id === destCol.id) return { ...col, tasks: newDestTasks };
        return col;
      })
    };
    setActiveBoard(updatedBoard);
    setBoards(boards.map(b => b.id === updatedBoard.id ? updatedBoard : b));

    try {
      await api.put(`/tasks/${task.id}`, {
        title: task.title,
        description: task.description,
        columnId: destCol.id,
        order: destination.index
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h2 style={styles.logo}>TaskBoard</h2>
        <div style={styles.navRight}>
          <span style={styles.username}>Hi, {user?.name}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.body}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <h4 style={styles.sidebarTitle}>My Boards</h4>
          {boards.map(board => (
            <div
              key={board.id}
              style={{ ...styles.boardItem, ...(activeBoard?.id === board.id ? styles.activeBoardItem : {}) }}
              onClick={() => setActiveBoard(board)}
            >
              {board.title}
            </div>
          ))}
          <div style={styles.newBoard}>
            <input
              style={styles.sidebarInput}
              placeholder="New board name..."
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
            />
            <button style={styles.sidebarBtn} onClick={handleCreateBoard}>+ Add</button>
          </div>
        </div>

        {/* Board Area */}
        <div style={styles.main}>
          {activeBoard ? (
            <>
              <div style={styles.boardHeader}>
                <h3 style={styles.boardTitle}>{activeBoard.title}</h3>
                <div style={styles.newColumn}>
                  <input
                    style={styles.columnInput}
                    placeholder="New column name..."
                    value={columnTitle}
                    onChange={(e) => setColumnTitle(e.target.value)}
                  />
                  <button style={styles.columnBtn} onClick={handleCreateColumn}>+ Add Column</button>
                </div>
              </div>
              <DragDropContext onDragEnd={handleDragEnd}>
                <div style={styles.columnsArea}>
                  {activeBoard.columns.map(col => (
                    <Column
                      key={col.id}
                      column={col}
                      onTaskCreated={handleTaskCreated}
                      onTaskDeleted={handleTaskDeleted}
                      onColumnDeleted={handleColumnDeleted}
                    />
                  ))}
                </div>
              </DragDropContext>
            </>
          ) : (
            <div style={styles.empty}>
              <p>Create a board from the sidebar to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'sans-serif' },
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', backgroundColor: '#4f46e5', color: 'white', height: '56px' },
  logo: { margin: 0, fontSize: '20px' },
  navRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  username: { fontSize: '14px' },
  logoutBtn: { padding: '6px 14px', backgroundColor: 'white', color: '#4f46e5', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' },
  body: { display: 'flex', flex: 1, overflow: 'hidden' },
  sidebar: { width: '220px', backgroundColor: '#1e1b4b', padding: '20px 12px', overflowY: 'auto' },
  sidebarTitle: { color: '#a5b4fc', fontSize: '12px', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' },
  boardItem: { padding: '10px 12px', borderRadius: '6px', color: '#c7d2fe', cursor: 'pointer', marginBottom: '4px', fontSize: '14px' },
  activeBoardItem: { backgroundColor: '#4f46e5', color: 'white' },
  newBoard: { marginTop: '16px' },
  sidebarInput: { width: '100%', padding: '7px', borderRadius: '4px', border: 'none', fontSize: '13px', marginBottom: '6px', boxSizing: 'border-box' },
  sidebarBtn: { width: '100%', padding: '7px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' },
  main: { flex: 1, padding: '24px', overflowX: 'auto', backgroundColor: '#f0f2f5' },
  boardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  boardTitle: { margin: 0, fontSize: '20px', color: '#333' },
  newColumn: { display: 'flex', gap: '8px' },
  columnInput: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px' },
  columnBtn: { padding: '8px 14px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  columnsArea: { display: 'flex', gap: '16px', alignItems: 'flex-start' },
  empty: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#888', fontSize: '16px' }
};

export default Dashboard;