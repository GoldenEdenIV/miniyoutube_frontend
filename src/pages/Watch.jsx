import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import PlaylistModal from '../components/PlaylistModal';
import RecommendedVideos from '../components/RecommendedVideos';

const Watch = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [comment, setComment] = useState('');
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [userLikeStatus, setUserLikeStatus] = useState(null);
  const [isVideoSaved, setIsVideoSaved] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribeLoading, setSubscribeLoading] = useState(false);

  const loadData = () => {
    axiosClient.get(`/videos/${id}`)
      .then(res => {
        setVideo(res.data);
        // Kiểm tra user đã like hay chưa
        if (user && res.data.likes) {
          const userLike = res.data.likes.find(l => l.username === user.username);
          setUserLikeStatus(userLike ? userLike.isLike : null);
        }
        // Check subscription status
        if (user && res.data.uploader && res.data.uploader !== user.username) {
          checkSubscription(res.data.uploader);
        }
      })
      .catch(err => console.error(err));
  };

  const checkSubscription = async (channelUsername) => {
    try {
      const res = await axiosClient.get(`/channels/${channelUsername}/subscription`);
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

    if (!video?.uploader) return;

    setSubscribeLoading(true);
    try {
      if (isSubscribed) {
        await axiosClient.delete(`/channels/${video.uploader}/subscribe`);
        setIsSubscribed(false);
      } else {
        await axiosClient.post(`/channels/${video.uploader}/subscribe`);
        setIsSubscribed(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi thao tác');
    } finally {
      setSubscribeLoading(false);
    }
  };

  useEffect(() => { 
    loadData(); 
    // Tăng view sau 3s (Tránh spam F5)
    const timer = setTimeout(() => {
        axiosClient.put(`/videos/${id}/view`).catch(() => {});
    }, 3000);
    return () => clearTimeout(timer);
  }, [id]);

  const handlePostComment = async () => {
    if (!user) return alert('Vui lòng đăng nhập!');
    if (!comment.trim()) return;
    try {
      await axiosClient.post(`/videos/${id}/comments`, { content: comment });
      setComment(''); loadData();
    } catch (error) { alert('Lỗi bình luận'); }
  };

  const handleLike = async (isLike) => {
    if (!user) return alert('Vui lòng đăng nhập!');
    try { 
      await axiosClient.post(`/videos/${id}/likes`, { isLike }); 
      setUserLikeStatus(isLike);
      loadData(); 
    } catch (error) { 
      alert('Lỗi Like'); 
    }
  };

  const handleDeleteVideo = async () => {
    if (!window.confirm('Xóa video này?')) return;
    try {
      await axiosClient.delete(`/videos/${id}`);
      alert('Xóa video thành công');
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi xóa video');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Xóa comment này?')) return;
    try {
      await axiosClient.delete(`/videos/comments/${commentId}`);
      loadData(); // Reload to update comments
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi xóa comment');
    }
  };

  if (!video) return <div className="text-center mt-20 text-gray-500">Đang tải video...</div>;

  const likeCount = video.likes?.filter(l => l.isLike).length || 0;
  const dislikeCount = video.likes?.filter(l => !l.isLike).length || 0;
  const uploaderName = video.uploader || "Người dùng ẩn danh";

  const videoSource = {
    type: "video",
    sources: [{ src: video.streamingUrl, type: "video/mp4" }]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* CỘT TRÁI */}
      <div className="lg:col-span-2 space-y-4">
        
        {/* --- KHUNG VIDEO (Đã Fix lỗi nhảy layout) --- */}
        {/* aspect-video giúp giữ chỗ ngay cả khi Plyr chưa load */}
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative z-0">
          {video.status === 'READY' ? (
            <div className="h-full w-full">
                <Plyr 
                    source={videoSource}
                    options={{
                        autoplay: true,
                        controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
                        seekTime: 5,
                    }}
                    style={{ height: '100%', width: '100%' }} // Ép Plyr full khung
                />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mb-4"></div>
              <p>Video đang xử lý...</p>
            </div>
          )}
        </div>
        
        {/* Info */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white mb-2">{video.title}</h1>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center font-bold text-white uppercase select-none">
                 {uploaderName[0]}
               </div>
               <div>
                 <h4 className="font-bold text-white">{uploaderName}</h4>
                 <p className="text-xs text-gray-400">Người sáng tạo</p>
               </div>
               {/* Subscribe button */}
               {user && video.uploader !== user.username && (
                 <button
                   onClick={handleSubscribe}
                   disabled={subscribeLoading}
                   className={`ml-2 px-4 py-1.5 rounded-full text-sm font-bold transition ${
                     isSubscribed
                       ? 'bg-gray-700 hover:bg-gray-600 text-white'
                       : 'bg-red-600 hover:bg-red-700 text-white'
                   } ${subscribeLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                 >
                   {subscribeLoading ? '...' : isSubscribed ? '✓ Đã theo dõi' : 'Theo dõi'}
                 </button>
               )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-gray-800 rounded-full overflow-hidden">
                <button 
                  onClick={() => handleLike(true)} 
                  className={`px-4 py-2 flex items-center gap-2 border-r border-gray-700 transition ${userLikeStatus === true ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`}
                >
                  👍 <span className="text-sm font-bold">{likeCount}</span>
                </button>
                <button 
                  onClick={() => handleLike(false)} 
                  className={`px-4 py-2 flex items-center gap-2 transition ${userLikeStatus === false ? 'bg-red-600 text-white' : 'hover:bg-gray-700'}`}
                >
                  👎 <span className="text-sm font-bold">{dislikeCount}</span>
                </button>
              </div>
              
              {/* Nút Save to Playlist */}
              <button 
                onClick={() => {
                  if (!user) return alert('Vui lòng đăng nhập!');
                  setShowPlaylistModal(true);
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full font-bold text-sm transition flex items-center gap-2"
              >
                📌 Lưu
              </button>
              
              {/* Delete video button - show for owner or admin */}
              {user && (user.role === 'ADMIN' || video.uploader === user.username) && (
                <button onClick={handleDeleteVideo} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-bold text-sm transition">🗑️ Xóa</button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl text-sm text-white">
          <p><span className="font-bold">{video.views} lượt xem</span> • {new Date(video.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* CỘT PHẢI: Comment & Recommendations */}
      <div className="lg:col-span-1 space-y-6">
        {/* Comments Section */}
        <div className="border border-gray-700 rounded-xl p-4 bg-gray-800/50 flex flex-col h-[500px]">
          <h3 className="font-bold text-lg mb-4">{video.comments?.length || 0} Bình luận</h3>
          
          <div className="flex gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center font-bold text-white uppercase select-none">
              {user?.username?.[0] || '?'}
            </div>
            <div className="flex-1">
              <input 
                value={comment} onChange={e => setComment(e.target.value)} placeholder="Viết bình luận..." 
                className="w-full bg-transparent border-b border-gray-600 focus:border-white outline-none py-1 text-sm text-white transition"
              />
              <div className="flex justify-end mt-2">
                <button onClick={handlePostComment} className="px-4 py-1.5 rounded-full bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 transition">Gửi</button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
            {video.comments?.map((c, i) => (
              <div key={i} className="flex gap-3">
                <Link 
                  to={`/channel/${c.username}`}
                  className="w-8 h-8 rounded-full bg-purple-600 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white uppercase select-none hover:ring-2 ring-purple-400 transition"
                >
                  {c.username[0]}
                </Link>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link to={`/channel/${c.username}`} className="text-xs font-bold text-white hover:text-blue-400 transition">
                        {c.username}
                      </Link>
                      <span className="text-[10px] text-gray-400">Mới đây</span>
                    </div>
                    {/* Delete button for comment owner or admin */}
                    {user && (user.role === 'ADMIN' || c.username === user.username) && (
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        className="text-red-500 hover:text-red-400 text-xs"
                        title="Xóa comment"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-300 mt-0.5">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="border border-gray-700 rounded-xl p-4 bg-gray-800/50">
          <h3 className="font-bold text-lg mb-4">🎬 Video đề xuất</h3>
          <RecommendedVideos currentVideoId={id} maxItems={5} />
        </div>
      </div>
    

    {/* Playlist Modal */}
    <PlaylistModal 
      isOpen={showPlaylistModal} 
      onClose={() => setShowPlaylistModal(false)} 
      videoId={id} 
    />
    </div>
  );
};

export default Watch;