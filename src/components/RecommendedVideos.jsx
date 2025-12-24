import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { formatViews, timeAgo } from '../utils/helpers';

const RecommendedVideos = ({ currentVideoId, maxItems = 5 }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, [currentVideoId]);

  const loadRecommendations = async () => {
    try {
      const res = await axiosClient.get('/videos');
      const filtered = res.data
        .filter(v => v.id !== currentVideoId && v.status === 'READY')
        .sort((a, b) => b.views - a.views)
        .slice(0, maxItems);
      setVideos(filtered);
    } catch (err) {
      console.error('Lỗi tải recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse flex gap-3">
            <div className="w-40 h-24 bg-gray-800 rounded-lg flex-shrink-0"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-800 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {videos.map((video) => (
        <Link 
          key={video.id} 
          to={`/watch/${video.id}`}
          className="flex gap-3 group hover:opacity-80 transition"
        >
          {/* Thumbnail */}
          <div className="w-40 h-24 bg-gray-800 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden relative">
            <span className="text-2xl opacity-50">▶</span>
            <span className="absolute bottom-1 right-1 bg-black/80 text-xs font-bold text-white px-1 rounded">
              {video.duration || '00:00'}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-blue-400 transition">
              {video.title}
            </h4>
            <p className="text-xs text-gray-400 mt-1 truncate">
              {video.uploader || 'Ẩn danh'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {formatViews(video.views)} lượt xem • {timeAgo(video.createdAt)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RecommendedVideos;
