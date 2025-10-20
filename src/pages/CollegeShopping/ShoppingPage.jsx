import React, { useEffect, useMemo, useReducer, useState } from 'react';
import {
  reducer,
  actions,
  initialState,
} from '../../reducers/shopping.reducer';
import ItemRow from '../../features/shopping/ItemRow';
import './ShoppingPage.module.css';

const STORAGE_KEY = 'college.shopping.v1';
const emptyForm = { name: '', qty: 1, category: 'Dorm', packed: false };

export default function ShoppingPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    items,
    isLoading,
    isSaving,
    errorMessage,
    sortField,
    queryString,
    category,
  } = state;

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw
        ? JSON.parse(raw)
        : [
            {
              id: crypto.randomUUID(),
              name: 'Twin XL sheets',
              qty: 2,
              category: 'Dorm',
              packed: false,
            },
          ];
      dispatch({ type: actions.initFromStorage, items: parsed });
    } catch (e) {
      dispatch({ type: actions.setError, error: e });
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isLoading]);

  const sortedFiltered = useMemo(() => {
    let arr = items;

    if (queryString) {
      const q = queryString.toLowerCase();
      arr = arr.filter((i) => i.name.toLowerCase().includes(q));
    }
    if (category !== 'All') {
      arr = arr.filter((i) => i.category === category);
    }

    const by =
      {
        name: (a, b) => a.name.localeCompare(b.name),
        category: (a, b) =>
          a.category.localeCompare(b.category) || a.name.localeCompare(b.name),
        packed: (a, b) =>
          Number(a.packed) - Number(b.packed) || a.name.localeCompare(b.name),
      }[sortField] || (() => 0);

    return [...arr].sort(by);
  }, [items, queryString, category, sortField]);

  const stats = useMemo(
    () => ({
      total: items.length,
      packed: items.filter((i) => i.packed).length,
    }),
    [items]
  );

  const addItem = () => {
    const name = form.name.trim();
    if (!name) return;
    const item = {
      id: crypto.randomUUID(),
      name,
      qty: Number(form.qty) || 1,
      category: form.category,
      packed: false,
    };
    dispatch({ type: actions.startRequest });
    dispatch({ type: actions.addItem, item });
    setForm(emptyForm);
    dispatch({ type: actions.endRequest });
  };

  const deleteItem = (id) => dispatch({ type: actions.deleteItem, id });
  const togglePacked = (id) => dispatch({ type: actions.togglePacked, id });

  const editItem = (it) => {
    const name = prompt('Edit item name', it.name);
    if (name === null) return;
    dispatch({ type: actions.updateItem, item: { ...it, name: name.trim() } });
  };

  return (
    <div className="shop-page">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1em',
        }}
      >
        <h1 style={{ margin: 0 }}>College Shopping List</h1>
        <img
          src="/src/assets/shopping-list.jpg"
          alt="College shopping illustration"
          style={{
            width: '5em',
            height: '5em',
          }}
        />
      </div>

      <div className="shop-toolbar">
        <input
          placeholder="Search item…"
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
          <option value="name">Name</option>
          <option value="category">Category</option>
          <option value="packed">Packed status</option>
        </select>
        <select
          value={category}
          onChange={(e) =>
            dispatch({ type: actions.setCategory, category: e.target.value })
          }
        >
          <option>All</option>
          <option>Dorm</option>
          <option>Study</option>
          <option>Clothing</option>
          <option>Hygiene</option>
          <option>Kitchen</option>
        </select>
      </div>

      <div className="card shop-form">
        <h2>Add Item</h2>
        <div className="grid">
          <label>
            Item
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </label>
          <label>
            Qty
            <input
              type="number"
              min="1"
              value={form.qty}
              onChange={(e) => setForm((f) => ({ ...f, qty: e.target.value }))}
            />
          </label>
          <label>
            Category
            <select
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value }))
              }
            >
              <option>Dorm</option>
              <option>Study</option>
              <option>Clothing</option>
              <option>Hygiene</option>
              <option>Kitchen</option>
            </select>
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
              disabled={isSaving || !form.name.trim()}
              onClick={addItem}
            >
              {isSaving ? 'Saving…' : 'Add'}
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="muted">Loading…</div>
      ) : errorMessage ? (
        <div className="error">Error: {errorMessage}</div>
      ) : sortedFiltered.length === 0 ? (
        <div className="muted">No items yet.</div>
      ) : (
        <ul className="list" style={{ padding: 0 }}>
          {sortedFiltered.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              onToggle={togglePacked}
              onEdit={editItem}
              onDelete={deleteItem}
            />
          ))}
          <div className="muted" style={{ marginTop: 6 }}>
            Packed {stats.packed}/{stats.total}
          </div>
        </ul>
      )}
    </div>
  );
}
