import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';

const Login = () => {
  const [isReg, setIsReg] = useState(false); // false = Đang ở màn hình Login
  const [form, setForm] = useState({ username: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    // Validate đơn giản
    if (!form.username || !form.password) {
      return alert('Vui lòng nhập đầy đủ thông tin!');
    }

    try {
      const url = isReg ? '/auth/register' : '/auth/login';
      const res = await axiosClient.post(url, form);

      if (!isReg) {
        // --- LOGIC LOGIN ---
        login(res.data); // Lưu user vào Context & LocalStorage
        navigate('/');   // Chuyển về trang chủ
      } else {
        // --- LOGIC REGISTER ---
        alert('Đăng ký thành công! Hãy đăng nhập ngay.');
        setIsReg(false); // Chuyển về form Login
        setForm({ username: '', password: '' }); // Reset form
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      alert('Thất bại: ' + message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        
        {/* Header Form */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-white">
            {isReg ? 'Tạo tài khoản mới' : 'Đăng nhập'}
          </h2>
          <p className="text-gray-400 text-sm mt-2">Mini YouTube Cloud Project</p>
        </div>
        
        {/* Input Fields */}
        <div className="space-y-4">
          <input 
            placeholder="Tên đăng nhập" 
            value={form.username}
            onChange={e => setForm({...form, username: e.target.value})}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition placeholder-gray-500" 
          />
          <input 
            type="password" 
            placeholder="Mật khẩu" 
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition placeholder-gray-500" 
          />
          
          <button 
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition shadow-lg shadow-blue-900/50 mt-2"
          >
            {isReg ? 'ĐĂNG KÝ NGAY' : 'ĐĂNG NHẬP'}
          </button>
        </div>

        {/* Toggle Login/Register */}
        <p className="text-center mt-6 text-gray-400 text-sm">
          {isReg ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'} 
          <span 
            onClick={() => { setIsReg(!isReg); setForm({ username: '', password: '' }); }} 
            className="text-blue-400 font-bold cursor-pointer hover:underline ml-1"
          >
            {isReg ? 'Đăng nhập ngay' : 'Đăng ký ngay'}
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;