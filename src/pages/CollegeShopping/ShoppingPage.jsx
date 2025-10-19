// import React from 'react';
// function ShoppingPage() {
//   return (
//     <div>
//       <h1>College Shopping List</h1>
//       <p>Things to buy before moving into college dorms.</p>
//     </div>
//   );
// }

// export default ShoppingPage;

import React, { useEffect, useMemo, useReducer, useState } from 'react';
import {
  reducer,
  actions,
  initialState,
} from '../../reducers/shopping.reducer';
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

  // Load from LocalStorage on mount
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

  // Save to LocalStorage on any change
  useEffect(() => {
    if (isLoading) return; // пропускаем первый рендер
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isLoading]);

  const addItem = async () => {
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
    const item = { ...it, name: name.trim() };
    dispatch({ type: actions.updateItem, item });
  };

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

  return (
    <div className="shop-page">
      <h1>College Shopping List</h1>

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
          <div className="align-end">
            <button disabled={isSaving || !form.name.trim()} onClick={addItem}>
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
        <div className="list">
          {sortedFiltered.map((item) => (
            <div className="card row" key={item.id}>
              <div className="row-left">
                <input
                  type="checkbox"
                  checked={item.packed}
                  onChange={() => togglePacked(item.id)}
                  aria-label={`Mark ${item.name} packed`}
                />
                <div>
                  <strong
                    style={{
                      textDecoration: item.packed ? 'line-through' : 'none',
                    }}
                  >
                    {item.name}
                  </strong>
                  <div className="muted">
                    x{item.qty} · {item.category}
                  </div>
                </div>
              </div>
              <div className="row-right">
                <button className="ghost" onClick={() => editItem(item)}>
                  Edit
                </button>
                <button className="danger" onClick={() => deleteItem(item.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
          <div className="muted" style={{ marginTop: 6 }}>
            Packed {stats.packed}/{stats.total}
          </div>
        </div>
      )}
    </div>
  );
}
