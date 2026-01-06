import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

export default function AdminVideos() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState({ title: '', status: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch videos
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get('/admin/videos');
      setVideos(response.data);
      setError('');
    } catch (err) {
      setError('Lỗi tải danh sách videos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get video details
  const handleViewDetails = async (videoId) => {
    try {
      const response = await axiosClient.get(`/admin/videos/${videoId}`);
      setSelectedVideo(response.data);
      setShowDetails(true);
      setError('');
    } catch (err) {
      setError('Lỗi tải chi tiết video');
      console.error(err);
    }
  };

  // Update video
  const handleUpdateVideo = async (e) => {
    e.preventDefault();
    if (!editData.title && !editData.status) {
      setError('Vui lòng nhập thông tin cập nhật');
      return;
    }

    try {
      const response = await axiosClient.put(`/admin/videos/${selectedVideo.id}`, {
        title: editData.title || selectedVideo.title,
        status: editData.status || selectedVideo.status,
      });
      setSuccess(response.data.message);
      setShowEditForm(false);
      setEditData({ title: '', status: '' });
      fetchVideos();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi cập nhật video');
    }
  };

  // Delete video
  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa video này?')) return;

    try {
      const response = await axiosClient.delete(`/admin/videos/${videoId}`);
      setSuccess(response.data.message);
      setShowDetails(false);
      fetchVideos();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi xóa video');
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa comment này?')) return;

    try {
      const response = await axiosClient.delete(`/admin/comments/${commentId}`);
      setSuccess(response.data.message);
      handleViewDetails(selectedVideo.id); // Refresh details
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi xóa comment');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Quản Lí Video</h2>

      {/* Messages */}
      {error && <div className="bg-red-600 text-white p-4 rounded">{error}</div>}
      {success && <div className="bg-green-600 text-white p-4 rounded">{success}</div>}

      {/* Videos List */}
      {!showDetails ? (
        <>
          {loading ? (
            <div className="text-center py-8">Đang tải...</div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {videos.length === 0 ? (
                <div className="text-center py-8 text-gray-400">Không có video nào</div>
              ) : (
                videos.map((video) => (
                  <div key={video.id} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-750 transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{video.title}</h3>
                        <div className="grid grid-cols-4 gap-4 text-sm text-gray-400 mb-3">
                          <div>
                            <span className="text-gray-500">Người Upload:</span> {video.uploader}
                          </div>
                          <div>
                            <span className="text-gray-500">Trạng Thái:</span> {video.status}
                          </div>
                          <div>
                            <span className="text-gray-500">Lượt Xem:</span> {video.views}
                          </div>
                          <div>
                            <span className="text-gray-500">Thời Lượng:</span> {video.duration}
                          </div>
                        </div>
                        <div className="flex gap-2 text-sm text-gray-400">
                          <span>👍 {video.likes}</span>
                          <span>👎 {video.dislikes}</span>
                          <span>💬 {video.comments} comments</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleViewDetails(video.id)}
                          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
                        >
                          Chi Tiết
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(video.id)}
                          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      ) : (
        // Video Details View
        <div className="space-y-6">
          <button
            onClick={() => setShowDetails(false)}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
          >
            ← Quay Lại
          </button>

          <div className="bg-gray-800 p-6 rounded-lg space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">{selectedVideo.title}</h2>
                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                  <div>
                    <span className="text-gray-500">ID:</span> {selectedVideo.id}
                  </div>
                  <div>
                    <span className="text-gray-500">Người Upload:</span> {selectedVideo.uploader}
                  </div>
                  <div>
                    <span className="text-gray-500">Trạng Thái:</span> {selectedVideo.status}
                  </div>
                  <div>
                    <span className="text-gray-500">Thời Lượng:</span> {selectedVideo.duration}
                  </div>
                  <div>
                    <span className="text-gray-500">Lượt Xem:</span> {selectedVideo.views}
                  </div>
                  <div>
                    <span className="text-gray-500">Ngày Tạo:</span>{' '}
                    {new Date(selectedVideo.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowEditForm(!showEditForm)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                >
                  {showEditForm ? '✕ Hủy' : '✎ Sửa'}
                </button>
                <button
                  onClick={() => handleDeleteVideo(selectedVideo.id)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                >
                  Xóa
                </button>
              </div>
            </div>

            {/* Edit Form */}
            {showEditForm && (
              <form onSubmit={handleUpdateVideo} className="bg-gray-700 p-4 rounded space-y-3">
                <input
                  type="text"
                  placeholder="Tiêu đề (bỏ trống để giữ nguyên)"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full bg-gray-600 border border-gray-500 px-3 py-2 rounded text-white text-sm"
                />
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                  className="w-full bg-gray-600 border border-gray-500 px-3 py-2 rounded text-white text-sm"
                >
                  <option value="">Giữ trạng thái hiện tại</option>
                  <option value="PENDING">PENDING</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="READY">READY</option>
                  <option value="FAILED">FAILED</option>
                </select>
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 px-3 py-2 rounded font-semibold text-sm"
                >
                  Cập Nhật
                </button>
              </form>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-700 p-4 rounded text-center">
                <div className="text-2xl font-bold">👍 {selectedVideo.stats.likes}</div>
                <div className="text-sm text-gray-400">Like</div>
              </div>
              <div className="bg-gray-700 p-4 rounded text-center">
                <div className="text-2xl font-bold">👎 {selectedVideo.stats.dislikes}</div>
                <div className="text-sm text-gray-400">Dislike</div>
              </div>
              <div className="bg-gray-700 p-4 rounded text-center">
                <div className="text-2xl font-bold">💬 {selectedVideo.stats.comments}</div>
                <div className="text-sm text-gray-400">Comment</div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-gray-800 p-6 rounded-lg space-y-4">
            <h3 className="text-xl font-bold">Comments ({selectedVideo.comments.length})</h3>
            {selectedVideo.comments.length === 0 ? (
              <div className="text-gray-400 text-center py-4">Không có comment nào</div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedVideo.comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-700 p-3 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-semibold">{comment.username}</span>
                        <span className="text-xs text-gray-400 ml-2">
                          {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
                      >
                        Xóa
                      </button>
                    </div>
                    <p className="text-gray-200 text-sm">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
