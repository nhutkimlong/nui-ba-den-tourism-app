import { useEffect, useState, useRef, useCallback } from 'react';
import api from '../api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FiSearch, FiFilter, FiMapPin, FiNavigation, FiX, FiInfo } from 'react-icons/fi';

// Fix default icon issue in Leaflet when bundling
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// POI Categories
const POI_CATEGORIES = {
  religious: { nameKey: 'religious', icon: 'fa-pray', color: '#8B5CF6' },
  attraction: { nameKey: 'attraction', icon: 'fa-star', color: '#F59E0B' },
  historical: { nameKey: 'historical', icon: 'fa-landmark', color: '#DC2626' },
  viewpoint: { nameKey: 'viewpoint', icon: 'fa-mountain', color: '#059669' },
  food: { nameKey: 'food', icon: 'fa-utensils', color: '#EA580C' },
  parking: { nameKey: 'parking', icon: 'fa-parking', color: '#6B7280' },
  cable: { nameKey: 'cable', icon: 'fa-cable-car', color: '#3B82F6' },
  accommodation: { nameKey: 'accommodation', icon: 'fa-bed', color: '#EC4899' }
};

// Default icon URLs
const getDefaultIconUrl = (poiType) => {
  return `https://cdn-icons-png.flaticon.com/128/6771/6771569.png`;
};

