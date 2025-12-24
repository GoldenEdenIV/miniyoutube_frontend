import React from 'react';
import { Link } from 'react-router-dom';

const VideoCard = ({ video }) => {
  // Format số view (VD: 1200 -> 1.2K)
  const formatViews = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  // Tính thời gian (VD: 2 giờ trước)
  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Vừa xong';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  };

  return (
    <Link to={`/watch/${video.id}`} className="group cursor-pointer block hover:opacity-80 transition">
      {/* Thumbnail Container */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-800 mb-3 transition-all duration-200 group-hover:rounded-none group-hover:scale-[1.02] shadow-lg">
        {/* Ảnh Placeholder */}
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900 text-gray-600">
          <span className="text-5xl opacity-50">▶</span>
        </div>
        
        {/* Badge thời lượng */}
        <div className="absolute bottom-1.5 right-1.5 bg-black/80 px-1.5 py-0.5 rounded text-xs font-bold text-white tracking-wide">
          {video.duration || '00:00'}
        </div>

        {/* Badge trạng thái */}
        {video.status !== 'READY' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2 mx-auto"></div>
              <p className="text-xs text-gray-300">Đang xử lý...</p>
            </div>
          </div>
        )}

        {/* Overlay khi hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-white/10 transition-colors duration-200"></div>
      </div>

      {/* Meta Info */}
      <div className="flex gap-3 px-1">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm select-none">
            {video.uploader ? video.uploader[0].toUpperCase() : 'A'}
          </div>
        </div>

        {/* Text Info */}
        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="text-white text-base font-semibold line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors" title={video.title}>
            {video.title}
          </h3>
          
          <div className="text-gray-400 text-sm mt-1 flex flex-col">
            <span className="hover:text-white transition-colors truncate">
              {video.uploader || "Ẩn danh"}
            </span>
            <span className="text-xs text-gray-500 mt-0.5">
              {formatViews(video.views)} lượt xem • {timeAgo(video.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
