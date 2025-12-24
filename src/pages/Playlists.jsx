import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import VideoCard from '../components/VideoCard';

const Playlists = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadPlaylists();
  }, [user, navigate]);

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/playlists/user/${user.username}`);
      setPlaylists(res.data.data || []);
      if (res.data.data && res.data.data.length > 0) {
        setSelectedPlaylist(res.data.data[0]);
      }
    } catch (err) {
      console.error('Lỗi tải playlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return alert('Vui lòng nhập tên playlist!');

    try {
      await axiosClient.post('/playlists', {
        name: newPlaylistName,
        username: user.username
      });
      setNewPlaylistName('');
      setShowCreateForm(false);
      loadPlaylists();
      alert('Tạo playlist thành công!');
    } catch (err) {
      alert('Lỗi tạo playlist');
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa playlist này?')) return;

    try {
      await axiosClient.delete(`/playlists/${playlistId}`);
      loadPlaylists();
      setSelectedPlaylist(null);
      alert('Xóa playlist thành công!');
    } catch (err) {
      alert('Lỗi xóa playlist');
    }
  };

  const handleRemoveFromPlaylist = async (playlistId, videoId) => {
    try {
      await axiosClient.delete(`/playlists/${playlistId}/videos/${videoId}`);
      loadPlaylists();
      if (selectedPlaylist?.id === playlistId) {
        setSelectedPlaylist(
          playlists.find(p => p.id === playlistId) || playlists[0] || null
        );
      }
    } catch (err) {
      alert('Lỗi xóa video khỏi playlist');
    }
  };

  if (!user) return null;

  return (
    <div className="w-full bg-gray-900 min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Playlist của bạn</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Playlist List */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Playlist</h2>
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="text-2xl text-blue-500 hover:text-blue-400"
                >
                  +
                </button>
              </div>

              {/* Tạo playlist mới */}
              {showCreateForm && (
                <div className="mb-4 pb-4 border-b border-gray-700">
                  <input
                    type="text"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    placeholder="Tên playlist..."
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500 mb-2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreatePlaylist}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-bold transition"
                    >
                      Tạo
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateForm(false);
                        setNewPlaylistName('');
                      }}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-bold transition"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}

              {/* Danh sách playlist */}
              <div className="space-y-2">
                {loading ? (
                  <p className="text-gray-400 text-sm">Đang tải...</p>
                ) : playlists.length === 0 ? (
                  <p className="text-gray-400 text-sm">Không có playlist nào. Hãy tạo một!</p>
                ) : (
                  playlists.map((playlist) => (
                    <button
                      key={playlist.id}
                      onClick={() => setSelectedPlaylist(playlist)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center justify-between group ${
                        selectedPlaylist?.id === playlist.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                      }`}
                    >
                      <div>
                        <p className="font-medium text-sm">{playlist.name}</p>
                        <p className={`text-xs ${selectedPlaylist?.id === playlist.id ? 'text-blue-200' : 'text-gray-400'}`}>
                          {playlist.videos?.length || 0} video
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main - Playlist Videos */}
          <div className="lg:col-span-3">
            {selectedPlaylist ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white">{selectedPlaylist.name}</h2>
                    <p className="text-gray-400 mt-1">{selectedPlaylist.videos?.length || 0} video</p>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('Xóa playlist này?')) {
                        handleDeletePlaylist(selectedPlaylist.id);
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition"
                  >
                    🗑️ Xóa Playlist
                  </button>
                </div>

                {selectedPlaylist.videos && selectedPlaylist.videos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selectedPlaylist.videos.map((video) => (
                      <div key={video.id} className="relative">
                        <VideoCard video={video} />
                        <button
                          onClick={() => handleRemoveFromPlaylist(selectedPlaylist.id, video.id)}
                          className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-700 text-white p-2 rounded-full transition opacity-0 hover:opacity-100 z-10"
                          title="Xóa khỏi playlist"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 text-gray-400">
                    <p className="text-lg">Playlist này chưa có video nào.</p>
                    <p className="text-sm mt-2">Hãy thêm video từ trang xem video.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <p className="text-xl font-medium">Chưa có playlist nào.</p>
                <p className="text-sm mt-2">Hãy tạo một playlist mới để bắt đầu!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playlists;
