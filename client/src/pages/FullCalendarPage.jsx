import React, { useState, useEffect } from "react";
import axios from "axios"; // Assuming you've set up axios.js
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "../components/Modal"; // Import your Modal component
import "../styles/FullCalendarPage.css";

const FullCalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [artists, setArtists] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [deleteInfo, setDeleteInfo] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "Tattoo",
    location: "",
    date: "",
    startTime: "",
    endTime: "",
    deposit: 0,
    total: 0,
    referencePhotos: [],
    additionalDetails: "",
    textReminder: false,
    emailReminder: false,
    artistId: "",
  });

  const initialFormState = {
    name: "",
    email: "",
    phone: "",
    artistId: "",
    type: "Tattoo",
    location: "",
    startTime: "",
    endTime: "",
    deposit: "",
    total: "",
    referencePhotos: [],
    additionalDetails: "",
    textReminder: false,
    emailReminder: false,
  };
  
  const fetchArtists = async (setArtists) => {
    try {
      const response = await axios.get("/api/artists");
      console.log("Fetched artists:", response.data);
      setArtists(response.data);
    } catch (error) {
      console.error("Error fetching artists:", error);
    }
  };
  
  const confirmDelete = async () => {
    if (!deleteInfo) return;
  
    const { id, artistId } = deleteInfo;
  
    try {
      await axios.delete(`/api/appointments/${artistId}/appointments/${id}`);
      setIsEventModalOpen(false);
      setIsConfirmModalOpen(false);
  
      // Ensure artists are available before fetching appointments
      if (artists.length > 0) {
        await fetchAppointments(setEvents, artists);
      } else {
        console.warn("Artists data is not ready. Skipping fetchAppointments.");
      }
      // await fetchAppointments(setEvents, artists);

    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("Failed to delete appointment. Please try again.");
    }
  };
  
  useEffect(() => {
    fetchArtists(setArtists);
  }, []);

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setFormData((prevState) => ({
      ...prevState,
      date: arg.dateStr, // Set the date in the form data
    }));
    setShowModal(true);
  };

  const handleEventClick = async (clickInfo) => {
    try {
      const artistId = clickInfo.event.extendedProps.artistId; // Assuming artistId is stored in event's extendedProps
      const event = clickInfo.event; // Use the event object directly
      const appointment = clickInfo.event.extendedProps; // Assuming appointment details are stored in extendedProps
      console.log("Appointment details:", clickInfo.event.extendedProps);
  
      if (!artistId) {
        console.error("Artist ID is missing for this appointment.");
        return;
      }
      const formatTime = (time) => {
        const [hours, minutes] = time.split(":");
        const date = new Date();
        date.setHours(hours, minutes);
        return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
      };
  
      setSelectedEvent({
        id: event.id,
        artistId: appointment.artistId,
        name: event.title,
        email: appointment.email,
        phone: appointment.phone,
        type: appointment.type,
        location: appointment.location,
        date: event.start ? event.start.toLocaleDateString() : "Unknown",
        time: { startTime: formatTime(appointment.time.startTime), endTime: formatTime(appointment.time.endTime) },
        deposit: appointment.deposit,
        total: appointment.total,
        referencePhotos: appointment.referencePhotos || [],
        additionalDetails: appointment.additionalDetails || "No additional details",
        safetyWaiver: appointment.safetyWaiver || "No waiver uploaded",
        textReminder: event.textReminder ? "Yes" : "No",
        emailReminder: event.emailReminder ? "Yes" : "No",
        artist: appointment.artistName || "Unknown",
      });
  
      setIsEventModalOpen(true);
    } catch (error) {
      console.error("Error fetching appointment details:", error);
    }
  };  
  

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDate(null);
    setFormData(initialFormState);
  };

  const fetchAppointments = async (setEvents, artists) => {
    try {
      const response = await axios.get("/api/appointments");
      const appointments = response.data;
  
      const eventsWithColor = appointments
        .map((appointment) => {
          const foundArtist = artists.find(
            (artist) => artist._id.toString() === appointment.artist._id.toString()
          );
  
          console.log(
            foundArtist
              ? `Found artist: ${foundArtist.name} with color: ${foundArtist.appointmentColor}`
              : `No artist found for appointment: ${appointment._id}`
          );
  
          const dateOnly = appointment.date.split("T")[0];
  
          if (!dateOnly || !appointment.startTime || !appointment.endTime) {
            console.error(`Invalid date/time for appointment ${appointment._id}`);
            return null;
          }
  
          const startDateTime = new Date(`${dateOnly}T${appointment.startTime}:00`);
          const endDateTime = new Date(`${dateOnly}T${appointment.endTime}:00`);
  
          if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
            console.error(`Invalid Date object for appointment ${appointment._id}`, {
              startDateTime,
              endDateTime,
            });
            return null;
          }
  
          return {
            id: appointment._id,
            title: appointment.name,
            start: startDateTime,
            end: endDateTime,
            color: foundArtist ? foundArtist.appointmentColor : "#3788d8",
            email: appointment.email,
            phone: appointment.phone,
            type: appointment.type,
            location: appointment.location,
            date: appointment.dateStr,
            artist: appointment.artist.name,
            time: { startTime: appointment.startTime, endTime: appointment.endTime },
            deposit: appointment.deposit,
            total: appointment.total,
            referencePhotos: appointment.referencePhotos || [],
            additionalDetails: appointment.additionalDetails || "No additional details",
            safetyWaiver: appointment.safetyWaiver || "No waiver uploaded",
            textReminder: appointment.textReminder ? "Yes" : "No",
            emailReminder: appointment.emailReminder ? "Yes" : "No",
            extendedProps: {
              artistId: appointment.artist._id,
              artistName: appointment.artist.name,
            },
          };
        })
        .filter((event) => event !== null);
  
      setEvents(eventsWithColor);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };
  
  useEffect(() => {
    if (artists.length > 0) {
      fetchAppointments(setEvents, artists);
    }
  }, [artists]);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleTimeChange = () => {
    const start = new Date(`1970-01-01T${formData.startTime}Z`);
    const end = new Date(`1970-01-01T${formData.endTime}Z`);
    const duration = (end - start) / 1000 / 60 / 60;
  
    if (formData.artistId) {
      const artist = artists.find((artist) => artist._id === formData.artistId);
      if (artist && duration > 0) {
        const total = artist.hourlyRate * duration - formData.deposit;
        setFormData((prevData) => ({
          ...prevData,
          total: total >= 0 ? total : 0,
        }));
      }
    }
  };
  
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(`/api/appointments/${formData.artistId}/appointments`, formData);
    console.log("Appointment created:", response.data);

    setShowModal(false);
    setFormData({ ...formData, name: "", email: "", phone: "", startTime: "", endTime: "" });

    // Fetch updated appointments
    await fetchAppointments(setEvents, artists);
  } catch (error) {
    console.error("Error creating appointment:", error);
  }
};

