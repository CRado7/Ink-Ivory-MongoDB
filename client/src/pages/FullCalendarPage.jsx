import React, { useState, useEffect } from "react";
import axios from "axios"; // Assuming you've set up axios.js
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "../components/Modal"; // Import your Modal component
import CloudinaryUploader from '../components/CloudinaryUploader';
import GalleryUpload from '../components/GalleryUpload';
import "../styles/FullCalendarPage.css";

const FullCalendarPage = () => {
  const [events, setEvents] = useState([]);
  const closedDays = [0, 6]; // Sunday (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const closedDates = []; //["2025-12-25", "2025-01-01"]; // Example closed dates (Christmas, New Year)
  const [selectedArtist, setSelectedArtist] = useState("");
  // const [selectedArtistForSort, setSelectedArtistForSort] = useState(""); // Sorting
  const [selectedArtistForTimeOff, setSelectedArtistForTimeOff] = useState([]); // Time Off
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isAddArtistModalOpen, setIsAddArtistModalOpen] = useState(false);
  const [artists, setArtists] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isConfirmArtistModalOpen, setIsConfirmArtistModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [isClosedModalOpen, setIsClosedModalOpen] = useState(false);
  const [closedDate, setClosedDate] = useState("");
  const [newArtist, setNewArtist] = useState({
    name: "",
    services: [],  // Ensures it's always an array
    portfolio: "",
    profilePic: "",
    hourlyRate: "",
  });
  const [deleteArtistModal, setDeleteArtistModal] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isTimeOffModalOpen, setIsTimeOffModalOpen] = useState(false);
  const [timeOffData, setTimeOffData] = useState({
    start: [
      { date: "", startTime: "" },
    ],
    end: [
      { date: "", endTime: "" },
    ],
    reason: "",
  });
  const [timeOffEvents, setTimeOffEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
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
  const [galleryImages, setGalleryImages] = useState([]);

  const initialFormState = {
    name: "",
    email: "",
    phone: "",
    artistId: "",
    type: "Tattoo",
    location: "",
    startTime: "",
    endTime: "",
    deposit: 0,
    total: 0,
    referencePhotos: [],
    additionalDetails: "",
    textReminder: false,
    emailReminder: false,
  };

  const handleDateClick = (arg) => {
    let clickedDate;
  
    if (arg.date instanceof Date && !isNaN(arg.date)) {
      clickedDate = arg.date; // Use the provided Date object
    } else if (typeof arg.dateStr === "string") {
      const [year, month, day] = arg.dateStr.split("-").map(Number);
      clickedDate = new Date(year, month - 1, day);
    } else {
      console.error("Invalid date in handleDateClick:", arg);
      return;
    }
  
    if (isClosedDay(clickedDate)) {
      setClosedDate(clickedDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }));
      setIsClosedModalOpen(true);
      return;
    }
  
    const formattedDate = clickedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  
    setSelectedDate(formattedDate);
    setFormData((prevState) => ({
      ...prevState,
      date: arg.dateStr, // Keep original format for backend compatibility
    }));

    setShowModal(true);
    
  };      

  const isClosedDay = (date) => {
    if (!(date instanceof Date) || isNaN(date)) {
      console.error("Invalid date in isClosedDay:", date);
      return false; // Don't block scheduling on invalid dates
    }
  
    const day = date.getDay();
    const dateString = date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
    return closedDays.includes(day) || closedDates.includes(dateString);
  };
  

  const handleEventClick = async (clickInfo) => {
    try {
      const artistId = clickInfo.event.extendedProps.artistId; // Assuming artistId is stored in event's extendedProps
      const event = clickInfo.event; // Use the event object directly
      const appointment = clickInfo.event.extendedProps; // Assuming appointment details are stored in extendedProps
      // console.log("Appointment details:", clickInfo.event.extendedProps);
  
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
  
  // const handleViewChange = (view) => {
  //   if (view.type === "timeGridWeek" || view.type === "timeGridDay") {
  //     setFilteredEvents([...events, ...timeOffEvents]); // Show time-off events in week/day view
  //   } else {
  //     setFilteredEvents([...events]); // Only show appointments in month view
  //   }
  // };

  // useEffect(() => {
  //   setFilteredEvents(events); // Ensure appointments load first
  // }, [events]);
  
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDate(null);
    setFormData(initialFormState);
  };

  const fetchAppointments = async () => {
    try {
      // Ensure selectedArtist.id is used instead of the whole object
      let url = selectedArtist.id
        ? `/api/appointments/${selectedArtist.id}/appointments`
        : "/api/appointments";
  
      const response = await axios.get(url);
      console.log("Fetched Appointments Response:", response.data);
      const appointments = response.data;
  
      if (!Array.isArray(appointments)) {
        console.error("Invalid data format from API:", appointments);
        return;
      }
  
      const eventsWithColor = appointments
        .map((appointment) => {
          if (!appointment.artist) {
            console.error(`No artist information for appointment ${appointment._id}`);
            return null;
          }
  
          const foundArtist = artists.find(
            (artist) => artist._id && appointment.artist._id && artist._id.toString() === appointment.artist._id.toString()
          );
  
          if (!foundArtist) {
            console.error(`No artist found for appointment ${appointment._id}`);
            return null;
          }
  
          const dateOnly = appointment.date ? appointment.date.split("T")[0] : null;
          if (!dateOnly || !appointment.startTime || !appointment.endTime) {
            console.error(`Invalid date/time for appointment ${appointment._id}`);
            return null;
          }
  
          const startDateTime = new Date(`${dateOnly}T${appointment.startTime}:00`);
          const endDateTime = new Date(`${dateOnly}T${appointment.endTime}:00`);
  
          if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
            console.error(`Invalid Date object for appointment ${appointment._id}`);
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
    fetchAppointments();
  }, [selectedArtist, artists]);
  
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
  
    if (formData.type === "Piercing") {
      setFormData((prevData) => ({
        ...prevData,
        total: 30,
      }));
    } if (formData.type === "Consult") {
      setFormData((prevData) => ({
        ...prevData,
        location: "N/A",
        total: 0,
      }));
    } else if (formData.artistId) {
      // For other types (like Tattoo), calculate total based on artist's hourly rate and duration
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

  const handleFilesSelected = (files) => {
    setSelectedFiles(files);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const [year, month, day] = formData.date.split('-');
  const selectedDate = new Date(year, month - 1, day);
  selectedDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentTime = new Date();

  const selectedStartTime = new Date(
    year,
    month - 1,
    day,
    ...formData.startTime.split(':')
  );

  const selectedEndTime = new Date(
    year,
    month - 1,
    day,
    ...formData.endTime.split(':')
  );

  // ✅ Prevent booking in the past
  if (selectedDate < today) {
    alert("❌ You cannot schedule an appointment in the past.");
    return;
  }

  if (selectedDate.getTime() === today.getTime() && selectedStartTime < currentTime) {
    alert("❌ You cannot schedule an appointment for an earlier time today.");
    return;
  }

  try {
    // ✅ Fetch existing appointments for the same artist
    const { data: existingAppointments } = await axios.get(
      `/api/appointments/${formData.artistId}/appointments`
    );

    // ✅ Check for appointment overlap
    const isOverlap = existingAppointments.some((appointment) => {
      const existingStart = new Date(`${appointment.date}T${appointment.startTime}`);
      const existingEnd = new Date(`${appointment.date}T${appointment.endTime}`);

      return (
        (selectedStartTime >= existingStart && selectedStartTime < existingEnd) || // Overlaps existing start
        (selectedEndTime > existingStart && selectedEndTime <= existingEnd) || // Overlaps existing end
        (selectedStartTime <= existingStart && selectedEndTime >= existingEnd) // Encloses existing appointment
      );
    });

    if (isOverlap) {
      alert("❌ This artist already has an appointment at the selected time.");
      return;
    }

    // ✅ Fetch time-off requests for the same artist
    const { data: timeOffRequests } = await axios.get(`/api/time-off/${formData.artistId}/time-off`);

    // ✅ Check for time-off overlap
    const isDuringTimeOff = timeOffRequests.some((timeOff) => {
      const timeOffStart = new Date(`${timeOff.start.date}T${timeOff.start.startTime}`);
      const timeOffEnd = new Date(`${timeOff.end.date}T${timeOff.end.endTime}`);

      return (
        (selectedStartTime >= timeOffStart && selectedStartTime < timeOffEnd) || // Starts during time off
        (selectedEndTime > timeOffStart && selectedEndTime <= timeOffEnd) || // Ends during time off
        (selectedStartTime <= timeOffStart && selectedEndTime >= timeOffEnd) // Encloses time off
      );
    });

    if (isDuringTimeOff) {
      alert("❌ This artist is not available during the selected time due to a time-off request.");
      return;
    }

    // ✅ Upload images if needed
    let uploadedUrls = [];
    const clientName = formData.name.trim();
    const dateStr = formData.date.split("T")[0];

    if (selectedFiles.length > 0) {
      uploadedUrls = await Promise.all(
        selectedFiles.map(async (file) => {
          const fileData = new FormData();
          fileData.append("file", file);
          fileData.append("upload_preset", "my_unsigned_preset");
          fileData.append("folder", `InkIvory/${clientName}.${dateStr}`);

          try {
            const response = await axios.post(
              `https://api.cloudinary.com/v1_1/dwp2h5cak/image/upload`,
              fileData
            );
            return response.data.secure_url;
          } catch (uploadError) {
            console.error("🔥 Error uploading to Cloudinary:", uploadError);
            return null;
          }
        })
      );

      uploadedUrls = uploadedUrls.filter((url) => url !== null);
    }

    // ✅ Create new appointment request
    const requestData = {
      ...formData,
      referencePhotos: uploadedUrls,
    };

    const response = await axios.post(
      `/api/appointments/${formData.artistId}/appointments`,
      requestData
    );
    console.log("✅ Appointment created:", response.data);

    setShowModal(false);
    setFormData(initialFormState);
    await fetchAppointments(setEvents, artists);
  } catch (error) {
    console.error("🔥 Error creating appointment:", error);
  }
};  

// Update appointment functions
const formatTime = (timeString) => {
  if (!timeString) return "";

  if (/^\d{2}:\d{2}$/.test(timeString)) return timeString;

  console.log("Converting time:", timeString);

  try {
    const match = timeString.match(/(\d+):(\d+) (\w{2})/);
    if (!match) throw new Error("Invalid format");

    let [_, hours, minutes, period] = match;
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    if (period.toUpperCase() === "PM" && hours !== 12) {
      hours += 12;
    } else if (period.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    }

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  } catch (error) {
    console.error("Invalid time format:", timeString);
    return "";
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;

  console.log("Converting date:", dateString);

  try {
    const match = dateString.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (!match) throw new Error("Invalid format");

    let [_, month, day, year] = match;
    month = parseInt(month, 10);
    day = parseInt(day, 10);

    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  } catch (error) {
    console.error("Invalid date format:", dateString);
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
        date: formatDate(selectedEvent.date),
        startTime: formatTime(selectedEvent.time.startTime),
        endTime: formatTime(selectedEvent.time.endTime),
        deposit: selectedEvent.deposit,
        total: selectedEvent.total,
        referencePhotos: selectedEvent.referencePhotos,
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

  const handleUpdateTimeChange = () => {
    const start = new Date(`1970-01-01T${updatedData.startTime}Z`);
    const end = new Date(`1970-01-01T${updatedData.endTime}Z`);
    const duration = (end - start) / 1000 / 60 / 60;
  
    if (updatedData.artistId) {
      const artist = artists.find((artist) => artist._id === updatedData.artistId);
      if (artist && duration > 0) {
        const total = artist.hourlyRate * duration - updatedData.deposit;
        setUpdatedData((prevData) => ({
          ...prevData,
          total: total >= 0 ? total : 0,
        }));
      }
    }
    console.log("Deposits:", updatedData.deposit);
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

  // Delete appointment functions
  const handleDeleteAppointment = () => {
    if (!selectedEvent) return;
  
    setDeleteInfo({
      id: selectedEvent.id,
      artistId: selectedEvent.artistId,
    });
  
    setIsConfirmModalOpen(true);
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

  // Artist functions
  const fetchArtists = async (setArtists) => {
    try {
      const response = await axios.get("/api/artists");
      console.log("Fetched artists:", response.data);
      setArtists(response.data);
    } catch (error) {
      console.error("Error fetching artists:", error);
    }
  };

  useEffect(() => {
    fetchArtists(setArtists);
  }, []);

  const handleAddNewArtist = async (e) => {
    e.preventDefault();
  
    try {
      let profilePictureUrl = null; // Default to null instead of an empty string
  
      // Upload profile picture if a file is selected
      if (newArtist.profilePicture) {
        const fileData = new FormData();
        fileData.append("file", newArtist.profilePicture);
        fileData.append("upload_preset", "my_unsigned_preset");
        fileData.append("folder", `InkIvory/Artists/${newArtist.name}`);
  
        console.log("Uploading to Cloudinary folder:", `InkIvory/Artists/${newArtist.name}`);
  
        try {
          const response = await axios.post(
            "https://api.cloudinary.com/v1_1/dwp2h5cak/image/upload",
            fileData
          );
          profilePictureUrl = response.data.secure_url;
        } catch (uploadError) {
          console.error("🔥 Error uploading profile picture to Cloudinary:", uploadError);
          return; // Stop execution if upload fails
        }
      }
  
      // Create new artist data (only include profilePic if it's uploaded)
      const requestData = {
        ...newArtist,
        ...(profilePictureUrl && { profilePic: profilePictureUrl }), // Only add if it's not null
      };
  
      // Send artist data to backend
      const response = await axios.post("/api/artists", requestData);
      console.log("✅ New artist created:", response.data);
  
      // Reset form and close modal
      setNewArtist({});
      setIsAddArtistModalOpen(false);
      fetchArtists(setArtists);
    } catch (error) {
      console.error("🔥 Error creating new artist:", error);
    }
  };    

  const handleAddArtist = () => {
    setIsAddArtistModalOpen(true);
  };

  const handleNewArtistChange = (e) => {
    const { name, value } = e.target;
    setNewArtist({ ...newArtist, [name]: value });
  };

  const handleAddService = () => {
    setNewArtist((prev) => ({
      ...prev,
      services: [...prev.services, ""], // Add an empty string as a new service field
    }));
  };
  
  const handleServiceChange = (index, value) => {
    const updatedServices = [...newArtist.services];
    updatedServices[index] = value;
    setNewArtist((prev) => ({ ...prev, services: updatedServices }));
  };
  
  const handleRemoveService = (index) => {
    const updatedServices = newArtist.services.filter((_, i) => i !== index);
    setNewArtist((prev) => ({ ...prev, services: updatedServices }));
  };

  const openDeleteArtistModal = () => {
    setDeleteArtistModal(true);
  };

  const handleDeleteArtist = () => {
    if (!selectedArtist) return;
    setIsConfirmArtistModalOpen(true);
  };

  const confirmDeleteArtist = async () => {
    if (!selectedArtist) return;

    try {
      await axios.delete(`/api/artists/${selectedArtist}`);
      fetchArtists(setArtists);
    } catch (error) {
      console.error("Error deleting artist:", error);
    }
  };

  // Time-off functions
  const handleSubmitTimeOff = async (e) => {
    e.preventDefault(); // Prevent page reload
  
    // Validate the form data
    if (!timeOffData.reason || !timeOffData.start[0].date || !timeOffData.start[0].startTime || 
        !timeOffData.end[0].date || !timeOffData.end[0].endTime) {
      alert("Please fill in all required fields.");
      return;
    }

    const timeOffRequest = {
      start: {
        date: timeOffData.start[0].date,
        startTime: timeOffData.start[0].startTime,
      },
      end: {
        date: timeOffData.end[0].date,
        endTime: timeOffData.end[0].endTime,
      },
      reason: timeOffData.reason,
    };
  
    try {
      // Send data to the backend API (replace with your API endpoint)
      const response = await axios.post(`/api/time-off/${selectedArtistForTimeOff.id}`, timeOffRequest);
  
      // Handle successful response
      if (response.status === 201) {
        setIsTimeOffModalOpen(false); // Close the modal
        setTimeOffData({
          start: [{ date: "", startTime: "" }],
          end: [{ date: "", endTime: "" }],
          reason: "",
        }); // Clear the form
      }
    } catch (error) {
      console.error("Error submitting time-off request:", error);
      alert("There was an error submitting your request. Please try again.");
    }
  };

  useEffect(() => {
    const fetchTimeOffRequests = async () => {
      try {
        const response = await axios.get("/api/time-off");
        console.log("Fetched time-off requests:", response.data);
        
        const formattedEvents = response.data.map((request) => ({
          id: request._id,
          title: `${request.reason} - ${request.artist.name}`, 
          start: new Date(request.start.date + "T" + request.start.startTime),
          end: new Date(request.end.date + "T" + request.end.endTime),
          classNames: ["time-off-event"], // ✅ Add custom class here
        }));
  
        setTimeOffEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching time-off requests:", error);
      }
    };
  
    fetchTimeOffRequests();
  }, []);
  

  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const endOfWeek = new Date();
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const currentWeekTimeOffEvents = timeOffEvents.filter((event) => {
    const eventStart = new Date(event.start);
    return eventStart >= startOfWeek && eventStart <= endOfWeek;
  });

  // Gallery Upload
  const handleUploadComplete = (urls) => {
    setGalleryImages((prevImages) => [...prevImages, ...urls]);
  };

  return (
    <div className="page-container">
      
      <div className="left-side">
      <div className="todays-appointments">
        <h2>Today's Appointments</h2>
          {events.filter((event) => {
            const today = new Date();
            const eventDate = new Date(event.start);
            return eventDate.getDate() === today.getDate() &&
                  eventDate.getMonth() === today.getMonth() &&
                  eventDate.getFullYear() === today.getFullYear();
          }).length === 0 ? (
            <p>No appointments today.</p>
          ) : (
            events
              .filter((event) => {
                const today = new Date();
                const eventDate = new Date(event.start);
                return eventDate.getDate() === today.getDate() &&
                      eventDate.getMonth() === today.getMonth() &&
                      eventDate.getFullYear() === today.getFullYear();
              })
              .map((event) => (
                <div key={event.id} className="appointment-block">
                  <strong>{event.title}</strong> with {event.artist}
                  <br />
                  {new Date(event.start).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })} -{" "}
                  {new Date(event.end).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })}
                </div>
              ))
          )}
        </div>
        <div className="todays-appointments">
          <h2>Time Off Requests</h2>
          {currentWeekTimeOffEvents.length > 0 ? (
            currentWeekTimeOffEvents.map((event) => {
              const start = new Date(event.start);
              const end = new Date(event.end);

              const sameDay =
                start.toLocaleDateString() === end.toLocaleDateString();

              return (
                <div key={event.id} className="appointment-block">
                  <strong>{event.title}</strong>
                  <br />
                  {sameDay ? (
                    <>
                      {start.toLocaleDateString()}{" "}
                      {start.toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}{" "}
                      -{" "}
                      {end.toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </>
                  ) : (
                    <>
                      {start.toLocaleDateString()} - {end.toLocaleDateString()}
                    </>
                  )}
                </div>
              );
            })
          ) : (
            <p>No time off requests this week.</p>
          )}
        </div>
      </div>

      <div className="fullcalendar-container">
        <div className="calendar-header">
          <h1 className="calendar-title">My Calendar</h1>
        </div>

        {/* <div>
          <label>Sort by Artist:</label>
          <select value={selectedArtistForSort} onChange={(e) => setSelectedArtistForSort(e.target.value)}>
            <option value="">All Artists</option>
            {artists.map((artist) => (
              <option key={artist._id} value={artist._id}>
                {artist.name}
              </option>
            ))}
          </select>
        </div> */}

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventOverlap={false} // ✅ Allow overlapping events
          slotEventOverlap={false} // ✅ Allow slot-based overlap
          eventOrder="-end" // ✅ Order events by start time
          dayMaxEventRows={3} // ✅ Limit number of events per day
          eventColor="#3788d8"
          eventTextColor="#fff"
          dateClick={handleDateClick} // Handles clicking on an empty date
          eventClick={handleEventClick} // Handles clicking on an event
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          // viewDidMount={(arg) => handleViewChange(arg.view)} // Detect initial view on load
          // datesSet={(arg) => handleViewChange(arg.view)} // Detect when user changes view
          slotMinTime="08:00:00"
          slotMaxTime="21:00:00"
          allDaySlot={false}
          dayCellClassNames={({ date }) =>
          isClosedDay(date) ? "closed-day" : ""
          }
          eventContent={(eventInfo) => {
            const { title, backgroundColor } = eventInfo.event;
            return (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                <span
                  className= "event-bubble"
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: backgroundColor || "#3788d8",
                    borderRadius: "50%",
                    marginRight: "5px",
                    marginLeft: "5px",
                    // border: ".5px solid #000",
                  }}
                />
                <span>{title}</span>
              </div>
            );
          }}
        />
    
        <Modal show={showModal} onClose={handleCloseModal}>
          <h2>Create Appointment for {selectedDate}</h2>
          <form onSubmit={handleSubmit}>
            <div>
              {/* <label>Name</label> */}
              <input className="full" type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>

            <div className="stack">
                {/* <label>Email</label> */}
                <input className="half" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              </div>
              <div>
                {/* <label>Phone</label> */}
                <input className="half" type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
              </div>
            </div>

            <div className="stack">
              <div>
                {/* <label>Artist</label> */}
                <select className="full" name="artistId" value={formData.artistId} onChange={handleChange} required>
                  <option value="">Select Artist</option>
                  {artists.map((artist) => (
                    <option key={artist._id} value={artist._id}>
                      {artist.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                {/* <label>Type</label> */}
                <select className="full" name="type" value={formData.type} onChange={handleChange}>
                  <option value="Tattoo">Tattoo</option>
                  <option value="Piercing">Piercing</option>
                  <option value="Consult">Consult</option>
                </select>
              </div>
            </div>

            <div>
              {/* <label>Location</label> */}
              <input className="full" type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
            </div>
            <div>
              <label>Start Time</label>
              <input type="time" name="startTime" placeholder="Start Time" value={formData.startTime} onChange={handleChange} required onBlur={handleTimeChange} />
            </div>
            <div>
              <label>End Time</label>
              <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required onBlur={handleTimeChange} />
            </div>
            <div className="stack">      
              <div>
                <label>Deposit</label>
                <input type="number" name="deposit" value={formData.deposit} onChange={handleChange} required onBlur={handleTimeChange} />
              </div>
              <div>
                <label>Total</label>
                <input type="number" name="total" value={formData.total} readOnly onBlur={handleTimeChange}/>
              </div>
            </div> 

              <label>Reference Photos</label>
                <CloudinaryUploader className="full" onFilesSelected={handleFilesSelected} />
              <label>Additional Details</label>
            <div>
              <textarea className="full" name="additionalDetails" value={formData.additionalDetails} onChange={handleChange} />
            </div>
            {/* <div className="stack">
              <div>
                <input type="checkbox" name="textReminder" checked={formData.textReminder} onChange={(e) =>
                    setFormData({ ...formData, textReminder: e.target.checked })
                  } />
                <label>
                  Text Reminder
                </label>
              </div>
              <div>
                <input type="checkbox" name="emailReminder" checked={formData.emailReminder} onChange={(e) =>
                  setFormData({ ...formData, emailReminder: e.target.checked })
                } />
                <label>
                  Email Reminder
                </label>
              </div>
            </div> */}
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
                    <select name="artistId" value={updatedData.artistId} onChange={handleInputChange} required disabled>
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
                    <label>Date</label>
                    <input type="date" name="date" value={updatedData.date} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <label>Start Time</label>
                    <input type="time" name="startTime" value={updatedData.startTime} onChange={handleInputChange} required onBlur={handleUpdateTimeChange}/>
                  </div>
                  <div>
                    <label>End Time</label>
                    <input type="time" name="endTime" value={updatedData.endTime} onChange={handleInputChange} required onBlur={handleUpdateTimeChange}/>
                  </div>
                  <div>
                    <label>Deposit</label>
                    <input type="number" name="deposit" value={updatedData.deposit} onChange={handleInputChange} required onBlur={handleUpdateTimeChange} />
                  </div>
                  <div>
                    <label>Total</label>
                    <input type="number" name="total" value={updatedData.total} readOnly onBlur={handleUpdateTimeChange}/>
                  </div>
                  {/* <div>
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
                  </div> */}
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
                      <img key={index} src={photo} alt={`Reference ${index + 1}`} className= "preview"/>
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

        {isAddArtistModalOpen && (
          <Modal show={isAddArtistModalOpen} onClose={() => setIsAddArtistModalOpen(false)}>
            <div>
              <h2>Add Artist</h2>
              <form onSubmit={handleAddArtist}>
                <div>
                  <label>Name</label>
                  <input type="text" name="name" value={newArtist.name} onChange={handleNewArtistChange} required />
                </div>
                
                <div>
                  <label>Services</label>
                  {newArtist.services.map((service, index) => (
                    <div key={index} className="service-field">
                      <input
                        type="text"
                        value={service}
                        onChange={(e) => handleServiceChange(index, e.target.value)}
                        required
                      />
                      <button type="button" onClick={() => handleRemoveService(index)}>✖</button>
                    </div>
                  ))}
                  <button type="button" onClick={handleAddService}>Add Service</button>
                </div>

                <div>
                  <label>Portfolio</label>
                  <input type="text" name="portfolio" value={newArtist.portfolio} onChange={handleNewArtistChange} required />
                </div>
                <div>
                  <label>Profile Picture</label>
                  <CloudinaryUploader onChange={(e) => setNewArtist({ ...newArtist, profilePicture: e.target.files[0] })} />
                </div>
                <div>
                  <label>Hourly Rate</label>
                  <input type="number" name="hourlyRate" value={newArtist.hourlyRate} onChange={handleNewArtistChange} required />
                </div>

                <button type="submit" onClick={handleAddNewArtist}>Add Artist</button>
              </form>
            </div>
          </Modal>
        )}

        <Modal show={deleteArtistModal} onClose={() => setDeleteArtistModal(false)}>
          <h2>Delete Artist</h2>
          {artists.map((artist) => (
            <div key={artist._id} className="artist-key-info">
              <span><strong>{artist.name}</strong></span>
              <button onClick={() => {
                setSelectedArtist(artist._id);
                handleDeleteArtist();
                console.log("Selected artist:", artist);
              }}>
                Select
              </button>
            </div>
          ))}
        </Modal>

        {isConfirmArtistModalOpen && (
          <Modal show={isConfirmArtistModalOpen} onClose={() => setIsConfirmArtistModalOpen(false)}>
            <div>
              <h2>Confirm Deletion</h2>
              <p>Are you sure you want to delete this artist?</p>
              <div>
                <button onClick={confirmDeleteArtist} style={{ marginRight: "10px", background: "red", color: "white" }}>
                  Yes, Delete
                </button>
                <button onClick={() => setIsConfirmArtistModalOpen(false)}>Cancel</button>
              </div>
            </div>
          </Modal>
        )}

        {isTimeOffModalOpen && (
          <Modal show={isTimeOffModalOpen} onClose={() => setIsTimeOffModalOpen(false)}>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Request Time Off</h2>
                <p className="text-sm text-gray-600">For Artist: {selectedArtistForTimeOff.name}</p>

                <form onSubmit={handleSubmitTimeOff} className="space-y-4 form">
                  <input 
                    type="text" 
                    name="reason" 
                    placeholder="Reason for Time Off" 
                    value={timeOffData.reason} 
                    onChange={(e) => setTimeOffData({ ...timeOffData, reason: e.target.value })} 
                    required 
                    className="w-full p-2 border rounded" 
                  />

                  {/* Start Date & Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input 
                      type="date" 
                      value={timeOffData.start[0].date} 
                      onChange={(e) => {
                        const updatedStart = [...timeOffData.start];
                        updatedStart[0].date = e.target.value;
                        setTimeOffData({ ...timeOffData, start: updatedStart });
                      }} 
                      required 
                      className="w-full p-2 border rounded" 
                    />
                  </div>

                  <div className="flex gap-2">
                    <input 
                      type="time" 
                      value={timeOffData.start[0].startTime} 
                      onChange={(e) => {
                        const updatedStart = [...timeOffData.start];
                        updatedStart[0].startTime = e.target.value;
                        setTimeOffData({ ...timeOffData, start: updatedStart });
                      }} 
                      required 
                      className="w-1/2 p-2 border rounded" 
                    />
                  </div>

                  {/* End Date & Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <input 
                      type="date" 
                      value={timeOffData.end[0].date} 
                      onChange={(e) => {
                        const updatedEnd = [...timeOffData.end];
                        updatedEnd[0].date = e.target.value;
                        setTimeOffData({ ...timeOffData, end: updatedEnd });
                      }} 
                      required 
                      className="w-full p-2 border rounded" 
                    />
                  </div>

                  <div className="flex gap-2">
                    <input 
                      type="time" 
                      value={timeOffData.end[0].endTime} 
                      onChange={(e) => {
                        const updatedEnd = [...timeOffData.end];
                        updatedEnd[0].endTime = e.target.value;
                        setTimeOffData({ ...timeOffData, end: updatedEnd });
                      }} 
                      required 
                      className="w-1/2 p-2 border rounded" 
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
                  >
                    Request Time Off
                  </button>
                </form>
              </div>
            </div>
          </Modal>
        )}

        {isClosedModalOpen && (
          <Modal show={isClosedModalOpen} onClose={() => setIsClosedModalOpen(false)}>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold text-red-600 mb-4">Shop Closed</h2>
                <p className="text-sm text-gray-600">
                  ❌ The shop is closed on <strong>{closedDate}</strong> ❌
                </p>
                
                {/* <button
                  onClick={() => setIsClosedModalOpen(false)}
                  className="mt-4 w-full bg-gray-300 text-gray-700 p-2 rounded-lg hover:bg-gray-400"
                >
                  OK
                </button> */}
              </div>
            </div>
          </Modal>
        )}

        <div className="gallery-uploader">
          <h2>Gallery Upload</h2>
          <GalleryUpload onUploadComplete={handleUploadComplete} />
        </div>
      </div>

      <div className="right-side">
        <div className="artist-key-container">
          <h2>Artist Key</h2>
          <div className="artist-key">
            {artists.map((artist) => (
              <div key={artist._id} className="artist-key-info">
                <span><strong>{artist.name}</strong></span> -
                <span> ${artist.hourlyRate}</span>
                <div 
                  className="artist-color artist-buttons" 
                  style={{ backgroundColor: artist.appointmentColor}} 
                />
                <button 
                  onClick={() => {
                    setIsTimeOffModalOpen(true); // Open modal
                    setSelectedArtistForTimeOff({ id: artist._id, name: artist.name }); // Store both ID & Name
                  }}
                >
                  Request Time Off
                </button>
              </div>
            ))}
          </div>
          <div className="artist-buttons">
            <button onClick={handleAddArtist}>Add Artist</button>
            <button onClick={openDeleteArtistModal}>Delete Artist</button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default FullCalendarPage;