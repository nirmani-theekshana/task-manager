import { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import api from '../api/axios';

function Column({ column, onTaskCreated, onTaskDeleted, onColumnDeleted }) {
  const [taskTitle, setTaskTitle] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAddTask = async () => {
    if (!taskTitle.trim()) return;
    try {
      const res = await api.post('/tasks', {
        title: taskTitle,
        columnId: column.id,
        order: column.tasks.length
      });
      onTaskCreated(column.id, res.data);
      setTaskTitle('');
      setAdding(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.column}>
      <div style={styles.header}>
        <h3 style={styles.title}>{column.title}</h3>
        <button style={styles.deleteColBtn} onClick={() => onColumnDeleted(column.id)}>✕</button>
      </div>

      <Droppable droppableId={String(column.id)}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={styles.taskList}
          >
            {column.tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onDelete={onTaskDeleted}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {adding ? (
        <div>
          <input
            style={styles.input}
            placeholder="Task title..."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            autoFocus
          />
          <div style={styles.addActions}>
            <button style={styles.confirmBtn} onClick={handleAddTask}>Add</button>
            <button style={styles.cancelBtn} onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <button style={styles.addBtn} onClick={() => setAdding(true)}>+ Add Task</button>
      )}
    </div>
  );
}

const styles = {
  column: { backgroundColor: '#f4f5f7', borderRadius: '8px', padding: '12px', width: '280px', minHeight: '200px', flexShrink: 0 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  title: { margin: 0, fontSize: '15px', fontWeight: '600', color: '#333' },
  taskList: { minHeight: '50px' },
  input: { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '13px', boxSizing: 'border-box', marginBottom: '6px' },
  addActions: { display: 'flex', gap: '6px' },
  confirmBtn: { padding: '6px 12px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' },
  cancelBtn: { padding: '6px 12px', backgroundColor: '#e5e7eb', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' },
  addBtn: { width: '100%', padding: '8px', backgroundColor: 'transparent', border: '1px dashed #ccc', borderRadius: '4px', cursor: 'pointer', color: '#888', fontSize: '13px', marginTop: '8px' },
  deleteColBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: '14px' }
};

export default Column;