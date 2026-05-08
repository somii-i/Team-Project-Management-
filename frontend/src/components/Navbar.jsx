import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/projects', label: 'Projects', icon: '📁' },
    { path: '/tasks', label: 'Tasks', icon: '✅' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            TaskFlow
          </Link>

          {user && (
            <div className="flex items-center gap-6">
              {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map(({ path, label, icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                  >
                    <span>{icon}</span>
                    {label}
                  </Link>
                ))}
              </div>

              {/* User Menu */}
              <div className="relative">
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                  <div className="flex items-center gap-2 hidden sm:block">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${user.role === 'Admin' ? 'bg-purple-500' : 'bg-blue-500'}`} />
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {user.role}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                  </div>

                  {/* Mobile menu button */}
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="w-5 h-5 flex flex-col justify-center gap-1">
                      <span className={`block h-0.5 bg-gray-600 transition-transform ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                      <span className={`block h-0.5 bg-gray-600 transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`} />
                      <span className={`block h-0.5 bg-gray-600 transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                    </div>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="hidden md:flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && user && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1 fixed top-16 left-0 right-0 bg-white/95 backdrop-blur-md z-40">
            {navLinks.map(({ path, label, icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition"
              >
                <span className="text-base">{icon}</span>
                {label}
              </Link>
            ))}
            <button
              onClick={() => { setIsMenuOpen(false); handleLogout(); }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full text-left transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
