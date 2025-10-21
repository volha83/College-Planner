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
    <li className={`card ${styles.item}`}>
      {isEditing ? (
        <form onSubmit={(e) => e.preventDefault()} className={styles.row}>
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
        </form>
      ) : (
        <>
          <div className={styles.title} onClick={() => setIsEditing(true)}>
            <strong>{f.Name}</strong>
          </div>
          <div className={styles.meta}>
            {f.State} · {f['Application Type']} · {f.Deadline || '—'}
          </div>

          {f['Application URL'] && (
            <a
              className={styles.link}
              href={f['Application URL']}
              target="_blank"
              rel="noreferrer"
            >
              Application
            </a>
          )}

          {f.Notes && (
            <div className={styles.notes}>
              <span className="muted">Notes: </span>
              {f.Notes}
            </div>
          )}
        </>
      )}

      <div className={styles.badges}>
        <span className="badge">{f.Priority || '—'}</span>
        <span className="badge">{f.Status || '—'}</span>
        <span className="badge">
          Tests {f['Requires Test Score'] ? '✓' : '—'}
        </span>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => onMarkSubmitted(rec)}
          disabled={f.Status === 'Submitted'}
        >
          Mark Submitted
        </button>

        <button
          type="button"
          className="btn btn-danger"
          onClick={() => onDeleteOne(rec)}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

CollegesListItem.propTypes = {
  rec: PropTypes.object.isRequired,
  onMarkSubmitted: PropTypes.func.isRequired,
  onUpdateOne: PropTypes.func.isRequired,
  onDeleteOne: PropTypes.func.isRequired,
};
