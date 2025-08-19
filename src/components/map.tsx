import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../styles/map.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Location {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
}

interface MapProps {
  locations?: Location[];
  center?: [number, number];
  zoom?: number;
  showAttribution?: boolean;
}

const Map: React.FC<MapProps> = ({
  locations = [],
  center = [55.7558, 37.6175],
  zoom = 10,
  showAttribution = true,
}) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("resize"));
    }
  }, []);

  return (
    <div className="leaflet-map-container">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
          >
            <Popup>
              <div className="map-popup">
                <h4>{location.name}</h4>
                <p>
                  Координаты: {location.latitude.toFixed(4)},{" "}
                  {location.longitude.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {showAttribution && (
        <div className="map-footer">
          <div className="map-legend">
            <span>📍</span>
            <span>Достопримечательности (кликабельные)</span>
          </div>
          <div className="map-attribution">
            Leaflet | © OpenStreetMap contributors
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
