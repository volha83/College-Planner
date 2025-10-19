import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function ItemRow({ item, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [working, setWorking] = useState(item.name);

  useEffect(() => setWorking(item.name), [item]);

  function cancel() {
    setWorking(item.name);
    setIsEditing(false);
  }
  function save() {
    onEdit({ ...item, name: working });
    setIsEditing(false);
  }

  return (
    <li
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 10,
        background: '#fff',
        listStyle: 'none',
      }}
    >
      <form
        onSubmit={(e) => e.preventDefault()}
        style={{
          display: 'flex',
          gap: 10,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {isEditing ? (
          <>
            <input
              value={working}
              onChange={(e) => setWorking(e.target.value)}
            />
            <button type="button" className="btn btn-ghost" onClick={cancel}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={save}>
              Update
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onToggle(item.id)}
              title="Toggle packed"
              className="btn btn-ghost"
              style={{ padding: '4px 8px' }}
            >
              ✔
            </button>
            <span onClick={() => setIsEditing(true)}>{item.name}</span>
            <span style={{ color: '#6b7280', marginLeft: 8, fontSize: 12 }}>
              x{item.qty} · {item.category}
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => onEdit(item)}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => onDelete(item.id)}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </form>
    </li>
  );
}

ItemRow.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    qty: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    packed: PropTypes.bool.isRequired,
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
