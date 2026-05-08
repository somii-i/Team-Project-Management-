import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', status: 'Active' });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    api.get('/projects').then(res => setProjects(res.data)).catch(err => console.error(err));
  };

  const startEdit = (project) => {
    setEditingId(project._id);
    setForm({ name: project.name, description: project.description || '', status: project.status || 'Active' });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        const res = await api.put(`/projects/${editingId}`, form);
        setProjects(projects.map(p => p._id === editingId ? res.data : p));
        setEditingId(null);
      } else {
        const res = await api.post('/projects', form);
        setProjects([...projects, res.data]);
      }
      setShowForm(false);
      setForm({ name: '', description: '', status: 'Active' });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project and all its tasks?')) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Archived': return 'bg-gray-100 text-gray-700';
      case 'Completed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-500 mt-1">Manage your projects</p>
          </div>
          {user?.role === 'Admin' && (
            <button
              onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', description: '', status: 'Active' }); }}
              className="px-4 py-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition shadow-md hover:shadow-lg"
            >
              {showForm ? 'Cancel' : '+ New Project'}
            </button>
          )}
        </div>

        {showForm && (
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{editingId ? 'Edit Project' : 'Create New Project'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <input
                  type="text"
                  placeholder="Enter project name"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder="Describe the project"
                  rows="3"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                />
              </div>
              {user?.role === 'Admin' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white"
                    value={form.status}
                    onChange={e => setForm({...form, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="Archived">Archived</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {loading ? (editingId ? 'Updating...' : 'Creating...') : (editingId ? 'Update Project' : 'Create Project')}
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <div key={project._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{project.name}</h3>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status || 'Active'}
                </span>
              </div>
              {project.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
              )}
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Created by <span className="font-medium text-gray-700">{project.createdBy?.name}</span>
                </p>
              </div>
              {user?.role === 'Admin' && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => startEdit(project)}
                    className="text-xs text-indigo-600 hover:text-indigo-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {projects.length === 0 && !showForm && (
          <div className="text-center py-16">
            <p className="text-gray-400">No projects yet. Create your first project to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
