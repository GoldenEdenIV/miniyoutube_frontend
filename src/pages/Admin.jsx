import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminUsers from '../components/AdminUsers';
import AdminVideos from '../components/AdminVideos';

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');

  // Redirect if not admin
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-600 text-white p-8 rounded-lg text-center">
          <h1 className="text-2xl font-bold mb-4">Truy Cập Bị Từ Chối</h1>
          <p className="mb-4">Chỉ Admin mới có quyền truy cập trang này</p>
          <button
            onClick={() => navigate('/')}
            className="bg-white text-red-600 px-6 py-2 rounded font-semibold hover:bg-gray-100"
          >
            Quay Lại Trang Chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Xin chào, {user.username}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === 'users'
                ? 'border-blue-600 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            👥 Quản Lí User
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === 'videos'
                ? 'border-blue-600 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            🎬 Quản Lí Video
          </button>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'users' && <AdminUsers />}
          {activeTab === 'videos' && <AdminVideos />}
        </div>
      </div>
    </div>
  );
}
