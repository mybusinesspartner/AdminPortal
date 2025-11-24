export type SupportType = 'General Inquiry' | 'Support' | 'Feedback' | 'Other';

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  supportType: SupportType;
  createdAt: Date;
  operation?: string; // undefined or null means no operation performed
  operatedAt?: Date;
  operatedBy?: string;
}

