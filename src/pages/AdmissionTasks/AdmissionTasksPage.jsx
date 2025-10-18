import React, { useEffect, useCallback, useReducer, useState } from 'react';
import { makeAirtableClient } from '../../api/airtable';
import {
  reducer,
  actions,
  initialState,
} from '../../reducers/colleges.reducer';
import './AdmissionTasksPage.css';

const emptyForm = {
  Name: '',
  State: 'NC',
  'Application Type': 'Regular Decision',
  Deadline: '',
  Status: 'Planned',
  'Application URL': '',
  Notes: '',
  Priority: 'Medium',
  'Requires Test Score': false,
};

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
  const [form, setForm] = useState(emptyForm);

  //
  // const url = client.url;
  // const token = client.token;

  //
  const encodeUrl = useCallback(
    () => client.bindEncodeUrl({ sortField, sortDirection, queryString })(),
    [sortField, sortDirection, queryString]
  );

  // READ
  useEffect(() => {
    (async () => {
      dispatch({ type: actions.fetchStart });
      try {
        const data = await client.list(encodeUrl());
        dispatch({ type: actions.fetchSuccess, records: data.records });
      } catch (error) {
        dispatch({ type: actions.fetchError, error });
      }
    })();
  }, [encodeUrl]);

  // CREATE
  const addCollege = async () => {
    if (!form.Name.trim()) return alert('Name is required');
    dispatch({ type: actions.startRequest });
    try {
      const { records } = await client.create(form);
      dispatch({ type: actions.addOne, record: records[0] });
      setForm(emptyForm);
    } catch (error) {
      dispatch({ type: actions.fetchError, error });
    } finally {
      dispatch({ type: actions.endRequest });
    }
  };

  // Update
  const markSubmitted = async (rec) => {
    const original = rec;
    const patched = { ...rec, fields: { ...rec.fields, Status: 'Submitted' } };
    dispatch({ type: actions.updateOne, record: patched });
    try {
      await client.patch(rec.id, { Status: 'Submitted' });
    } catch (error) {
      dispatch({ type: actions.updateOne, record: original });
      dispatch({ type: actions.fetchError, error });
    }
  };

  // Delete
  const removeCollege = async (rec) => {
    if (!confirm(`Delete "${rec.fields?.Name}"?`)) return;
    dispatch({ type: actions.deleteOne, id: rec.id });
    try {
      await client.remove(rec.id);
    } catch (error) {
      dispatch({ type: actions.addOne, record: rec });
      dispatch({ type: actions.fetchError, error });
    }
  };

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
          <option value="Name">Name</option>
          <option value="Priority">Priority</option>
          <option value="Status">Status</option>
        </select>
        <select
          value={sortDirection}
          onChange={(e) =>
            dispatch({
              type: actions.setSortDirection,
              sortDirection: e.target.value,
            })
          }
        >
          <option value="asc">asc</option>
          <option value="desc">desc</option>
        </select>
      </div>

      <div className="card form">
        <h2>Add College</h2>
        <div className="grid">
          <label>
            {' '}
            Name
            <input
              name="Name"
              value={form.Name}
              onChange={(e) => setForm((f) => ({ ...f, Name: e.target.value }))}
            />
          </label>
          <label>
            {' '}
            State
            <select
              name="State"
              value={form.State}
              onChange={(e) =>
                setForm((f) => ({ ...f, State: e.target.value }))
              }
            >
              <option>NC</option>
              <option>SC</option>
            </select>
          </label>
          <label>
            {' '}
            Application Type
            <select
              name="Application Type"
              value={form['Application Type']}
              onChange={(e) =>
                setForm((f) => ({ ...f, ['Application Type']: e.target.value }))
              }
            >
              <option>Regular Decision</option>
              <option>Early Action</option>
              <option>Early Decision</option>
            </select>
          </label>
          <label>
            {' '}
            Deadline
            <input
              type="date"
              name="Deadline"
              value={form.Deadline}
              onChange={(e) =>
                setForm((f) => ({ ...f, Deadline: e.target.value }))
              }
            />
          </label>
          <label>
            {' '}
            Status
            <select
              name="Status"
              value={form.Status}
              onChange={(e) =>
                setForm((f) => ({ ...f, Status: e.target.value }))
              }
            >
              <option>Planned</option>
              <option>In Progress</option>
              <option>Submitted</option>
              <option>Accepted</option>
              <option>Rejected</option>
            </select>
          </label>
          <label>
            {' '}
            Priority
            <select
              name="Priority"
              value={form.Priority}
              onChange={(e) =>
                setForm((f) => ({ ...f, Priority: e.target.value }))
              }
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </label>
          <label>
            {' '}
            Application URL
            <input
              name="Application URL"
              value={form['Application URL']}
              onChange={(e) =>
                setForm((f) => ({ ...f, ['Application URL']: e.target.value }))
              }
            />
          </label>
          <label>
            {' '}
            Requires Test Score
            <input
              type="checkbox"
              name="Requires Test Score"
              checked={form['Requires Test Score']}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  ['Requires Test Score']: e.target.checked,
                }))
              }
            />
          </label>
        </div>
        <label className="notes">
          {' '}
          Notes
          <textarea
            rows={2}
            name="Notes"
            value={form.Notes}
            onChange={(e) => setForm((f) => ({ ...f, Notes: e.target.value }))}
          />
        </label>
        <button disabled={isSaving} onClick={addCollege}>
          {isSaving ? 'Saving…' : 'Add'}
        </button>
      </div>

      {isLoading ? (
        <div className="muted">Loading…</div>
      ) : errorMessage ? (
        <div className="error">Error: {errorMessage}</div>
      ) : list.length === 0 ? (
        <div className="muted">No colleges yet.</div>
      ) : (
        <div className="list">
          {list.map((rec) => {
            const f = rec.fields || {};
            return (
              <div key={rec.id} className="card row">
                <div className="col">
                  <strong>{f.Name}</strong>
                  <div className="muted">
                    {f.State} · {f['Application Type']} · {f.Deadline || '—'}
                  </div>
                  {f['Application URL'] && (
                    <a
                      href={f['Application URL']}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Application
                    </a>
                  )}
                  {f.Notes && <div className="muted">Notes: {f.Notes}</div>}
                </div>
                <div className="col right">
                  <span className="badge">{f.Priority || '—'}</span>
                  <span className="badge">{f.Status || '—'}</span>
                  {f['Requires Test Score'] ? (
                    <span className="badge">Tests ✔</span>
                  ) : (
                    <span className="badge">Tests —</span>
                  )}
                  <div className="actions">
                    <button onClick={() => markSubmitted(rec)}>
                      Mark Submitted
                    </button>
                    <button
                      className="danger"
                      onClick={() => removeCollege(rec)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