const handleDeleteAppointment = () => {
  if (!selectedEvent) return;

  setDeleteInfo({
    id: selectedEvent.id,
    artistId: selectedEvent.artistId,
  });

  setIsConfirmModalOpen(true); // Open the confirmation modal
};

const formatTime = (timeString) => {
  if (!timeString) return "";

  // If already in HH:mm format, return as is
  if (/^\d{2}:\d{2}$/.test(timeString)) return timeString;

  console.log("Converting time:", timeString);

  try {
    // Use regex to capture time format (e.g., "2:30 PM")
    const match = timeString.match(/(\d+):(\d+) (\w{2})/);
    if (!match) throw new Error("Invalid format");

    let [_, hours, minutes, period] = match;
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    // Convert to 24-hour format
    if (period.toUpperCase() === "PM" && hours !== 12) {
      hours += 12;
    } else if (period.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    }

    // Format as "HH:mm"
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  } catch (error) {
    console.error("Invalid time format:", timeString);
    return "";
  }
};

  useEffect(() => {
    if (selectedEvent) {
      setUpdatedData({
        artistId: selectedEvent.artistId,
        name: selectedEvent.name,
        email: selectedEvent.email,
        phone: selectedEvent.phone,
        type: selectedEvent.type,
        location: selectedEvent.location,
        date: selectedEvent.date,
        startTime: formatTime(selectedEvent.time.startTime),
        endTime: formatTime(selectedEvent.time.endTime),
        deposit: selectedEvent.deposit,
        total: selectedEvent.total,
        textReminder: selectedEvent.textReminder,
        emailReminder: selectedEvent.emailReminder,
        additionalDetails: selectedEvent.additionalDetails,
      });
    }
  }, [selectedEvent]);
  
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };
  
  const handleSaveChanges = async () => {
    try {
      // Send update request
      await axios.put(`/api/appointments/${updatedData.artistId}/appointments/${selectedEvent.id}`, updatedData);
  
      // alert("Appointment updated successfully!");
  
      // Fetch updated appointments
      if (artists.length === 0) {
        console.warn("Artists data is not ready. Skipping fetchAppointments.");
        return;
      }
      await fetchAppointments(setEvents, artists);
  
      // Ensure selected event updates with new data
      setSelectedEvent((prev) => ({ ...prev, ...updatedData }));
  
      // Exit editing mode
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating appointment frontend:", error);
      alert("Failed to update appointment. Please try again.");
    }
  };  
  
  return (
    <div className="fullcalendar-container">
      <div className="calendar-header">
        <h1 className="calendar-title">My Calendar</h1>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventColor="#3788d8"
        eventTextColor="#fff"
        dateClick={handleDateClick} // Handles clicking on an empty date
        eventClick={handleEventClick} // Handles clicking on an event
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        slotMinTime="08:00:00"
        slotMaxTime="21:00:00"
        allDaySlot={false}
        eventContent={(eventInfo) => {
          const { title, backgroundColor } = eventInfo.event;
          return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: backgroundColor || "#3788d8",
                  borderRadius: "50%",
                  marginRight: "5px",
                  marginLeft: "5px",
                }}
              />
              <span>{title}</span>
            </div>
          );
        }}
      />

      <div className="artist-key-container">
        <h2>Artist Key</h2>
        <div className="artist-key">
          {artists.map((artist) => (
            <div key={artist._id} className="artist-key-info">
              <span>{artist.name}</span>
              <div 
                className="artist-color" 
                style={{ backgroundColor: artist.appointmentColor}} 
              />
            </div>
          ))}
        </div>
        <div className="artist-buttons">
          <button>Add Artist</button>
          <button>Remove Artist</button>
        </div>
      </div>
  
      <Modal show={showModal} onClose={handleCloseModal}>
        <h2>Create Appointment for {selectedDate}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label>Phone</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
          <div>
            <label>Artist</label>
            <select name="artistId" value={formData.artistId} onChange={handleChange} required>
              <option value="">Select Artist</option>
              {artists.map((artist) => (
                <option key={artist._id} value={artist._id}>
                  {artist.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Type</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="Tattoo">Tattoo</option>
              <option value="Piercing">Piercing</option>
            </select>
          </div>
          <div>
            <label>Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required />
          </div>
          <div>
            <label>Start Time</label>
            <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required onBlur={handleTimeChange} />
          </div>
          <div>
            <label>End Time</label>
            <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required onBlur={handleTimeChange} />
          </div>
          <div>
            <label>Deposit</label>
            <input type="number" name="deposit" value={formData.deposit} onChange={handleChange} required />
          </div>
          <div>
            <label>Total</label>
            <input type="number" name="total" value={formData.total} readOnly />
          </div>
          <div>
            <label>Reference Photos</label>
            <input type="file" name="referencePhotos" onChange={(e) => {
              const files = Array.from(e.target.files);
              setFormData({ ...formData, referencePhotos: files });
            }} multiple />
          </div>
          <div>
            <label>Additional Details</label>
            <textarea name="additionalDetails" value={formData.additionalDetails} onChange={handleChange} />
          </div>
          <div>
            <label>
              <input type="checkbox" name="textReminder" checked={formData.textReminder} onChange={(e) =>
                setFormData({ ...formData, textReminder: e.target.checked })
              } />
              Text Reminder
            </label>
          </div>
          <div>
            <label>
              <input type="checkbox" name="emailReminder" checked={formData.emailReminder} onChange={(e) =>
                setFormData({ ...formData, emailReminder: e.target.checked })
              } />
              Email Reminder
            </label>
          </div>
          <button type="submit">Create Appointment</button>
        </form>
      </Modal>

      <Modal 
        show={isEventModalOpen} 
        onClose={() => {
          setIsEventModalOpen(false);
          setIsEditing(false); // Reset editing state when closing
        }}
      >
        {selectedEvent && (
          <div>
            <h2>Appointment Details</h2>

            {isEditing ? (
              <form onSubmit={handleSaveChanges}>
                <div>
                  <label>Name</label>
                  <input type="text" name="name" value={updatedData.name} onChange={handleInputChange} required />
                </div>
                <div>
                  <label>Email</label>
                  <input type="email" name="email" value={updatedData.email} onChange={handleInputChange} required />
                </div>
                <div>
                  <label>Phone</label>
                  <input type="text" name="phone" value={updatedData.phone} onChange={handleInputChange} required />
                </div>
                <div>
                  <label>Artist</label>
                  <select name="artistId" value={updatedData.artistId} onChange={handleInputChange} required>
                    <option value="">Select Artist</option>
                    {artists.map((artist) => (
                      <option key={artist._id} value={artist._id}>
                        {artist.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Type</label>
                  <select name="type" value={updatedData.type} onChange={handleInputChange}>
                    <option value="Tattoo">Tattoo</option>
                    <option value="Piercing">Piercing</option>
                  </select>
                </div>
                <div>
                  <label>Location</label>
                  <input type="text" name="location" value={updatedData.location} onChange={handleInputChange} required />
                </div>
                <div>
                  <label>Start Time</label>
                  <input type="time" name="startTime" value={updatedData.startTime} onChange={handleInputChange} required onBlur={handleTimeChange}/>
                </div>
                <div>
                  <label>End Time</label>
                  <input type="time" name="endTime" value={updatedData.endTime} onChange={handleInputChange} required onBlur={handleTimeChange}/>
                </div>
                <div>
                  <label>Deposit</label>
                  <input type="number" name="deposit" value={updatedData.deposit} onChange={handleInputChange} required />
                </div>
                <div>
                  <label>Total</label>
                  <input type="number" name="total" value={updatedData.total} readOnly />
                </div>
                <div>
                  <label>Reference Photos</label>
                  <input
                    type="file"
                    name="referencePhotos"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setUpdatedData({ ...updatedData, referencePhotos: files });
                    }}
                    multiple
                  />
                </div>
                <div>
                  <label>Additional Details</label>
                  <textarea name="additionalDetails" value={updatedData.additionalDetails} onChange={handleInputChange} />
                </div>
                <div>
                  <label>
                    <input type="checkbox" name="textReminder" checked={updatedData.textReminder} onChange={(e) =>
                      setUpdatedData({ ...updatedData, textReminder: e.target.checked })
                    } />
                    Text Reminder
                  </label>
                </div>
                <div>
                  <label>
                    <input type="checkbox" name="emailReminder" checked={updatedData.emailReminder} onChange={(e) =>
                      setUpdatedData({ ...updatedData, emailReminder: e.target.checked })
                    } />
                    Email Reminder
                  </label>
                </div>
              </form>
            ) : (
              <>
                <p><strong>Artist:</strong> {selectedEvent.artist}</p>
                <p><strong>Name:</strong> {selectedEvent.name}</p>
                <p><strong>Email:</strong> {selectedEvent.email}</p>
                <p><strong>Phone:</strong> {selectedEvent.phone}</p>
                <p><strong>Type:</strong> {selectedEvent.type}</p>
                <p><strong>Location:</strong> {selectedEvent.location}</p>
                <p><strong>Date:</strong> {selectedEvent.date}</p>
                <p><strong>Time:</strong> {selectedEvent.time.startTime} - {selectedEvent.time.endTime}</p>
                <p><strong>Deposit:</strong> ${selectedEvent.deposit}</p>
                <p><strong>Total:</strong> ${selectedEvent.total}</p>
                <p><strong>Text Reminder:</strong> {selectedEvent.textReminder ? "Yes" : "No"}</p>
                <p><strong>Email Reminder:</strong> {selectedEvent.emailReminder ? "Yes" : "No"}</p>
                <p><strong>Additional Details:</strong> {selectedEvent.additionalDetails}</p>
                <p><strong>Reference Photos:</strong></p>
                {selectedEvent.referencePhotos && selectedEvent.referencePhotos.length > 0 ? (
                  selectedEvent.referencePhotos.map((photo, index) => (
                    <img key={index} src={photo} alt={`Reference ${index + 1}`} style={{ width: "100px", marginRight: "10px" }} />
                  ))
                ) : (
                  <p>No reference photos uploaded.</p>
                )}
              </>
            )}
          </div>
        )}
        {isEditing ? (
          <button onClick={handleSaveChanges}>Save Changes</button>
        ) : (
          <button onClick={handleEditClick}>Update Appointment</button>
        )}
        <button onClick={handleDeleteAppointment}>Delete Appointment</button>
      </Modal>


      {isConfirmModalOpen && (
        <Modal show={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)}>
          <div>
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this appointment?</p>
            <div>
              <button onClick={confirmDelete} style={{ marginRight: "10px", background: "red", color: "white" }}>
                Yes, Delete
              </button>
              <button onClick={() => setIsConfirmModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FullCalendarPage;
