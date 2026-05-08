import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', project: '', assignedTo: '', dueDate: '', status: 'To-Do' });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadTasks();
    api.get('/projects').then(res => setProjects(res.data));
    if (user?.role === 'Admin') api.get('/auth/users').then(res => setUsers(res.data)).catch(() => {});
  }, [user]);

  const loadTasks = () => {
    api.get('/tasks').then(res => setTasks(res.data));
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setForm({
      title: task.title,
      description: task.description || '',
      project: task.project?._id || '',
      assignedTo: task.assignedTo?._id || '',
      dueDate: task.dueDate?.split('T')[0] || '',
      status: task.status
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        const res = await api.put(`/tasks/${editingId}`, form);
        setTasks(tasks.map(t => t._id === editingId ? res.data : t));
        setEditingId(null);
      } else {
        const res = await api.post('/tasks', form);
        setTasks([...tasks, res.data]);
      }
      setShowForm(false);
      setForm({ title: '', description: '', project: '', assignedTo: '', dueDate: '', status: 'To-Do' });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      const res = await api.put(`/tasks/${taskId}`, { status });
      setTasks(tasks.map(t => t._id === taskId ? res.data : t));
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'To-Do': return 'bg-gray-100 text-gray-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Done': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const isOverdue = (task) => new Date(task.dueDate) < new Date() && task.status !== 'Done';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            <p className="text-gray-500 mt-1">Manage and track your tasks</p>
          </div>
          {user?.role === 'Admin' && (
            <button
              onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ title: '', description: '', project: '', assignedTo: '', dueDate: '', status: 'To-Do' }); }}
              className="px-4 py-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition shadow-md hover:shadow-lg"
            >
              {showForm ? 'Cancel' : '+ New Task'}
            </button>
          )}
        </div>

        {showForm && (
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{editingId ? 'Edit Task' : 'Create New Task'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                  <input
                    type="text"
                    placeholder="Enter task title"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    value={form.title}
                    onChange={e => setForm({...form, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                  <select
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
                    value={form.project}
                    onChange={e => setForm({...form, project: e.target.value})}
                    required
                  >
                    <option value="">Select Project</option>
                    {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder="Describe the task"
                  rows="3"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                  <select
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
                    value={form.assignedTo}
                    onChange={e => setForm({...form, assignedTo: e.target.value})}
                  >
                    <option value="">Unassigned</option>
                    {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    value={form.dueDate}
                    onChange={e => setForm({...form, dueDate: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
                    value={form.status}
                    onChange={e => setForm({...form, status: e.target.value})}
                  >
                    <option value="To-Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {loading ? (editingId ? 'Updating...' : 'Creating...') : (editingId ? 'Update Task' : 'Create Task')}
              </button>
            </form>
          </div>
        )}

        <div className="space-y-3">
          {tasks.map(task => (
            <div
              key={task._id}
              className={`bg-white rounded-xl shadow-sm border transition hover:shadow-md ${
                isOverdue(task) ? 'border-red-300' : 'border-gray-100'
              } p-5`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{task.title}</h3>
                    {isOverdue(task) && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                        OVERDUE
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>📁 {task.project?.name || 'No project'}</span>
                    {task.assignedTo && <span>👤 {task.assignedTo.name}</span>}
                    <span>📅 {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="ml-4 flex items-center gap-2">
                  {user?.role === 'Member' && task.assignedTo?._id === user.id ? (
                    <select
                      value={task.status}
                      onChange={e => updateStatus(task._id, e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="To-Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  ) : (
                    <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  )}

                  {user?.role === 'Admin' && (
                    <div className="flex gap-2 ml-2">
                      <button
                        onClick={() => startEdit(task)}
                        className="text-xs text-indigo-600 hover:text-indigo-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400">No tasks yet. Create your first task to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
