export interface AuthResponse {
  token?: string;
  user?: any;
  message?: string;
}

export interface PatientInfo {
  name: string;
  email: string;
  phone: string;
  civilID: string;
  password: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransactionRequest {
  amount: number;
  username?: string;
}
