import instance from ".";

// ✅ Book a new appointment
export const bookAppointment = async (appointmentData: {
  doctorID: string;
  date: Date;
  time: string;
  type: string;
  duration: number;
  notes?: string;
}) => {
  try {
    const { doctorID, date, time, type, duration, notes } = appointmentData;

    console.log("Booking appointment:", { doctorID, date, time, type, duration });

    const { data } = await instance.post(`/appointments/create/${doctorID}`, {
      date: date,
      time: time,
      type: type,
      duration: duration,
      providerType: "doctor", // 🔁 required by backend to distinguish lab/physio/doctor
    });

    console.log("Booking response:", data);
    return data;
  } catch (error: any) {
    console.error("Book appointment error details:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      },
    });

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to book appointment";

    throw new Error(errorMessage);
  }
};

// ✅ Get patient’s own appointments
export const getMyAppointments = async () => {
  try {
    const { data } = await instance.get("/appointments/patient");
    console.log("✅ Raw response:", data);
    console.log("✅ Appointments count:", data?.Appointments?.length || 0);
    
    // Return the data as is, let the component handle the structure
    return data;
  } catch (error: any) {
    console.error("Get appointments error:", error);
    return [];
  }
};

// ⛔ Placeholder — update backend to implement this endpoint later
export const getAvailableDoctors = async () => {
  try {
    console.log("Note: /doctors/available endpoint not implemented yet");
    return [];
  } catch (error: any) {
    console.error("Get doctors error:", error);
    return [];
  }
};

// ✅ Cancel an appointment
export const cancelAppointment = async (appointmentId: string) => {
  try {
    const { data } = await instance.delete(`/appointments/${appointmentId}`);
    console.log("Appointment cancelled:", data);
    return data;
  } catch (error: any) {
    console.error("Cancel appointment error:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to cancel appointment";
    throw new Error(errorMessage);
  }
};

// ⛔ Placeholder — update backend to implement this endpoint later
export const getAppointmentDetails = async (appointmentId: string) => {
  try {
    console.log("Note: Get appointment details endpoint not implemented yet");
    return null;
  } catch (error: any) {
    console.error("Get appointment details error:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to fetch appointment details";
    throw new Error(errorMessage);
  }
};

// ⛔ Placeholder — update backend to implement this endpoint later
export const getDoctorSlots = async (doctorID: string, date: string) => {
  try {
    console.log("Note: Get doctor slots endpoint not implemented yet");
    return [];
  } catch (error: any) {
    console.error("Get doctor slots error:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to fetch available slots";
    throw new Error(errorMessage);
  }
};
