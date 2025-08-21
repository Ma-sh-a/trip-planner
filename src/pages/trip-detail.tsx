import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/auth-context';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Map from '../components/map';
import { geocodingService } from '../services/geocoding-service';
import '../styles/trip-detail.css';

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
  notes?: string;
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedTrip, setEditedTrip] = useState<Partial<Trip>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!tripId || !currentUser) return;

      try {
        const tripDoc = await getDoc(doc(db, 'trips', tripId));

        if (tripDoc.exists()) {
          const tripData = tripDoc.data() as Trip;
          if (tripData.userId === currentUser.uid) {
            const tripWithId = { ...tripData, id: tripDoc.id };
            setTrip(tripWithId);
            setEditedTrip({
              title: tripData.title,
              location: tripData.location,
              startDate: tripData.startDate,
              endDate: tripData.endDate,
              description: tripData.description,
              notes: tripData.notes || '',
            });
          } else {
            console.error('Нет доступа к этой поездке');
          }
        } else {
          console.error('Поездка не найдена');
        }
      } catch (error) {
        console.error('Ошибка загрузки поездки:', error);
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
          trip.location
        );

        if (coordinates) {
          setMapCenter([coordinates.latitude, coordinates.longitude]);
          setMapZoom(12);
          setLocations([
            {
              id: 'main-location',
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

  const handleInputChange = (field: keyof Trip, value: string) => {
    setEditedTrip(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!tripId || !trip) return;

    setSaving(true);
    try {
      await updateDoc(doc(db, 'trips', tripId), editedTrip);

      setTrip({ ...trip, ...editedTrip } as Trip);
      setIsEditing(false);
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (trip) {
      setEditedTrip({
        title: trip.title,
        location: trip.location,
        startDate: trip.startDate,
        endDate: trip.endDate,
        description: trip.description,
        notes: trip.notes || '',
      });
    }
    setIsEditing(false);
  };

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
        {isEditing ? (
          <input
            type="text"
            className="edit-input"
            value={editedTrip.title || ''}
            onChange={e => handleInputChange('title', e.target.value)}
            placeholder="Название поездки"
          />
        ) : (
          <h1>{trip.title}</h1>
        )}

        {isEditing ? (
          <div className="edit-actions">
            <button
              className="edit-trip-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button
              className="cancel-btn"
              onClick={handleCancel}
              disabled={saving}
            >
              Отмена
            </button>
          </div>
        ) : (
          <button className="edit-trip-btn" onClick={() => setIsEditing(true)}>
            Редактировать поездку
          </button>
        )}
      </div>

      <div className="trip-info">
        <div className="info-row">
          <strong>Местоположение:</strong>
          {isEditing ? (
            <input
              type="text"
              className="edit-input"
              value={editedTrip.location || ''}
              onChange={e => handleInputChange('location', e.target.value)}
              placeholder="Местоположение"
            />
          ) : (
            <span>{trip.location}</span>
          )}
        </div>

        <div className="info-row">
          <strong>Даты:</strong>
          {isEditing ? (
            <div className="date-inputs">
              <input
                type="date"
                className="edit-input"
                value={editedTrip.startDate || ''}
                onChange={e => handleInputChange('startDate', e.target.value)}
              />
              <span className="date-separator">—</span>
              <input
                type="date"
                className="edit-input"
                value={editedTrip.endDate || ''}
                onChange={e => handleInputChange('endDate', e.target.value)}
              />
            </div>
          ) : (
            <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
          )}
        </div>

        <div className="info-row">
          <strong>Описание:</strong>
          {isEditing ? (
            <textarea
              className="edit-textarea"
              value={editedTrip.description || ''}
              onChange={e => handleInputChange('description', e.target.value)}
              placeholder="Описание поездки"
              rows={3}
            />
          ) : (
            <span>{trip.description}</span>
          )}
        </div>
      </div>

      <div className="trip-sections">
        <section className="trip-section">
          <h2>Карта {trip.location}</h2>
          <Map locations={locations} center={mapCenter} zoom={mapZoom} />
        </section>

        <section className="trip-section">
          <h2>Заметки</h2>
          {isEditing ? (
            <textarea
              className="edit-textarea"
              value={editedTrip.notes || ''}
              onChange={e => handleInputChange('notes', e.target.value)}
              placeholder="Добавьте свои заметки о поездке..."
              rows={6}
            />
          ) : (
            <div className="notes-content">
              {trip.notes ? (
                <p>{trip.notes}</p>
              ) : (
                <p className="notes-placeholder">
                  Заметок пока нет. Нажмите "Редактировать поездку", чтобы
                  добавить.
                </p>
              )}
            </div>
          )}
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
