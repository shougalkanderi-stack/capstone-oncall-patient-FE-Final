const BASE_URL = " http://localhost:5500"; // Replace with your backend URL

export async function apiRequest(
  endpoint: string,
  method: string,
  body?: any,
  isFormData = false,
  token?: string
) {
  const headers: any = {};
  if (!isFormData) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const options: any = {
    method,
    headers,
  };

  if (body) {
    options.body = isFormData ? body : JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "API Error");
  return data;
}
