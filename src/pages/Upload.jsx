import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import axiosClient from '../api/axiosClient';
import { getVideoDuration, validateVideoFile, getErrorMessage } from '../utils/helpers';

const Upload = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateVideoFile(file);
      if (!validation.valid) {
        setError(validation.error);
        setSelectedFile(null);
        return;
      }
      setError('');
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return setError('Vui lòng chọn file!');
    if (!title.trim()) return setError('Vui lòng nhập tiêu đề!');

    setUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      // 1. Lấy độ dài video từ file
      const duration = await getVideoDuration(selectedFile);
      
      // 2. Gửi request tới backend để lấy SAS URL từ Azure Blob Storage
      const uploadRes = await axiosClient.post('/videos/upload-request', { 
        title, 
        duration,
        description: description || ''
      });

      if (!uploadRes.data.uploadUrl) {
        throw new Error('Không nhận được URL upload từ server');
      }

      // 3. Upload file trực tiếp lên Azure Storage Blob bằng SAS URL
      await axios.put(uploadRes.data.uploadUrl, selectedFile, { 
        headers: { 
          'x-ms-blob-type': 'BlockBlob', 
          'Content-Type': selectedFile.type 
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      alert('Upload thành công! Video sẽ sớm được xử lý.');
      navigate(`/channel/${user.username}`);
    } catch(e) { 
      console.error('Upload error:', e);
      setError(getErrorMessage(e));
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[90vh] bg-gray-900 px-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-700">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 text-white">Tải video lên</h2>
          <p className="text-gray-400">Chia sẻ video của bạn trên Mini YouTube</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-600/20 border border-red-600 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tiêu đề video <span className="text-red-500">*</span>
            </label>
            <input 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              maxLength={200}
              disabled={uploading}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-50"
              placeholder="Nhập tiêu đề hấp dẫn..." 
            />
            <p className="text-xs text-gray-400 mt-1">{title.length}/200 ký tự</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mô tả (Tùy chọn)
            </label>
            <textarea 
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={5000}
              disabled={uploading}
              rows={4}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition resize-none disabled:opacity-50"
              placeholder="Mô tả chi tiết về video của bạn..."
            />
            <p className="text-xs text-gray-400 mt-1">{description.length}/5000 ký tự</p>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              File video <span className="text-red-500">*</span>
            </label>
            <div className="relative border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:bg-gray-700/50 hover:border-blue-500 transition cursor-pointer bg-gray-900/50 group">
              <input 
                type="file" 
                id="file" 
                accept="video/mp4,video/mpeg,video/quicktime,video/x-msvideo"
                onChange={handleFileSelect}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <div>
                <div className="text-5xl mb-3 group-hover:scale-110 transition">☁️</div>
                <p className="text-white font-medium">
                  {selectedFile ? selectedFile.name : 'Kéo thả file hoặc click để chọn'}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Hỗ trợ: MP4, MOV, AVI (Tối đa 5GB)
                </p>
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-300">Đang tải lên...</p>
                <p className="text-sm font-bold text-blue-400">{uploadProgress}%</p>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button 
            onClick={handleUpload} 
            disabled={uploading || !selectedFile || !title.trim()}
            className={`w-full py-3 rounded-lg font-bold text-white transition text-lg flex items-center justify-center gap-2 ${
              uploading || !selectedFile || !title.trim()
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {uploading ? (
              <>
                <span className="animate-spin">⏳</span>
                Đang xử lý... ({uploadProgress}%)
              </>
            ) : (
              <>🚀 BẮT ĐẦU UPLOAD LÊN AZURE</>
            )}
          </button>
        </div>

        {/* Info Section */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-xs text-gray-400">
            <span className="font-medium text-yellow-400">💡 Mẹo:</span> Video sẽ được lưu trữ trên Azure Cloud Storage. Sau khi upload, video sẽ được xử lý tự động (Thường mất vài phút).
          </p>
        </div>
      </div>
    </div>
  );
};

export default Upload;