// Custom POI Marker Component
const POIMarker = ({ poi, onMarkerClick, isHighlighted }) => {
  const markerRef = useRef(null);
  
  const createCustomIcon = useCallback(() => {
    const iconUrl = poi.iconurl || getDefaultIconUrl(poi.type);
    const name = poi.name || poi.name_en || 'Điểm tham quan';
    
    const markerHtml = `
      <div class="marker-container" style="background:white;border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,0.12);padding:2px;display:flex;flex-direction:row;align-items:center;${isHighlighted ? 'border:2px solid #0ea5e9;' : ''}">
        <img src="${iconUrl}" class="marker-icon" alt="${name}" onerror="this.src='${getDefaultIconUrl('attraction')}'" style="width:28px;height:28px;object-fit:contain;border-radius:8px;">
        <div class="marker-label" style="display:none;margin-left:8px;background:white;padding:2px 10px;border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,0.10);font-size:13px;font-weight:500;color:#222;white-space:nowrap;">${name}</div>
      </div>`;

    return L.divIcon({
      className: 'custom-marker',
      html: markerHtml,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -28]
    });
  }, [poi, isHighlighted]);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setIcon(createCustomIcon());
    }
  }, [createCustomIcon]);

  return (
    <Marker
      ref={markerRef}
      position={[poi.latitude, poi.longitude]}
      icon={createCustomIcon()}
      eventHandlers={{
        click: () => onMarkerClick(poi)
      }}
    >
      <Popup>
        <div className="poi-popup">
          <h3 className="font-semibold text-lg mb-2">{poi.name}</h3>
          {poi.name_en && <p className="text-sm text-gray-600 mb-2">{poi.name_en}</p>}
          <p className="text-sm mb-2">{poi.description}</p>
          {poi.category && (
            <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
              {POI_CATEGORIES[poi.category]?.nameKey || poi.category}
            </span>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

// Map Controls Component
const MapControls = ({ onSearch, onFilter, onLocate }) => {
  return (
    <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
      <div className="bg-white rounded-lg shadow-lg p-2">
        <button
          onClick={onSearch}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
        >
          <FiSearch size={16} />
          Tìm kiếm
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-2">
        <button
          onClick={onFilter}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-green-50 hover:bg-green-100 rounded-md transition-colors"
        >
          <FiFilter size={16} />
          Lọc
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-2">
        <button
          onClick={onLocate}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-50 hover:bg-purple-100 rounded-md transition-colors"
        >
          <FiNavigation size={16} />
          Vị trí
        </button>
      </div>
    </div>
  );
};

// Search Component
const SearchComponent = ({ pois, onSelectPOI, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filteredPOIs = pois.filter(poi => {
    const nameVi = (poi.name || '').toLowerCase();
    const nameEn = (poi.name_en || '').toLowerCase();
    return nameVi.includes(searchTerm.toLowerCase()) || nameEn.includes(searchTerm.toLowerCase());
  }).slice(0, 7);

  const handleSelect = (poi) => {
    onSelectPOI(poi);
    setShowResults(false);
    setSearchTerm(poi.name || poi.name_en);
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white rounded-lg shadow-lg p-4 min-w-[300px]">
      <div className="flex items-center gap-2 mb-3">
        <FiSearch size={20} className="text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm địa điểm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowResults(true)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <FiX size={16} />
        </button>
      </div>
      
      {showResults && (
        <div className="max-h-64 overflow-y-auto">
          {searchTerm === '' ? (
            <div className="text-sm text-gray-500 p-2">Nhập tên địa điểm để tìm kiếm</div>
          ) : filteredPOIs.length > 0 ? (
            filteredPOIs.map(poi => (
              <div
                key={poi.id}
                onClick={() => handleSelect(poi)}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
              >
                <img
                  src={poi.iconurl || getDefaultIconUrl(poi.type)}
                  alt=""
                  className="w-8 h-8 object-contain rounded"
                  onError={(e) => e.target.src = getDefaultIconUrl('attraction')}
                />
                <div>
                  <div className="font-medium text-sm">{poi.name}</div>
                  {poi.name_en && <div className="text-xs text-gray-500">{poi.name_en}</div>}
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500 p-2">Không tìm thấy địa điểm</div>
          )}
        </div>
      )}
    </div>
  );
};

// Category Filter Component
const CategoryFilter = ({ activeCategory, onCategoryChange, onClose }) => {
  return (
    <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-4 min-w-[250px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Lọc theo danh mục</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <FiX size={16} />
        </button>
      </div>
      
      <div className="space-y-2">
        <button
          onClick={() => onCategoryChange(null)}
          className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
            activeCategory === null ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Tất cả danh mục
        </button>
        
        {Object.entries(POI_CATEGORIES).map(([key, category]) => (
          <button
            key={key}
            onClick={() => onCategoryChange(key)}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
              activeCategory === key ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {category.nameKey}
          </button>
        ))}
      </div>
    </div>
  );
};

// POI Info Panel Component
const POIInfoPanel = ({ poi, onClose, onRouteFrom, onRouteTo }) => {
  if (!poi) return null;

  return (
    <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={poi.iconurl || getDefaultIconUrl(poi.type)}
            alt=""
            className="w-12 h-12 object-contain rounded"
            onError={(e) => e.target.src = getDefaultIconUrl('attraction')}
          />
          <div>
            <h3 className="font-semibold text-lg">{poi.name}</h3>
            {poi.name_en && <p className="text-sm text-gray-600">{poi.name_en}</p>}
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <FiX size={20} />
        </button>
      </div>
      
      <div className="space-y-3">
        {poi.description && (
          <p className="text-sm text-gray-700">{poi.description}</p>
        )}
        
        {poi.category && (
          <div className="flex items-center gap-2">
            <FiInfo size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">
              Danh mục: {POI_CATEGORIES[poi.category]?.nameKey || poi.category}
            </span>
          </div>
        )}
        
        {poi.elevation && (
          <div className="flex items-center gap-2">
            <FiMapPin size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">
              Độ cao: {poi.elevation}m
            </span>
          </div>
        )}
        
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onRouteFrom(poi)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <FiNavigation size={16} />
            Đi từ đây
          </button>
          <button
            onClick={() => onRouteTo(poi)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            <FiNavigation size={16} />
            Đi đến đây
          </button>
        </div>
      </div>
    </div>
  );
};

export default function MapPage() {
  const [pois, setPois] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedPOI, setSelectedPOI] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [highlightedPOI, setHighlightedPOI] = useState(null);
  const mapRef = useRef(null);

  // Load POI data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [poiResponse, activitiesResponse] = await Promise.all([
          api.get('/api/poi'),
          api.get('/api/activities')
        ]);
        
        setPois(poiResponse.data);
        setActivities(activitiesResponse.data);
      } catch (err) {
        setError('Không tải được dữ liệu');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Filter POIs by category
  const filteredPOIs = activeCategory 
    ? pois.filter(poi => poi.category === activeCategory)
    : pois;

  const handleMarkerClick = (poi) => {
    setSelectedPOI(poi);
    setHighlightedPOI(poi.id);
    setTimeout(() => setHighlightedPOI(null), 2000);
  };

  const handleSearchSelect = (poi) => {
    setSelectedPOI(poi);
    setHighlightedPOI(poi.id);
    setTimeout(() => setHighlightedPOI(null), 2000);
    
    // Center map on selected POI
    if (mapRef.current) {
      mapRef.current.setView([poi.latitude, poi.longitude], 16);
    }
  };

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 16);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Không thể lấy vị trí hiện tại');
        }
      );
    } else {
      alert('Trình duyệt không hỗ trợ định vị');
    }
  };

  const handleRouteFrom = (poi) => {
    // TODO: Implement routing from POI
    console.log('Route from:', poi);
  };

  const handleRouteTo = (poi) => {
    // TODO: Implement routing to POI
    console.log('Route to:', poi);
  };

  if (loading) return (
    <div className="page">
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Đang tải dữ liệu bản đồ...</p>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="page">
      <div className="text-center text-red-500">{error}</div>
    </div>
  );

  const center = pois.length > 0 ? [pois[0].latitude, pois[0].longitude] : [11.3127, 106.1303];

  return (
    <div className="page relative">
      <h1 className="mb-4">Bản đồ Núi Bà Đen</h1>
      
      <div className="relative h-[600px] rounded-lg overflow-hidden">
        <MapContainer
          ref={mapRef}
          center={center}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {filteredPOIs.map((poi) => (
            <POIMarker
              key={poi.id}
              poi={poi}
              onMarkerClick={handleMarkerClick}
              isHighlighted={highlightedPOI === poi.id}
            />
          ))}
        </MapContainer>

        {/* Map Controls */}
        <MapControls
          onSearch={() => setShowSearch(true)}
          onFilter={() => setShowFilter(true)}
          onLocate={handleLocate}
        />

        {/* Search Component */}
        {showSearch && (
          <SearchComponent
            pois={pois}
            onSelectPOI={handleSearchSelect}
            onClose={() => setShowSearch(false)}
          />
        )}

        {/* Category Filter */}
        {showFilter && (
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            onClose={() => setShowFilter(false)}
          />
        )}

        {/* POI Info Panel */}
        {selectedPOI && (
          <POIInfoPanel
            poi={selectedPOI}
            onClose={() => setSelectedPOI(null)}
            onRouteFrom={handleRouteFrom}
            onRouteTo={handleRouteTo}
          />
        )}
      </div>

      {/* Statistics */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{pois.length}</div>
          <div className="text-sm text-gray-600">Điểm tham quan</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{activities.length}</div>
          <div className="text-sm text-gray-600">Hoạt động</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">
            {Object.keys(POI_CATEGORIES).length}
          </div>
          <div className="text-sm text-gray-600">Danh mục</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-600">
            {pois.filter(p => p.featured).length}
          </div>
          <div className="text-sm text-gray-600">Điểm nổi bật</div>
        </div>
      </div>
    </div>
  );
}


