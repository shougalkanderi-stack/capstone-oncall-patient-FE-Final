import instance from ".";

// Get all bookings (admin)
export const getAllBookings = async () => {
  const { data } = await instance.get("/bookings");
  return data;
};

// Get bookings for logged-in patient
export const getPatientBookings = async () => {
  try {
    const { data } = await instance.get("/bookings");
    console.log("Patient bookings:", data);
    return data;
  } catch (error) {
    console.error("Error fetching patient bookings:", error);
    return [];
  }
};

// Get bookings for logged-in healthcare provider
export const getProviderBookings = async () => {
  const { data } = await instance.get("/bookings/provider");
  return data;
};

// Create a booking (for a doctor/provider)
export const createBooking = async (serviceProviderId: string, bookingData: any) => {
  console.log("Creating booking for provider:", serviceProviderId, "with data:", bookingData);
  const { data } = await instance.post(`/bookings/${serviceProviderId}`, bookingData);
  return data;
};

// Update booking date
export const updateBookingDate = async (bookingId: string, date: string) => {
  const { data } = await instance.put(`/bookings/${bookingId}/date`, { date });
  return data;
};

// Update booking time
export const updateBookingTime = async (bookingId: string, time: string) => {
  const { data } = await instance.put(`/bookings/${bookingId}/time`, { time });
  return data;
};

// Update booking status
export const updateBookingStatus = async (bookingId: string, status: string) => {
  const { data } = await instance.put(`/bookings/${bookingId}/status`, { status });
  return data;
};

// Delete booking
export const deleteBooking = async (bookingId: string) => {
  const { data } = await instance.delete(`/bookings/${bookingId}`);
  return data;
};

export const bookAppointment = async (appointmentData: any) => {
  const { doctorID, ...rest } = appointmentData;
  return await instance.post(`/appointments/${doctorID}`, rest);
};
