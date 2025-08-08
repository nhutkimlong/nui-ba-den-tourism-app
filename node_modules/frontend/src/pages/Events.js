import { useEffect, useState } from 'react';
import api from '../api';

export default function Events() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    api.get('/api/events')
      .then((res) => { if (mounted) setItems(res.data); })
      .catch(() => setError('Không tải được dữ liệu'))
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) return (
    <div className="page">
      <h1>Sự kiện</h1>
      <div className="grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card">
            <div className="skeleton h160" />
            <div className="card-body">
              <div className="skeleton line" style={{ width: '60%' }} />
              <div className="skeleton line" style={{ width: '90%' }} />
              <div className="skeleton line" style={{ width: '40%' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  if (error) return <div className="page">{error}</div>;

  return (
    <div className="page">
      <h1>Sự kiện</h1>
      <div className="grid">
        {items.map((e) => (
          <div key={e.id} className="card">
            <img src={e.image} alt={e.name} />
            <div className="card-body">
              <h3>{e.name}</h3>
              <p><strong>Ngày:</strong> {new Date(e.date).toLocaleDateString('vi-VN')}</p>
              <p>{e.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


