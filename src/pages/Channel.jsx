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
  const [stats, setStats] = useState({ totalViews: 0, videoCount: 0, subscriberCount: 0 });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribeLoading, setSubscribeLoading] = useState(false);

  useEffect(() => {
    loadChannelData();
    if (user && !isOwnChannel) {
      checkSubscription();
    }
  }, [username, user]);

  const loadChannelData = async () => {
    try {
      setLoading(true);
      // Use new channel API endpoint
      const res = await axiosClient.get(`/channels/${username}`);
      setVideos(res.data.videos || []);
      setStats({
        totalViews: res.data.totalViews || 0,
        videoCount: res.data.videoCount || 0,
        subscriberCount: res.data.subscriberCount || 0,
      });
    } catch (err) {
      console.error('Lỗi tải dữ liệu channel:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkSubscription = async () => {
    try {
      const res = await axiosClient.get(`/channels/${username}/subscription`);
      setIsSubscribed(res.data.subscribed);
    } catch (err) {
      console.error('Lỗi kiểm tra subscription:', err);
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      alert('Vui lòng đăng nhập để theo dõi kênh');
      navigate('/login');
      return;
    }

    setSubscribeLoading(true);
    try {
      if (isSubscribed) {
        await axiosClient.delete(`/channels/${username}/subscribe`);
        setIsSubscribed(false);
        setStats(prev => ({ ...prev, subscriberCount: prev.subscriberCount - 1 }));
      } else {
        await axiosClient.post(`/channels/${username}/subscribe`);
        setIsSubscribed(true);
        setStats(prev => ({ ...prev, subscriberCount: prev.subscriberCount + 1 }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi thao tác');
    } finally {
      setSubscribeLoading(false);
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
                    {stats.subscriberCount >= 1000000
                      ? (stats.subscriberCount / 1000000).toFixed(1) + 'M'
                      : stats.subscriberCount >= 1000
                      ? (stats.subscriberCount / 1000).toFixed(1) + 'K'
                      : stats.subscriberCount}
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
                  <button
                    onClick={handleSubscribe}
                    disabled={subscribeLoading}
                    className={`px-6 py-2 rounded-full font-bold transition ${
                      isSubscribed
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    } ${subscribeLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {subscribeLoading ? '...' : isSubscribed ? '✓ Đã theo dõi' : '🔔 Theo dõi'}
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
