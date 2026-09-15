import { useCallback, useEffect, useMemo, useState } from 'react';
import * as api from './api.js';
import { color, font } from './theme.js';
import useBreakpoint from './hooks/useBreakpoint.js';
import useToast from './hooks/useToast.js';
import { STATUS_LABEL, iso, today } from './utils.js';
import AuthScreen from './components/AuthScreen.jsx';
import Sidebar from './components/Sidebar.jsx';
import TaskListView from './components/TaskListView.jsx';
import CalendarView from './components/CalendarView.jsx';
import ProfileView from './components/ProfileView.jsx';
import TaskDetail from './components/TaskDetail.jsx';
import TaskComposer from './components/TaskComposer.jsx';
import Toast from './components/Toast.jsx';

export default function App() {
  const narrow = useBreakpoint(880);
  const [toast, say] = useToast();

  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [screen, setScreen] = useState('list');
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [composer, setComposer] = useState(null);
  const [prefs, setPrefs] = useState({ emailReminders: true, weekStartsMonday: false });

  const refresh = useCallback(async () => {
    const data = await api.listTasks();
    setTasks(data.tasks || []);
  }, []);

  useEffect(() => {
    if (!api.getToken()) { setCheckingSession(false); return; }
    api.me()
      .then((data) => setUser(data.user))
      .catch(() => api.logout())
      .finally(() => setCheckingSession(false));
  }, []);

  useEffect(() => {
    if (user) refresh();
  }, [user, refresh]);

  const handleAuth = async (mode, form) => {
    const data = mode === 'signup' ? await api.register(form) : await api.login(form);
    setUser(data.user);
    setScreen('list');
    setFilter('all');
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setTasks([]);
    setSelectedId(null);
  };

  const saveTask = async (draft) => {
    const body = {
      title: draft.title.trim(),
      description: draft.description,
      deadline: draft.deadline || null,
      priority: draft.priority,
      status: draft.status
    };
    if (draft.mode === 'edit') {
      await api.updateTask(draft._id, body);
      say('Task updated');
    } else {
      await api.createTask(body);
      say('Task added');
    }
    setComposer(null);
    refresh();
  };

  const setStatus = async (task, status) => {
    await api.updateTask(task._id, { status });
    refresh();
  };

  const toggleDone = (task) => setStatus(task, task.status === 'completed' ? 'pending' : 'completed');

  const advance = async (task) => {
    const next = task.status === 'pending' ? 'in-progress' : task.status === 'in-progress' ? 'completed' : 'pending';
    await setStatus(task, next);
    say('Moved to ' + STATUS_LABEL[next].toLowerCase());
  };

  const removeTask = async (task) => {
    await api.deleteTask(task._id);
    setSelectedId(null);
    say('Task deleted');
    refresh();
  };

  const selected = useMemo(() => tasks.find((t) => t._id === selectedId) || null, [tasks, selectedId]);

  if (checkingSession) return null;
  if (!user) return <AuthScreen narrow={narrow} onAuth={handleAuth} />;

  return (
    <div style={{ fontFamily: font.sans, color: color.ink, background: color.bg, minHeight: '100vh', WebkitFontSmoothing: 'antialiased' }}>
      <div style={{ display: 'flex', flexDirection: narrow ? 'column' : 'row', minHeight: '100vh', alignItems: 'stretch' }}>
        <Sidebar
          narrow={narrow}
          user={user}
          screen={screen}
          tasks={tasks}
          onNavigate={(s) => { setScreen(s); setFilter('all'); }}
        />

        <main style={{ flex: 1, minWidth: 0, padding: narrow ? '32px 22px 80px' : '44px 44px 96px', maxWidth: 1120 }}>
          {screen === 'list' && (
            <TaskListView
              user={user}
              tasks={tasks}
              filter={filter}
              onFilter={setFilter}
              onOpen={(t) => setSelectedId(t._id)}
              onToggle={toggleDone}
              onCreate={() => setComposer({ mode: 'create', title: '', description: '', deadline: iso(today()), priority: 'medium', status: 'pending' })}
            />
          )}
          {screen === 'calendar' && (
            <CalendarView tasks={tasks} mondayFirst={prefs.weekStartsMonday} onOpen={(t) => setSelectedId(t._id)} />
          )}
          {screen === 'profile' && (
            <ProfileView user={user} tasks={tasks} prefs={prefs} onPrefs={setPrefs} onLogout={handleLogout} />
          )}
        </main>
      </div>

      {selected && (
        <TaskDetail
          task={selected}
          narrow={narrow}
          onClose={() => setSelectedId(null)}
          onAdvance={() => advance(selected)}
          onEdit={() => setComposer({ mode: 'edit', ...selected, deadline: selected.deadline ? String(selected.deadline).slice(0, 10) : '' })}
          onDelete={() => removeTask(selected)}
        />
      )}

      {composer && (
        <TaskComposer draft={composer} onChange={setComposer} onCancel={() => setComposer(null)} onSave={saveTask} />
      )}

      <Toast message={toast} />
    </div>
  );
}
