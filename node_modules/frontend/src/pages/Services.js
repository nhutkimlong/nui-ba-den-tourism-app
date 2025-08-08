import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Services() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    axios.get('/api/services')
      .then((res) => { if (mounted) setItems(res.data); })
      .catch(() => setError('Không tải được dữ liệu'))
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="page">Đang tải...</div>;
  if (error) return <div className="page">{error}</div>;

  return (
    <div className="page">
      <h1>Dịch vụ</h1>
      <div className="grid">
        {items.map((s) => (
          <div key={s.id} className="card">
            <img src={s.image} alt={s.name} />
            <div className="card-body">
              <h3>{s.name}</h3>
              <p>{s.description}</p>
              <div className="price">{s.price.toLocaleString('vi-VN')} đ</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


