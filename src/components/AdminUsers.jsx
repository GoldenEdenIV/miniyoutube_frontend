import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', password: '', role: 'USER' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get('/admin/users');
      setUsers(response.data);
      setError('');
    } catch (err) {
      setError('Lỗi tải danh sách users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Create user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      const response = await axiosClient.post('/admin/users', {
        username: formData.username,
        password: formData.password,
        role: formData.role,
      });
      setSuccess(response.data.message);
      setFormData({ username: '', password: '', role: 'USER' });
      setShowCreateForm(false);
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi tạo user');
    }
  };

  // Update user role
  const handleUpdateRole = async (userId, newRole) => {
    try {
      const response = await axiosClient.put(`/admin/users/${userId}/role`, {
        role: newRole,
      });
      setSuccess(response.data.message);
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi cập nhật role');
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa user này?')) return;

    try {
      const response = await axiosClient.delete(`/admin/users/${userId}`);
      setSuccess(response.data.message);
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi xóa user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản Lí User</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          {showCreateForm ? '✕ Hủy' : '+ Thêm User'}
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <form onSubmit={handleCreateUser} className="bg-gray-800 p-6 rounded-lg space-y-4">
          <input
            type="text"
            placeholder="Tên đăng nhập"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white"
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white"
          />
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white"
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold"
          >
            Tạo User
          </button>
        </form>
      )}

      {/* Messages */}
      {error && <div className="bg-red-600 text-white p-4 rounded">{error}</div>}
      {success && <div className="bg-green-600 text-white p-4 rounded">{success}</div>}

      {/* Users Table */}
      {loading ? (
        <div className="text-center py-8">Đang tải...</div>
      ) : (
        <div className="overflow-x-auto bg-gray-800 rounded-lg">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-700 border-b border-gray-600">
              <tr>
                <th className="px-6 py-3">Tên Đăng Nhập</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="px-6 py-3">{user.username}</td>
                  <td className="px-6 py-3">
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                      className="bg-gray-600 px-2 py-1 rounded"
                    >
                      <option value="USER">User</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center py-8 text-gray-400">Không có user nào</div>
          )}
        </div>
      )}
    </div>
  );
}
