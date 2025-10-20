import React, { useEffect, useCallback, useReducer } from 'react';
import { makeAirtableClient } from '../../api/airtable';
import {
  reducer,
  actions,
  initialState,
} from '../../reducers/colleges.reducer';
import CollegesForm from '../../features/admissions/CollegesForm';
import CollegesList from '../../features/admissions/CollegesList';
import './AdmissionTasksPage.css';

const client = makeAirtableClient();

export default function AdmissionTasksPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    list,
    isLoading,
    isSaving,
    errorMessage,
    sortField,
    sortDirection,
    queryString,
  } = state;

  const encodeUrl = useCallback(
    () => client.bindEncodeUrl({ sortField, sortDirection, queryString })(),
    [sortField, sortDirection, queryString]
  );

  // READ
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      dispatch({ type: actions.fetchStart });
      try {
        const data = await client.list(encodeUrl(), { signal: ac.signal });
        dispatch({ type: actions.fetchSuccess, records: data.records });
      } catch (error) {
        if (error.name !== 'AbortError') {
          dispatch({ type: actions.fetchError, error });
        }
      }
    })();
    return () => ac.abort();
  }, [encodeUrl]);

  // CREATE
  async function addCollegeWithFields(fields) {
    dispatch({ type: actions.startRequest });
    try {
      const { records } = await client.create(fields);
      dispatch({ type: actions.addOne, record: records[0] });
    } catch (error) {
      dispatch({ type: actions.fetchError, error });
    } finally {
      dispatch({ type: actions.endRequest });
    }
  }

  // UPDATE — Mark Submitted
  async function markSubmitted(rec) {
    const original = rec;
    const patched = { ...rec, fields: { ...rec.fields, Status: 'Submitted' } };
    dispatch({ type: actions.updateOne, record: patched });
    try {
      await client.patch(rec.id, { Status: 'Submitted' });
    } catch (error) {
      dispatch({ type: actions.updateOne, record: original });
      dispatch({ type: actions.fetchError, error });
    }
  }

  // UPDATE
  async function updateCollegeName(recWithNewFields) {
    const { id, fields } = recWithNewFields;
    const original = list.find((r) => r.id === id);
    dispatch({ type: actions.updateOne, record: recWithNewFields });
    try {
      await client.patch(id, { Name: fields.Name });
    } catch (error) {
      if (original) dispatch({ type: actions.updateOne, record: original });
      dispatch({ type: actions.fetchError, error });
    }
  }

  // DELETE
  async function removeCollege(rec) {
    if (!confirm(`Delete "${rec.fields?.Name}"?`)) return;
    dispatch({ type: actions.deleteOne, id: rec.id });
    try {
      await client.remove(rec.id);
    } catch (error) {
      dispatch({ type: actions.addOne, record: rec });
      dispatch({ type: actions.fetchError, error });
    }
  }

  return (
    <div className="page">
      <h1>Admission Tasks</h1>

      <div className="toolbar">
        <input
          placeholder="Search by Name…"
          value={queryString}
          onChange={(e) =>
            dispatch({ type: actions.setQuery, queryString: e.target.value })
          }
        />
        <select
          value={sortField}
          onChange={(e) =>
            dispatch({ type: actions.setSortField, sortField: e.target.value })
          }
        >
          <option value="Deadline">Deadline</option>
          <option value="State">State</option>
          <option value="Priority">Priority</option>
          <option value="Status">Status</option>
          <option value="Name">Name</option>
        </select>
      </div>

      <CollegesForm onAdd={addCollegeWithFields} isSaving={isSaving} />

      {isLoading ? (
        <div className="muted">Loading…</div>
      ) : errorMessage ? (
        <div className="error">Error: {errorMessage}</div>
      ) : (
        <CollegesList
          records={list}
          isLoading={isLoading}
          onMarkSubmitted={markSubmitted}
          onUpdateOne={updateCollegeName}
          onDeleteOne={removeCollege}
        />
      )}
    </div>
  );
}
