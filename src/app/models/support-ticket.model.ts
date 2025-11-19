export type TicketCategory = 
  | 'Getting Started'
  | 'Billing and Subscription'
  | 'Messaging and Communication'
  | 'Privacy and Security'
  | 'Safety'
  | 'Success Stories and Testimonials'
  | 'Feedback and Suggestions'
  | 'Forgot Password'
  | 'Documentation Upload'
  | 'Technical Issue'
  | 'Others';

export type BusinessType = 'Corporate Business' | 'Local Business';

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  description: string;
  category: TicketCategory;
  businessType: BusinessType;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
  comments?: TicketComment[];
}

export interface TicketComment {
  id: string;
  ticketId: string;
  author: string;
  authorRole: 'admin' | 'user';
  message: string;
  createdAt: Date;
}

