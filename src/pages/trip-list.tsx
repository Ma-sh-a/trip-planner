import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/auth-context";
import Modal from "../components/modal";
import CreateTripForm, { TripData } from "../components/create-trip-form";
import Toast from "../components/toast";
import { tripService } from "../services/trip-service";
import "../styles/trip-list.css";

interface Trip {
  id: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  userId: string;
  createdAt: Date;
}

const TripList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserTrips = async () => {
      if (!currentUser) return;

      try {
        const userTrips = await tripService.getUserTrips(currentUser.uid);
        setTrips(userTrips as Trip[]);
      } catch (error) {
        console.error("Ошибка загрузки поездок:", error);
        setToast({ message: "Ошибка загрузки поездок", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    loadUserTrips();
  }, [currentUser]);

  const handleCreateTrip = async (formData: TripData) => {
    if (!currentUser) return;

    setIsModalOpen(false);

    const optimisticTrip: Trip = {
      id: "temp-" + Date.now(),
      title: formData.title,
      location: formData.location,
      startDate: formData.startDate,
      endDate: formData.endDate,
      description: formData.description,
      userId: currentUser.uid,
      createdAt: new Date(),
    };

    setTrips((prev) => [optimisticTrip, ...prev]);

    try {
      const newTripId = await tripService.createTrip({
        title: formData.title,
        location: formData.location,
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description,
        userId: currentUser.uid,
      });

      setTrips((prev) =>
        prev.map((trip) =>
          trip.id === optimisticTrip.id ? { ...trip, id: newTripId } : trip,
        ),
      );

      setToast({ message: "Поездка создана!", type: "success" });

      navigate(`/trip/${newTripId}`);
    } catch (error) {
      console.error("Ошибка создания поездки:", error);
      setTrips((prev) => prev.filter((trip) => trip.id !== optimisticTrip.id));
      setToast({ message: "Не удалось создать поездку", type: "error" });
    }
  };

  const formatDateRange = (start: string, end: string) => {
    return `${start} - ${end}`;
  };

  if (loading) {
    return (
      <div className="trip-list-container">
        <div className="loading">Загрузка поездок...</div>
      </div>
    );
  }

  return (
    <div className="trip-list-container">
      <div className="trip-list-header">
        <h1>Мои поездки</h1>
        <button
          className="create-trip-btn"
          onClick={() => setIsModalOpen(true)}
        >
          + Новая поездка
        </button>
      </div>

      {trips.length === 0 ? (
        <div className="empty-state">
          <p>У вас пока нет поездок</p>
          <p>Создайте первую поездку!</p>
        </div>
      ) : (
        <div className="trips-grid">
          {trips.map((trip) => (
            <Link to={`/trip/${trip.id}`} key={trip.id} className="trip-card">
              <div className="trip-card-content">
                <h3>{trip.title}</h3>
                <p>{formatDateRange(trip.startDate, trip.endDate)}</p>
                <p className="trip-location">📍 {trip.location}</p>
                {trip.description && (
                  <p className="trip-description">{trip.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Создать новую поездку"
      >
        <CreateTripForm
          onSubmit={handleCreateTrip}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default TripList;
