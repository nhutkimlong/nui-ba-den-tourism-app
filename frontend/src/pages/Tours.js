import React, { useEffect, useState } from 'react';
import api from '../api';
import { FiCalendar, FiClock, FiMapPin, FiExternalLink } from 'react-icons/fi';

function Tours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await api.get('/api/tours');
        setTours(response.data);
      } catch (err) {
        setError('Không tải được dữ liệu tours');
        console.error('Error fetching tours:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Đang tải tours...</p>
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
        <h1>Tour Du lịch Núi Bà Đen</h1>
        <p>Khám phá những hành trình thú vị và trải nghiệm văn hóa độc đáo</p>
      </div>

      <div className="grid">
        {tours.map((tour) => (
          <div key={tour.id} className="card group">
            <div className="relative overflow-hidden">
              <img 
                src={tour.image} 
                alt={tour.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=Tour+Image';
                }}
              />
              {tour.isActive && (
                <span className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Đang mở
                </span>
              )}
            </div>
            
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">{tour.name}</h3>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                {tour.description}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FiClock size={14} />
                  <span>{tour.duration}</span>
                </div>
                
                {tour.activities && (
                  <div className="flex items-start gap-2 text-sm text-gray-500">
                    <FiMapPin size={14} className="mt-0.5" />
                    <span className="line-clamp-2">{tour.activities}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <a
                  href={tour.detailsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  <FiExternalLink size={14} />
                  {tour.buttonText || 'Xem chi tiết'}
                </a>
                
                {!tour.isActive && (
                  <span className="text-sm text-gray-400">Tạm ngưng</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {tours.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FiCalendar size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">Chưa có tours</h3>
          <p className="text-gray-500">Hiện tại chưa có tours nào được cập nhật.</p>
        </div>
      )}
    </div>
  );
}

export default Tours;
