import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-gray-800 border-b border-gray-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white font-bold">
              ▶
            </div>
            <span className="text-xl font-bold tracking-tight text-white hidden sm:inline">
              MiniYouTube
            </span>
          </Link>

          {/* Navigation Links (Center) */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-300 hover:text-white transition text-sm font-medium">
              Trang chủ
            </Link>
            {user && (
              <>
                <Link to={`/channel/${user.username}`} className="text-gray-300 hover:text-white transition text-sm font-medium">
                  Kênh của bạn
                </Link>
                <Link to="/playlists" className="text-gray-300 hover:text-white transition text-sm font-medium">
                  Playlist
                </Link>
              </>
            )}
          </div>

          {/* USER ACTIONS (Bên phải) */}
          <div className="flex items-center gap-4">
            {user ? (
              // Nếu ĐÃ Đăng nhập
              <>
                <Link 
                  to="/upload" 
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full transition text-sm font-medium"
                >
                  <span className="hidden sm:inline">☁️</span>
                  <span className="hidden sm:inline">Upload</span>
                  <span className="sm:hidden">☁️</span>
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 hover:bg-gray-700 px-3 py-2 rounded-full transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      {user.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden md:inline text-sm text-gray-300">{user.username}</span>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-700 border border-gray-600 rounded-lg shadow-lg overflow-hidden z-50">
                      <Link 
                        to={`/channel/${user.username}`}
                        className="block px-4 py-2 text-gray-300 hover:bg-gray-600 hover:text-white transition"
                        onClick={() => setShowUserMenu(false)}
                      >
                        👤 Kênh của bạn
                      </Link>
                      <Link 
                        to="/playlists"
                        className="block px-4 py-2 text-gray-300 hover:bg-gray-600 hover:text-white transition"
                        onClick={() => setShowUserMenu(false)}
                      >
                        📌 Playlist
                      </Link>
                      {user.role === 'ADMIN' && (
                        <>
                          <div className="border-t border-gray-600"></div>
                          <Link 
                            to="/admin"
                            className="block px-4 py-2 text-yellow-400 hover:bg-gray-600 transition font-semibold"
                            onClick={() => setShowUserMenu(false)}
                          >
                            ⚙️ Admin Dashboard
                          </Link>
                        </>
                      )}
                      <div className="border-t border-gray-600"></div>
                      <button 
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-600 hover:text-white transition"
                      >
                        🚪 Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Nếu CHƯA Đăng nhập
              <Link 
                to="/login" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition text-sm flex items-center gap-2"
              >
                👤 <span className="hidden sm:inline">Đăng nhập</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;