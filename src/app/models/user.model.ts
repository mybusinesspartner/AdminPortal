export type BusinessType = 'Corporate Business' | 'Local Business';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  collegeName: string;
  yearOfPassout: number;
  businessType: BusinessType;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  documentUrl: string;
  remarks?: string;
}

export interface VerificationRequest {
  id: string;
  user: User;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  remarks?: string;
}

