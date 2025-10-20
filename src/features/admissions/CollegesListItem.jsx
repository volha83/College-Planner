import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './CollegesListItem.module.css';

export default function CollegesListItem({
  rec,
  onMarkSubmitted,
  onUpdateOne,
  onDeleteOne,
}) {
  const f = rec.fields || {};
  const [isEditing, setIsEditing] = useState(false);
  const [workingName, setWorkingName] = useState(f.Name || '');

  useEffect(() => setWorkingName(f.Name || ''), [rec]);

  function cancel() {
    setWorkingName(f.Name || '');
    setIsEditing(false);
  }

  function save() {
    onUpdateOne({ ...rec, fields: { ...f, Name: workingName } });
    setIsEditing(false);
  }

  return (
    <li className={styles.item}>
      <form onSubmit={(e) => e.preventDefault()} className={styles.row}>
        {isEditing ? (
          <>
            <input
              value={workingName}
              onChange={(e) => setWorkingName(e.target.value)}
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
              className={styles.iconBtn}
              onClick={() => onMarkSubmitted(rec)}
              disabled={f.Status === 'Submitted'}
              title="Mark Submitted"
            >
              ✔
            </button>

            <span className={styles.title} onClick={() => setIsEditing(true)}>
              <strong>{f.Name}</strong>
              <span className={styles.meta}>
                {f.State} · {f['Application Type']} · {f.Deadline || '—'}
              </span>
            </span>

            <div className={styles.actions}>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => onDeleteOne(rec)}
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

CollegesListItem.propTypes = {
  rec: PropTypes.object.isRequired,
  onMarkSubmitted: PropTypes.func.isRequired,
  onUpdateOne: PropTypes.func.isRequired,
  onDeleteOne: PropTypes.func.isRequired,
};
