import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/auth-context";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Map from "../components/map";
import { geocodingService } from "../services/geocoding-service";
import "../styles/trip-detail.css";

interface Location {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
}

interface Trip {
  id: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  userId: string;
}

const TripDetail = () => {
  const { tripId } = useParams();
  const { currentUser } = useAuth();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    50.8503, 4.3517,
  ]);
  const [mapZoom, setMapZoom] = useState(4);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!tripId || !currentUser) return;

      try {
        const tripDoc = await getDoc(doc(db, "trips", tripId));

        if (tripDoc.exists()) {
          const tripData = tripDoc.data() as Trip;
          if (tripData.userId === currentUser.uid) {
            setTrip({ ...tripData, id: tripDoc.id });
          } else {
            console.error("Нет доступа к этой поездке");
          }
        } else {
          console.error("Поездка не найдена");
        }
      } catch (error) {
        console.error("Ошибка загрузки поездки:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId, currentUser]);

  useEffect(() => {
    const loadLocationData = async () => {
      if (trip?.location) {
        const coordinates = await geocodingService.getCoordinates(
          trip.location,
        );

        if (coordinates) {
          setMapCenter([coordinates.latitude, coordinates.longitude]);
          setMapZoom(12);

          setLocations([
            {
              id: "main-location",
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
              name: trip.location,
            },
          ]);
        }
      }
    };

    loadLocationData();
  }, [trip?.location]);

  if (loading) {
    return (
      <div className="trip-detail-container">
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="trip-detail-container">
        <div className="error">Поездка не найдена</div>
      </div>
    );
  }

  const formatDateRange = (start: string, end: string) => {
    return `${start} - ${end}`;
  };

  return (
    <div className="trip-detail-container">
      <div className="trip-detail-header">
        <h1>{trip.title}</h1>
        <button className="edit-trip-btn">Редактировать</button>
      </div>

      <div className="trip-info">
        <p>
          <strong>Местоположение:</strong> {trip.location}
        </p>
        <p>
          <strong>Даты:</strong> {formatDateRange(trip.startDate, trip.endDate)}
        </p>
        <p>
          <strong>Описание:</strong> {trip.description}
        </p>
      </div>

      <div className="trip-sections">
        <section className="trip-section">
          <h2>Карта {trip.location}</h2>
          <Map locations={locations} center={mapCenter} zoom={mapZoom} />
        </section>

        <section className="trip-section">
          <h2>Заметки</h2>
          <p>Здесь будут заметки и достопримечательности...</p>
        </section>

        <section className="trip-section">
          <h2>Чек-лист</h2>
          <p>Здесь будет список для сборов...</p>
        </section>
      </div>
    </div>
  );
};

export default TripDetail;
