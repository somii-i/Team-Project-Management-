import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/tasks').then(res => setTasks(res.data)).catch(err => console.error(err));
  }, []);

  const statuses = [
    { key: 'To-Do', label: 'To Do', color: 'gray', icon: '📋' },
    { key: 'In Progress', label: 'In Progress', color: 'blue', icon: '⚡' },
    { key: 'Done', label: 'Done', color: 'green', icon: '✅' }
  ];

  const isOverdue = (task) => new Date(task.dueDate) < new Date() && task.status !== 'Done';

  const statusCounts = statuses.map(s => ({
    ...s,
    count: tasks.filter(t => t.status === s.key).length
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.name}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {statusCounts.map(({ key, label, icon, count, color }) => (
            <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{icon}</span>
                <span className="text-sm font-medium text-gray-500">{label}</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{count}</p>
            </div>
          ))}
        </div>

        {/* Task Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statuses.map(({ key, label, color }) => (
            <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className={`px-5 py-4 border-b border-gray-100 bg-${color}-50 rounded-t-xl`}>
                <h2 className={`font-semibold text-${color}-700`}>{label}</h2>
              </div>
              <div className="p-4 space-y-3 min-h-50">
                {tasks.filter(t => t.status === key).map(task => (
                  <div
                    key={task._id}
                    className={`p-4 rounded-lg border transition hover:shadow-md ${
                      isOverdue(task)
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200 bg-white hover:border-indigo-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm">{task.title}</h3>
                      {isOverdue(task) && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                          OVERDUE
                        </span>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        {task.project?.name || 'No project'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    {task.assignedTo && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-xs text-indigo-700 font-medium">
                            {task.assignedTo.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-xs text-gray-600">{task.assignedTo.name}</span>
                      </div>
                    )}
                  </div>
                ))}
                {tasks.filter(t => t.status === key).length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-8">No tasks yet</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
