import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Events() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    axios.get('/api/events')
      .then((res) => { if (mounted) setItems(res.data); })
      .catch(() => setError('Không tải được dữ liệu'))
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="page">Đang tải...</div>;
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


