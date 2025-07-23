import instance from ".";

// Get all dependents
export const getDependents = async () => {
  const { data } = await instance.get("/dependents");
  console.log("Dependents:", data);
  return data;
};

// Add a new dependent

export const addDependent = async (dependent: any) => {
  const { data } = await instance.post("/dependents", dependent);
  console.log("Creating dependent with:", dependent);
  return data;
};

// Update a dependent
export const updateDependent = async (id: string, updates: any) => {
  const { data } = await instance.put(`/dependents/${id}`, updates);
  return data;
};

// Delete a dependent
export const deleteDependent = async (id: string) => {
  const { data } = await instance.delete(`/dependents/${id}`);
  return data;
}; 