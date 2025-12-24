// Common utility functions cho frontend Mini YouTube

// Format views count (1000 -> 1K, 1000000 -> 1M)
export const formatViews = (num) => {
  if (!num) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

// Calculate time ago (e.g., "2 hours ago", "3 days ago")
export const timeAgo = (dateString) => {
  if (!dateString) return 'Mới đây';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Vừa xong';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ngày trước`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} tháng trước`;
  const years = Math.floor(months / 12);
  return `${years} năm trước`;
};

// Extract video duration from file
export const getVideoDuration = (file) => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      const duration = video.duration;
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      resolve(formatted);
    };
    video.onerror = () => resolve('00:00');
    video.src = URL.createObjectURL(file);
  });
};

// Format duration from seconds to MM:SS or HH:MM:SS
export const formatDuration = (seconds) => {
  if (!seconds) return '00:00';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

// Truncate text with ellipsis
export const truncateText = (text, length = 100) => {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + '...';
};

// Get consistent avatar background gradient
export const getAvatarGradient = (username) => {
  const gradients = [
    'from-blue-500 to-purple-600',
    'from-green-500 to-blue-600',
    'from-pink-500 to-red-600',
    'from-yellow-500 to-orange-600',
    'from-indigo-500 to-purple-600',
    'from-cyan-500 to-blue-600',
  ];

  let hash = 0;
  const str = username || 'user';
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
};

// Validate video file
export const validateVideoFile = (file) => {
  const validMimes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'];
  const maxSize = 5 * 1024 * 1024 * 1024; // 5GB

  if (!validMimes.includes(file.type)) {
    return {
      valid: false,
      error: 'Định dạng video không hỗ trợ. Vui lòng sử dụng MP4, MOV, AVI.',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File quá lớn. Kích thước tối đa là 5GB.',
    };
  }

  return { valid: true };
};

// Parse error response
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.statusText) {
    return error.response.statusText;
  }
  return error.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
};
