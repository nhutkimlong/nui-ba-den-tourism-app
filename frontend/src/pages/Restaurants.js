import React, { useEffect, useState } from 'react';
import api from '../api';
import { FiMapPin, FiExternalLink, FiCoffee } from 'react-icons/fi';

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await api.get('/api/restaurants');
        setRestaurants(response.data);
      } catch (err) {
        setError('Không tải được dữ liệu nhà hàng');
        console.error('Error fetching restaurants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Đang tải nhà hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="hero">
        <h1>Nhà Hàng & Ẩm Thực</h1>
        <p>Khám phá hương vị đặc trưng của Tây Ninh và ẩm thực địa phương</p>
      </div>

      <div className="grid">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="card group">
            <div className="relative overflow-hidden">
              <img 
                src={restaurant.image} 
                alt={restaurant.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=Restaurant+Image';
                }}
              />
              {restaurant.isActive && (
                <span className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Mở cửa
                </span>
              )}
            </div>
            
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">{restaurant.name}</h3>
              
              <div className="space-y-2 mb-3">
                <div className="flex items-start gap-2 text-sm text-gray-500">
                  <FiMapPin size={14} className="mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{restaurant.address}</span>
                </div>
                
                {restaurant.cuisine && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FiCoffee size={14} />
                    <span>{restaurant.cuisine}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <a
                  href={restaurant.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  <FiExternalLink size={14} />
                  Xem trên bản đồ
                </a>
                
                {!restaurant.isActive && (
                  <span className="text-sm text-gray-400">Tạm đóng</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {restaurants.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FiCoffee size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">Chưa có nhà hàng</h3>
          <p className="text-gray-500">Hiện tại chưa có thông tin nhà hàng nào được cập nhật.</p>
        </div>
      )}

      {/* Specialties Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Đặc sản Tây Ninh</h2>
        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Bò tơ Tây Ninh</h3>
              <p className="text-gray-600 text-sm">
                Món ăn nổi tiếng với thịt bò tơ tươi ngon, được chế biến theo công thức truyền thống.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Bánh tráng phơi sương</h3>
              <p className="text-gray-600 text-sm">
                Đặc sản độc đáo với hương vị đặc trưng, được làm từ bột gạo và phơi sương qua đêm.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Restaurants;
