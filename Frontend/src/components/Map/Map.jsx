import React, { useState, useEffect, useCallback } from 'react';
import classes from './map.module.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { toast } from 'react-toastify';
import * as L from 'leaflet';

// Ensure marker icon is resolved correctly with Vite
const markerIcon = new L.Icon({
  iconUrl: new URL('/marker-icon-2x.png', import.meta.url).href,
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -41],
});

export default function Map({ readonly, location, onChange }) {
  return (
    <div className={classes.container}>
      <MapContainer
        className={classes.map}
        center={location || [0, 0]} // Use initial location if provided
        zoom={13} // Default zoom level for better view
        dragging={!readonly}
        touchZoom={!readonly}
        doubleClickZoom={!readonly}
        scrollWheelZoom={!readonly}
        boxZoom={!readonly}
        keyboard={!readonly}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapEventsHandler readonly={readonly} location={location} onChange={onChange} />
      </MapContainer>
    </div>
  );
}

function MapEventsHandler({ readonly, location, onChange }) {
  const [position, setPosition] = useState(location);

  useEffect(() => {
    if (location) {
      setPosition(location);
    }
  }, [location]);

  useEffect(() => {
    if (!readonly && position) {
      onChange(position);
    }
  }, [position, readonly, onChange]);

  const map = useMapEvents({
    click(e) {
      if (!readonly) {
        setPosition(e.latlng);
      }
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom()); // Use current zoom level for smooth transition
    },
    locationerror(e) {
      toast.error(e.message);
    },
  });

  const handleFindLocation = useCallback(() => {
    if (!readonly) {
      map.locate();
    }
  }, [map, readonly]);

  return (
    <>
      {!readonly && (
        <button
          type="button"
          className={classes.find_location}
          onClick={handleFindLocation}
        >
          Find My Location
        </button>
      )}

      {position && (
        <Marker
          eventHandlers={{
            dragend: (e) => {
              setPosition(e.target.getLatLng());
            },
          }}
          position={position}
          draggable={!readonly}
          icon={markerIcon}
        >
          <Popup>Shipping Location</Popup>
        </Marker>
      )}
    </>
  );
}
