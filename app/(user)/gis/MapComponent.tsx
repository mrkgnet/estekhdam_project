'use client'

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'

// رفع مشکل لود نشدن آیکون مارکر پیش‌فرض در لیفلت
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// کامپوننت برای هندل کردن کلیک روی نقشه
function ClickHandler({ setLocation }) {
  useMapEvents({
    click(e) {
      setLocation({
        latitude: e.latlng.lat,
        longitude: e.latlng.lng
      })
    },
  })
  return null
}

// کامپوننت برای پرواز (Fly) دوربین نقشه به موقعیت جدید
function MapController({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.flyTo([center.latitude, center.longitude], 16)
    }
  }, [center, map])
  return null
}

export default function MapComponent({ location, setLocation }) {
  const defaultCenter = [35.6892, 51.3890] // تهران

  return (
    <div className="w-full h-96 rounded-lg border-2 border-gray-300 overflow-hidden relative z-0">
      <MapContainer 
        center={location ? [location.latitude, location.longitude] : defaultCenter} 
        zoom={16} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {location && (
          <>
            <Marker position={[location.latitude, location.longitude]} />
            <MapController center={location} />
          </>
        )}
        
        <ClickHandler setLocation={setLocation} />
      </MapContainer>
    </div>
  )
}
