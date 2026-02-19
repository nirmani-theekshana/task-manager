import { Draggable } from '@hello-pangea/dnd';

function TaskCard({ task, index, onDelete }) {
  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{ ...styles.card, ...provided.draggableProps.style }}
        >
          <p style={styles.title}>{task.title}</p>
          {task.description && <p style={styles.desc}>{task.description}</p>}
          <button style={styles.deleteBtn} onClick={() => onDelete(task.id)}>✕</button>
        </div>
      )}
    </Draggable>
  );
}

const styles = {
  card: { backgroundColor: 'white', padding: '12px', borderRadius: '6px', marginBottom: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'relative' },
  title: { margin: '0 0 4px 0', fontWeight: '500', fontSize: '14px', paddingRight: '20px' },
  desc: { margin: '0', fontSize: '12px', color: '#888' },
  deleteBtn: { position: 'absolute', top: '8px', right: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: '12px' }
};

export default TaskCard;