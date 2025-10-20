import React from 'react';
import PropTypes from 'prop-types';
import CollegesListItem from './CollegesListItem';
import styles from './CollegesList.module.css';

export default function CollegesList({
  records,
  isLoading,
  onMarkSubmitted,
  onUpdateOne,
  onDeleteOne,
}) {
  if (isLoading) return <p className="muted">Loading colleges…</p>;
  if (!records || records.length === 0)
    return <p className="muted">No colleges yet!</p>;

  const active = records.filter(
    (r) => (r.fields?.Status || '') !== 'Submitted'
  );

  return active.length === 0 ? (
    <p className="muted">Add a college above to get started.</p>
  ) : (
    <ul className={styles.list}>
      {active.map((rec) => (
        <CollegesListItem
          key={rec.id}
          rec={rec}
          onMarkSubmitted={onMarkSubmitted}
          onUpdateOne={onUpdateOne}
          onDeleteOne={onDeleteOne}
        />
      ))}
    </ul>
  );
}

CollegesList.propTypes = {
  records: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  onMarkSubmitted: PropTypes.func.isRequired,
  onUpdateOne: PropTypes.func.isRequired,
  onDeleteOne: PropTypes.func.isRequired,
};
