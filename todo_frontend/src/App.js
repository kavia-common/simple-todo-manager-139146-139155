import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { createClient } from '@supabase/supabase-js';

/**
 * Ocean Professional styling is handled in App.css and here via inline styles using the color tokens:
 * primary: #2563EB (blue), secondary/success: #F59E0B (amber), error: #EF4444
 * Layout: Single page with header, add input, and centered list.
 */

const styles = {
  app: {
    minHeight: '100vh',
    background: '#f9fafb',
    color: '#111827',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  card: {
    background: '#ffffff',
    width: '100%',
    maxWidth: 720,
    borderRadius: 16,
    boxShadow: '0 10px 30px rgba(2, 6, 23, 0.08)',
    border: '1px solid rgba(17,24,39,0.06)',
    overflow: 'hidden',
  },
  header: {
    padding: '20px 24px',
    background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(249,250,251,1))',
    borderBottom: '1px solid rgba(17,24,39,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    fontSize: 12,
    padding: '2px 8px',
    borderRadius: 999,
    background: 'rgba(37,99,235,0.1)',
    color: '#2563EB',
    fontWeight: 600,
  },
  title: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
    color: '#111827',
  },
  subtitle: {
    margin: 0,
    fontSize: 13,
    color: '#6B7280',
  },
  body: {
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  form: {
    display: 'flex',
    gap: 12,
  },
  input: {
    flex: 1,
    padding: '12px 14px',
    borderRadius: 12,
    border: '1px solid #E5E7EB',
    outline: 'none',
    fontSize: 14,
    transition: 'box-shadow 0.2s, border-color 0.2s',
  },
  addBtn: {
    padding: '12px 16px',
    borderRadius: 12,
    border: 'none',
    background: '#2563EB',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'transform 0.05s ease-in-out, box-shadow 0.2s',
    boxShadow: '0 6px 14px rgba(37,99,235,0.25)',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 14px',
    border: '1px solid #E5E7EB',
    borderRadius: 12,
    background: '#ffffff',
  },
  checkbox: {
    width: 18,
    height: 18,
    accentColor: '#2563EB',
    cursor: 'pointer',
  },
  text: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  meta: {
    fontSize: 12,
    color: '#6B7280',
  },
  editInput: {
    flex: 1,
    padding: '8px 10px',
    borderRadius: 10,
    border: '1px solid #E5E7EB',
    outline: 'none',
    fontSize: 14,
  },
  btnRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  btnSecondary: {
    padding: '8px 12px',
    borderRadius: 10,
    border: '1px solid #E5E7EB',
    background: '#F9FAFB',
    color: '#111827',
    cursor: 'pointer',
  },
  btnDanger: {
    padding: '8px 12px',
    borderRadius: 10,
    border: '1px solid rgba(239,68,68,0.25)',
    background: 'rgba(239,68,68,0.06)',
    color: '#B91C1C',
    cursor: 'pointer',
  },
  footer: {
    paddingTop: 8,
    fontSize: 12,
    color: '#6B7280',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  link: {
    color: '#2563EB',
    textDecoration: 'none',
  },
  error: {
    padding: '10px 12px',
    background: 'rgba(239,68,68,0.06)',
    border: '1px solid rgba(239,68,68,0.25)',
    borderRadius: 12,
    color: '#991B1B',
    fontSize: 13,
  },
  empty: {
    padding: '24px',
    textAlign: 'center',
    color: '#6B7280',
    background: '#F9FAFB',
    border: '1px dashed #E5E7EB',
    borderRadius: 12,
  },
};

// PUBLIC_INTERFACE
export function createSupabaseClient() {
  /**
   * Create and return a Supabase client using env variables.
   * Requires:
   * - REACT_APP_SUPABASE_URL
   * - REACT_APP_SUPABASE_KEY
   */
  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_KEY;
  if (!url || !key) {
    // eslint-disable-next-line no-console
    console.warn('Supabase URL/KEY not set. Please configure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY.');
  }
  return createClient(url || '', key || '');
}

// PUBLIC_INTERFACE
function App() {
  /**
   * Main single-page Todo application using Supabase for CRUD.
   * Table required: todos
   * Columns:
   * - id: uuid (or bigint) primary key
   * - title: text
   * - completed: boolean default false
   * - inserted_at: timestamp default now()
   */
  const supabase = useMemo(() => createSupabaseClient(), []);
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState('');

  // Load all todos on mount
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const { data, error: err } = await supabase
          .from('todos')
          .select('*')
          .order('inserted_at', { ascending: false });
        if (err) throw err;
        if (mounted) setTodos(data || []);
      } catch (e) {
        setError(e.message || 'Failed to load todos');
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [supabase]);

  // PUBLIC_INTERFACE
  const addTodo = async () => {
    /**
     * Add a new todo with the given title.
     */
    const title = newTitle.trim();
    if (!title) return;
    setLoading(true);
    setError('');
    try {
      const { data, error: err } = await supabase
        .from('todos')
        .insert([{ title, completed: false }])
        .select()
        .single();
      if (err) throw err;
      setTodos((prev) => [data, ...prev]);
      setNewTitle('');
    } catch (e) {
      setError(e.message || 'Failed to add todo');
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const toggleCompleted = async (todo) => {
    /**
     * Toggle the completed status of a todo.
     */
    setError('');
    const updated = { ...todo, completed: !todo.completed };
    // Optimistic UI
    setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
    try {
      const { error: err } = await supabase
        .from('todos')
        .update({ completed: updated.completed })
        .eq('id', todo.id);
      if (err) throw err;
    } catch (e) {
      // rollback if error
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? todo : t)));
      setError(e.message || 'Failed to update todo');
    }
  };

  // PUBLIC_INTERFACE
  const startEdit = (todo) => {
    /**
     * Start editing a specific todo by id.
     */
    setEditingId(todo.id);
    setEditingValue(todo.title);
  };

  // PUBLIC_INTERFACE
  const saveEdit = async (todo) => {
    /**
     * Save the edited title for a todo.
     */
    const title = editingValue.trim();
    if (!title) {
      setEditingId(null);
      setEditingValue('');
      return;
    }
    setError('');
    const updated = { ...todo, title };
    // Optimistic UI
    setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
    try {
      const { error: err } = await supabase
        .from('todos')
        .update({ title })
        .eq('id', todo.id);
      if (err) throw err;
      setEditingId(null);
      setEditingValue('');
    } catch (e) {
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? todo : t)));
      setError(e.message || 'Failed to update todo');
    }
  };

  // PUBLIC_INTERFACE
  const deleteTodo = async (todo) => {
    /**
     * Delete a todo by id.
     */
    setError('');
    const prev = todos;
    // Optimistic UI
    setTodos((p) => p.filter((t) => t.id !== todo.id));
    try {
      const { error: err } = await supabase.from('todos').delete().eq('id', todo.id);
      if (err) throw err;
    } catch (e) {
      setTodos(prev);
      setError(e.message || 'Failed to delete todo');
    }
  };

  const onKeyDownNew = (e) => {
    if (e.key === 'Enter') addTodo();
  };

  return (
    <div className="App" style={styles.app}>
      <main style={styles.card} aria-live="polite">
        <div style={styles.header}>
          <div style={styles.titleWrap}>
            <span style={styles.badge}>Ocean Professional</span>
            <div>
              <h1 style={styles.title}>Todo Manager</h1>
              <p style={styles.subtitle}>Add, update, and track your tasks with Supabase</p>
            </div>
          </div>
          <a
            style={styles.link}
            href="https://supabase.com/docs"
            target="_blank"
            rel="noreferrer"
            aria-label="Supabase documentation"
          >
            Supabase Docs ↗
          </a>
        </div>

        <section style={styles.body}>
          {error ? <div role="alert" style={styles.error}>{error}</div> : null}

          <div style={styles.form}>
            <input
              style={styles.input}
              type="text"
              placeholder="What do you want to get done?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={onKeyDownNew}
              aria-label="New todo title"
            />
            <button
              style={styles.addBtn}
              onClick={addTodo}
              disabled={loading || !newTitle.trim()}
              aria-label="Add todo"
              title="Add todo"
            >
              + Add
            </button>
          </div>

          <div style={styles.list}>
            {loading && todos.length === 0 ? (
              <div style={styles.empty}>Loading your todos...</div>
            ) : null}

            {!loading && todos.length === 0 ? (
              <div style={styles.empty}>No todos yet. Add your first task above.</div>
            ) : null}

            {todos.map((todo) => (
              <article key={todo.id} style={styles.item}>
                <input
                  style={styles.checkbox}
                  type="checkbox"
                  checked={!!todo.completed}
                  onChange={() => toggleCompleted(todo)}
                  aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
                />
                {editingId === todo.id ? (
                  <input
                    style={styles.editInput}
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(todo);
                      if (e.key === 'Escape') {
                        setEditingId(null);
                        setEditingValue('');
                      }
                    }}
                    autoFocus
                    aria-label="Edit todo title"
                  />
                ) : (
                  <div style={{ flex: 1 }}>
                    <div style={styles.text}>
                      {todo.completed ? <s>{todo.title}</s> : todo.title}
                    </div>
                    <div style={styles.meta}>
                      {todo.inserted_at ? new Date(todo.inserted_at).toLocaleString() : ''}
                    </div>
                  </div>
                )}
                <div style={styles.btnRow}>
                  {editingId === todo.id ? (
                    <>
                      <button style={styles.btnSecondary} onClick={() => saveEdit(todo)} aria-label="Save">
                        Save
                      </button>
                      <button
                        style={styles.btnSecondary}
                        onClick={() => {
                          setEditingId(null);
                          setEditingValue('');
                        }}
                        aria-label="Cancel edit"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button style={styles.btnSecondary} onClick={() => startEdit(todo)} aria-label="Edit">
                      Edit
                    </button>
                  )}
                  <button style={styles.btnDanger} onClick={() => deleteTodo(todo)} aria-label="Delete">
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div style={styles.footer}>
            <span>{todos.filter((t) => !t.completed).length} open</span>
            <span>
              Using Supabase table: <code>todos</code>
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
