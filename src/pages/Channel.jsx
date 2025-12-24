import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import VideoCard from '../components/VideoCard';

const Channel = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalViews: 0, videoCount: 0, subscribers: 0 });

  useEffect(() => {
    loadChannelData();
  }, [username]);

  const loadChannelData = async () => {
    try {
      setLoading(true);
      // Lấy tất cả video của channel
      const res = await axiosClient.get('/videos');
      const channelVideos = res.data.filter(v => v.uploader === username && v.status === 'READY');
      setVideos(channelVideos);
      
      // Tính toán stats
      const totalViews = channelVideos.reduce((sum, v) => sum + (v.views || 0), 0);
      const subscribers = Math.floor(Math.random() * 10000) + 100; // Giả lập
      
      setStats({
        totalViews,
        videoCount: channelVideos.length,
        subscribers
      });
    } catch (err) {
      console.error('Lỗi tải dữ liệu channel:', err);
    } finally {
      setLoading(false);
    }
  };

  const isOwnChannel = user?.username === username;

  return (
    <div className="w-full bg-gray-900 min-h-screen">
      {/* Channel Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-gray-700 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-6xl font-bold shadow-xl border-4 border-gray-700">
              {username?.[0]?.toUpperCase() || 'A'}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-white mb-2">{username || "Người dùng"}</h1>
              <div className="flex flex-col sm:flex-row gap-6 text-gray-300 mb-4">
                <div>
                  <p className="text-sm text-gray-400">Video</p>
                  <p className="text-2xl font-bold text-white">{stats.videoCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Lượt xem</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.totalViews >= 1000000
                      ? (stats.totalViews / 1000000).toFixed(1) + 'M'
                      : stats.totalViews >= 1000
                      ? (stats.totalViews / 1000).toFixed(1) + 'K'
                      : stats.totalViews}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Người theo dõi</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.subscribers >= 1000000
                      ? (stats.subscribers / 1000000).toFixed(1) + 'M'
                      : stats.subscribers >= 1000
                      ? (stats.subscribers / 1000).toFixed(1) + 'K'
                      : stats.subscribers}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-center md:justify-start">
                {isOwnChannel ? (
                  <button
                    onClick={() => navigate('/upload')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold transition"
                  >
                    ☁️ Tải video mới
                  </button>
                ) : (
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold transition">
                    ✓ Theo dõi
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-white mb-8">Video Của {username || "Người dùng"}</h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-800 aspect-video rounded-xl mb-3"></div>
                <div className="flex gap-3">
                  <div className="w-9 h-9 bg-gray-800 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl font-medium mb-4">Chưa có video nào trên kênh này.</p>
            {isOwnChannel && (
              <button
                onClick={() => navigate('/upload')}
                className="inline-block text-blue-500 hover:underline"
              >
                Hãy tải video đầu tiên
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Channel;
