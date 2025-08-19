import React, { useState } from "react";
import "../styles/create-trip-form.css";

interface CreateTripFormProps {
  onSubmit: (tripData: TripData) => void;
  onCancel: () => void;
}

export interface TripData {
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

const CreateTripForm: React.FC<CreateTripFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<TripData>({
    title: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form className="trip-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Название поездки *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Например: Отпуск в Италии"
        />
      </div>

      <div className="form-group">
        <label htmlFor="location">Местоположение *</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          placeholder="Например: Рим, Италия"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="startDate">Дата начала *</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">Дата окончания *</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Описание</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="Опишите вашу поездку..."
        />
      </div>

      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Отмена
        </button>
        <button type="submit" className="submit-btn">
          Создать поездку
        </button>
      </div>
    </form>
  );
};

export default CreateTripForm;
