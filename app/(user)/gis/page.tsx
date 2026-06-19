'use client'

import { useState } from 'react'

export default function LocationComponent() {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('مرورگر شما از geolocation پشتیبانی نمی‌کند')
      return
    }

    setLoading(true)
    setError(null)
    setLocation(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        })
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    )
  }

  return (
    <div style={{
      maxWidth: '400px',
      margin: '40px auto',
      padding: '24px',
      fontFamily: 'sans-serif',
      direction: 'rtl'
    }}>
      <h2>موقعیت مکانی</h2>

      <button
        onClick={getLocation}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#aaa' : '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '16px'
        }}
      >
        {loading ? 'در حال دریافت...' : 'دریافت موقعیت'}
      </button>

      {location && (
        <div style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px'
        }}>
          <h3 style={{ marginTop: 0 }}>موقعیت شما:</h3>
          <p><strong>عرض جغرافیایی:</strong> {location.latitude}</p>
          <p><strong>طول جغرافیایی:</strong> {location.longitude}</p>
          <p><strong>دقت:</strong> {location.accuracy.toFixed(2)} متر</p>
          <a
            href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#0070f3' }}
          >
            نمایش روی Google Maps
          </a>
        </div>
      )}

      {error && (
        <div style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#fff1f2',
          border: '1px solid #fecdd3',
          borderRadius: '8px',
          color: '#e11d48'
        }}>
          <strong>خطا:</strong> {error}
        </div>
      )}
    </div>
  )
}
