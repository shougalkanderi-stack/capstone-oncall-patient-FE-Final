import instance from ".";

// Get all providers (doctor, nurse, lab, etc.)
export const getAllProviders = async () => {
  const { data } = await instance.get("/api/providers/");
  console.log("all providers:", data)
  return data;
};

// Get doctor by ID
export const getDoctorById = async (doctorId: string) => {
  try {
    const { data } = await instance.get(`/doctors/${doctorId}`);
    return data;
  } catch (error) {
    console.error("Error fetching doctor:", error);
    throw error;
  }
};

// Get doctors by specialization
export const getDoctorsBySpecialization = async (specialization: string) => {
  try {
    const { data } = await instance.get(`/doctors/specialization/${specialization}`);
    return data;
  } catch (error) {
    console.error("Error fetching doctors by specialization:", error);
    throw error;
  }
}; 