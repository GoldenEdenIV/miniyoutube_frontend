// API Service layer for Mini YouTube
// All APIs connect to backend which uses Azure services
import axiosClient from './axiosClient';

// ========== VIDEO SERVICE ==========
export const VideoService = {
  // Get all videos (Video Service)
  getAllVideos: () => axiosClient.get('/videos'),

  // Get specific video details (Video Service)
  getVideo: (id) => axiosClient.get(`/videos/${id}`),

  // Request upload URL from Azure Blob Storage (Streaming Service)
  requestUploadUrl: (title, duration, description = '') =>
    axiosClient.post('/videos/upload-request', {
      title,
      duration,
      description,
    }),

  // Increase video view count (Video Service)
  increaseView: (id) => axiosClient.put(`/videos/${id}/view`),

  // Delete video (requires ADMIN role) (Video Service)
  deleteVideo: (id) => axiosClient.delete(`/videos/${id}`),
};

// ========== COMMENT SERVICE ==========
export const CommentService = {
  // Add comment to video (Comment Service)
  addComment: (videoId, content) =>
    axiosClient.post(`/videos/${videoId}/comments`, { content }),

  // Get all comments for a video (Comment Service)
  getComments: (videoId) => axiosClient.get(`/videos/${videoId}/comments`),

  // Delete comment (Comment Service)
  deleteComment: (commentId) =>
    axiosClient.delete(`/comments/${commentId}`),
};

// ========== LIKE SERVICE ==========
export const LikeService = {
  // Toggle like/dislike status (Video Service)
  toggleLike: (videoId, isLike) =>
    axiosClient.post(`/videos/${videoId}/likes`, { isLike }),

  // Get likes for video (Video Service)
  getLikes: (videoId) => axiosClient.get(`/videos/${videoId}/likes`),
};

// ========== AUTH SERVICE (User Service) ==========
export const AuthService = {
  // Register new user (User Service)
  register: (username, password) =>
    axiosClient.post('/auth/register', { username, password }),

  // Login user (User Service)
  login: (username, password) =>
    axiosClient.post('/auth/login', { username, password }),
};

// ========== PLAYLIST SERVICE ==========
// Now using backend Playlist Service (Azure PostgreSQL persistence)
export const PlaylistService = {
  // Get user's playlists (Playlist Service)
  getUserPlaylists: (username) =>
    axiosClient.get(`/playlists/user/${username}`),

  // Get specific playlist details (Playlist Service)
  getPlaylist: (playlistId) =>
    axiosClient.get(`/playlists/${playlistId}`),

  // Create new playlist (requires JWT auth) (Playlist Service)
  createPlaylist: (name) =>
    axiosClient.post('/playlists', { name }),

  // Delete playlist (requires JWT auth and ownership) (Playlist Service)
  deletePlaylist: (playlistId) =>
    axiosClient.delete(`/playlists/${playlistId}`),

  // Update playlist name (requires JWT auth and ownership) (Playlist Service)
  updatePlaylist: (playlistId, name) =>
    axiosClient.put(`/playlists/${playlistId}`, { name }),

  // Add video to playlist (requires JWT auth and ownership) (Playlist Service)
  addVideoToPlaylist: (playlistId, videoId) =>
    axiosClient.post(`/playlists/${playlistId}/videos`, { videoId }),

  // Remove video from playlist (requires JWT auth and ownership) (Playlist Service)
  removeVideoFromPlaylist: (playlistId, videoId) =>
    axiosClient.delete(`/playlists/${playlistId}/videos/${videoId}`),
};

