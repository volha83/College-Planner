import React, { useState } from 'react';
import PropTypes from 'prop-types';

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

export default function CollegesForm({ onAdd, isSaving }) {
  const [form, setForm] = useState(emptyForm);

  function submit(e) {
    e.preventDefault();
    if (!form.Name.trim()) return alert('Name is required');
    onAdd(form);
    setForm(emptyForm);
  }

  return (
    <div className="card form">
      <h2>Add College</h2>
      <form onSubmit={submit}>
        <div className="grid">
          <label>
            Name
            <input
              name="Name"
              value={form.Name}
              onChange={(e) => setForm((f) => ({ ...f, Name: e.target.value }))}
            />
          </label>

          <label>
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
          Notes
          <textarea
            rows={2}
            name="Notes"
            value={form.Notes}
            onChange={(e) => setForm((f) => ({ ...f, Notes: e.target.value }))}
          />
        </label>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '1em',
          }}
        >
          <button
            className="btn btn-primary"
            disabled={isSaving || !form.Name.trim()}
          >
            {isSaving ? 'Saving…' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
}

CollegesForm.propTypes = {
  onAdd: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
};
