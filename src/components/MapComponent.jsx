import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import {
  getMarkers, setMarker, verifyMarker, deleteMarker,
  getFloodAreas, addFloodArea, verifyFloodArea, deleteFloodArea
} from '../API/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Icons
const verifiedIcon = L.icon({ iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png', iconSize: [40, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] });
const userIcon = L.icon({ iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png', iconSize: [40, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] });
const floodIcon = L.icon({ iconUrl: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png', iconSize: [40, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] });
const shelterIcon = L.icon({ iconUrl: 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png', iconSize: [40, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] });

/* ─── Popup button styles injected once ─── */
const POPUP_STYLE = `
  .fl-popup .leaflet-popup-content-wrapper {
    background: rgba(15,12,41,0.97);
    border: 1px solid rgba(0,245,212,0.3);
    border-radius: 14px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(0,245,212,0.1);
    color: #fff;
    font-family: 'Segoe UI', sans-serif;
    padding: 0;
  }
  .fl-popup .leaflet-popup-content {
    margin: 0;
    padding: 16px 18px;
    min-width: 180px;
  }
  .fl-popup .leaflet-popup-tip {
    background: rgba(15,12,41,0.97);
  }
  .fl-popup .leaflet-popup-close-button {
    color: rgba(0,245,212,0.6) !important;
    font-size: 18px !important;
    top: 8px !important; right: 10px !important;
  }
  .fl-popup-title {
    font-weight: 700;
    font-size: 0.9rem;
    margin-bottom: 8px;
    letter-spacing: 0.04em;
  }
  .fl-popup-row {
    color: rgba(255,255,255,0.6);
    font-size: 0.78rem;
    margin-bottom: 4px;
  }
  .fl-popup-status {
    display: inline-block;
    font-size: 0.72rem;
    padding: 2px 10px;
    border-radius: 50px;
    font-weight: 600;
    margin-top: 6px;
    margin-bottom: 10px;
  }
  .fl-btn {
    display: block;
    width: 100%;
    padding: 7px 12px;
    border-radius: 8px;
    border: none;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 6px;
    letter-spacing: 0.03em;
    transition: opacity 0.2s;
  }
  .fl-btn:hover { opacity: 0.85; }
  .fl-btn-verify {
    background: linear-gradient(135deg, #00f5d4, #00b4d8);
    color: #0f0c29;
  }
  .fl-btn-delete {
    background: linear-gradient(135deg, #ff4d6d, #c9184a);
    color: #fff;
  }
`;

function MapComponent({ role, username }) {
  const [floodMarkers, setFloodMarkers] = useState([]);
  const [shelterMarkers, setShelterMarkers] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // inject popup styles
    if (!document.getElementById('fl-popup-style')) {
      const el = document.createElement('style');
      el.id = 'fl-popup-style';
      el.textContent = POPUP_STYLE;
      document.head.appendChild(el);
    }
    fetchAllMarkers();
    getUserLocation();
  }, []);

  const fetchAllMarkers = async () => {
    try {
      const shelterRes = await getMarkers();
      const floodRes = await getFloodAreas();

      const shelters = Array.isArray(shelterRes.data)
        ? shelterRes.data.map(m => ({ ...m, latitude: Number(m.latitude), longitude: Number(m.longitude), type: 'SHELTER' }))
        : [];

      const floods = Array.isArray(floodRes.data)
        ? floodRes.data.map(m => ({ ...m, latitude: Number(m.latitude), longitude: Number(m.longitude), type: 'FLOOD' }))
        : [];

      setShelterMarkers(shelters);
      setFloodMarkers(floods);
    } catch (err) {
      console.error('Error fetching markers', err);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        err => console.warn('Geolocation error:', err),
        { enableHighAccuracy: true, timeout: 15000 }
      );
    }
  };

  function MapClickHandler() {
    useMapEvents({
      click: async e => {
        try {
          const newMarker = { latitude: e.latlng.lat, longitude: e.latlng.lng, status: 'PENDING' };

          if (role === 'ADMIN') {
            const res = await setMarker(newMarker);
            setShelterMarkers(prev => [
              ...prev,
              { ...res.data, latitude: Number(res.data.latitude), longitude: Number(res.data.longitude), type: 'SHELTER' }
            ]);
          } else {
            const res = await addFloodArea(newMarker);
            setFloodMarkers(prev => [
              ...prev,
              { ...res.data, latitude: Number(res.data.latitude), longitude: Number(res.data.longitude), type: 'FLOOD' }
            ]);
          }
        } catch (err) {
          console.error('Error adding marker', err);
          alert('Marker not saved. Check backend.');
        }
      }
    });
    return null;
  }

  const handleVerify = async (m) => {
    try {
      if (m.type === 'SHELTER') {
        const res = await verifyMarker(m.id);
        setShelterMarkers(prev => prev.map(x => x.id === m.id ? { ...x, status: res.data.status } : x));
      } else if (m.type === 'FLOOD') {
        const res = await verifyFloodArea(m.id);
        setFloodMarkers(prev => prev.map(x => x.id === m.id ? { ...x, status: res.data.status } : x));
      }
    } catch (err) { console.error('Error verifying marker', err); }
  };

  const handleDelete = async (m) => {
    try {
      if (m.type === 'SHELTER') await deleteMarker(m.id);
      else if (m.type === 'FLOOD') await deleteFloodArea(m.id);

      if (m.type === 'SHELTER') setShelterMarkers(prev => prev.filter(x => x.id !== m.id));
      else setFloodMarkers(prev => prev.filter(x => x.id !== m.id));
    } catch (err) { console.error('Error deleting marker', err); }
  };

  const center = userLocation ? [userLocation.lat, userLocation.lng] : [19.076, 72.8777];

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler />

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup className="fl-popup">
              <div className="fl-popup-title">📍 {username} (You)</div>
              <div className="fl-popup-row">Your current location</div>
            </Popup>
          </Marker>
        )}

        {floodMarkers.map(m => (
          <Marker
            key={`flood-${m.id}`}
            position={[m.latitude, m.longitude]}
            icon={m.status === 'PENDING' ? floodIcon : floodIcon}
          >
            <Popup className="fl-popup">
              <div className="fl-popup-title">🌊 Flood Area</div>
              <div className="fl-popup-row">Lat: {m.latitude.toFixed(4)}, Lng: {m.longitude.toFixed(4)}</div>
              <span
                className="fl-popup-status"
                style={m.status === 'PENDING'
                  ? { background: "rgba(255,165,0,0.2)", border: "1px solid rgba(255,165,0,0.4)", color: "#ffa500" }
                  : { background: "rgba(0,245,212,0.2)", border: "1px solid rgba(0,245,212,0.4)", color: "#00f5d4" }
                }
              >
                {m.status === 'PENDING' ? '⏳ Pending' : '✅ Verified'}
              </span>
              {role === 'ADMIN' && (
                <>
                  {m.status === 'PENDING' && (
                    <button className="fl-btn fl-btn-verify" onClick={() => handleVerify(m)}>✔ Verify Report</button>
                  )}
                  <button className="fl-btn fl-btn-delete" onClick={() => handleDelete(m)}>🗑 Remove Marker</button>
                </>
              )}
            </Popup>
          </Marker>
        ))}

        {shelterMarkers.map(m => (
          <Marker
            key={`shelter-${m.id}`}
            position={[m.latitude, m.longitude]}
            icon={m.status === 'PENDING' ? shelterIcon : verifiedIcon}
          >
            <Popup className="fl-popup">
              <div className="fl-popup-title">🏕️ Shelter Point</div>
              <div className="fl-popup-row">Lat: {m.latitude.toFixed(4)}, Lng: {m.longitude.toFixed(4)}</div>
              <span
                className="fl-popup-status"
                style={m.status === 'PENDING'
                  ? { background: "rgba(200,130,255,0.2)", border: "1px solid rgba(200,130,255,0.4)", color: "#ce93d8" }
                  : { background: "rgba(0,245,212,0.2)", border: "1px solid rgba(0,245,212,0.4)", color: "#00f5d4" }
                }
              >
                {m.status === 'PENDING' ? '⏳ Pending Verification' : '✅ Verified Shelter'}
              </span>
              {role === 'ADMIN' && (
                <>
                  {m.status === 'PENDING' && (
                    <button className="fl-btn fl-btn-verify" onClick={() => handleVerify(m)}>✔ Verify Shelter</button>
                  )}
                  <button className="fl-btn fl-btn-delete" onClick={() => handleDelete(m)}>🗑 Remove Marker</button>
                </>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapComponent;
