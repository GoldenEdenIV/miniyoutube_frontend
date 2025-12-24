import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

const PlaylistModal = ({ isOpen, onClose, videoId }) => {
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && user) {
      loadPlaylists();
    }
  }, [isOpen, user]);

  const loadPlaylists = async () => {
    try {
      const res = await axiosClient.get(`/playlists/user/${user.username}`);
      setPlaylists(res.data.data || []);
    } catch (err) {
      console.error('Lỗi tải playlist:', err);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return alert('Vui lòng nhập tên playlist!');
    
    setLoading(true);
    try {
      await axiosClient.post('/playlists', {
        name: newPlaylistName,
        username: user.username
      });
      setNewPlaylistName('');
      loadPlaylists();
    } catch (err) {
      alert('Lỗi tạo playlist');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToPlaylist = async (playlist) => {
    try {
      const playlistId = playlist.id;
      if (playlist.videoIds.includes(videoId)) {
        await axiosClient.delete(`/playlists/${playlistId}/videos/${videoId}`);
        alert('Xóa khỏi playlist thành công!');
      } else {
        await axiosClient.post(`/playlists/${playlistId}/videos`, { videoId });
        alert('Thêm vào playlist thành công!');
      }
      alert('Thêm vào playlist thành công!');
      loadPlaylists();
    } catch (err) {
      alert('Lỗi thêm video vào playlist');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Lưu vào Playlist</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {/* Tạo playlist mới */}
          <div className="mb-4 pb-4 border-b border-gray-700">
            <p className="text-sm text-gray-400 mb-2">Tạo playlist mới</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Tên playlist..."
                className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500"
              />
              <button
                onClick={handleCreatePlaylist}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition"
              >
                {loading ? '...' : 'Tạo'}
              </button>
            </div>
          </div>

          {/* Danh sách playlist */}
          <div className="space-y-2">
            {playlists.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">Không có playlist nào. Hãy tạo một playlist mới!</p>
            ) : (
              playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  onClick={() => handleAddToPlaylist(playlist.id)}
                  className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition flex items-center justify-between group"
                >
                  <div>
                    <p className="text-white font-medium">{playlist.name}</p>
                    <p className="text-xs text-gray-400">{playlist.videos?.length || 0} video</p>
                  </div>
                  <span className="text-gray-400 group-hover:text-white">{playlist.videoIds.includes(videoId) ? '−' : '+'}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistModal;
