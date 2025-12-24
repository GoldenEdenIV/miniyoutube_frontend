import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import VideoCard from '../components/VideoCard';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('READY'); // 'READY' hoặc 'ALL'

  useEffect(() => {
    fetchVideos();
  }, [filterStatus]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/videos');
      // Lọc video
      let filtered = res.data;
      if (filterStatus === 'READY') {
        filtered = filtered.filter(v => v.status === 'READY');
      }
      setVideos(filtered);
    } catch (err) {
      console.error("Lỗi tải video:", err);
    } finally {
      setLoading(false);
    }
  };

  // Tìm kiếm video
  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (video.uploader && video.uploader.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-full bg-gray-900 min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      {/* Header với Search */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-bold mb-4 text-white tracking-tight">Xem Video</h1>
        
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Tìm kiếm video, kênh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-full px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('READY')}
              className={`px-4 py-3 rounded-full font-medium transition ${
                filterStatus === 'READY'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Đã sẵn sàng
            </button>
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-4 py-3 rounded-full font-medium transition ${
                filterStatus === 'ALL'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Tất cả
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-white tracking-tight">
          {searchTerm ? `Kết quả: ${searchTerm}` : 'Video đề xuất'}
        </h2>

        {/* LƯỚI VIDEO */}
        <div className="pb-10">
          {loading ? (
            // Hiệu ứng Skeleton Loading
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
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
          ) : filteredVideos.length === 0 ? (
            // Không có video
            <div className="text-center py-20 text-gray-500">
              <p className="text-xl font-medium">Không tìm thấy video.</p>
              {searchTerm && (
                <>
                  <p className="text-sm mt-2">Hãy thử tìm kiếm với từ khác.</p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="inline-block mt-4 text-blue-500 hover:underline"
                  >
                    Xem tất cả video
                  </button>
                </>
              )}
              {!searchTerm && (
                <>
                  <p className="text-sm mt-2">Hãy là người đầu tiên tải lên!</p>
                  <Link to="/upload" className="inline-block mt-4 text-blue-500 hover:underline">
                    Tải video ngay
                  </Link>
                </>
              )}
            </div>
          ) : (
            // Danh sách Video
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
              {filteredVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;