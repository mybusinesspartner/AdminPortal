import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SupportTicket, TicketComment } from '../models/support-ticket.model';

@Injectable({
  providedIn: 'root'
})
export class SupportTicketService {
  private mockTickets: SupportTicket[] = [
    {
      id: 'ticket-001',
      userId: 'user-001',
      userName: 'John Doe',
      userEmail: 'john.doe@example.com',
      subject: 'Unable to upload document',
      description: 'I am having trouble uploading my marksheet. The upload button is not working.',
      category: 'Documentation Upload',
      businessType: 'Corporate Business',
      status: 'open',
      createdAt: new Date('2024-01-20T10:00:00'),
      updatedAt: new Date('2024-01-20T10:00:00'),
      comments: []
    },
    {
      id: 'ticket-002',
      userId: 'user-002',
      userName: 'Jane Smith',
      userEmail: 'jane.smith@example.com',
      subject: 'Verification status inquiry',
      description: 'I submitted my documents 3 days ago but haven\'t received any update on my verification status.',
      category: 'Getting Started',
      businessType: 'Local Business',
      status: 'in_progress',
      createdAt: new Date('2024-01-18T14:30:00'),
      updatedAt: new Date('2024-01-19T09:15:00'),
      comments: [
        {
          id: 'comment-001',
          ticketId: 'ticket-002',
          author: 'Admin User',
          authorRole: 'admin',
          message: 'We are currently reviewing your documents. You will receive an update within 24 hours.',
          createdAt: new Date('2024-01-19T09:15:00')
        }
      ]
    },
    {
      id: 'ticket-003',
      userId: 'user-003',
      userName: 'Bob Johnson',
      userEmail: 'bob.johnson@example.com',
      subject: 'Payment issue',
      description: 'I was charged twice for the verification fee. Please refund the duplicate charge.',
      category: 'Billing and Subscription',
      businessType: 'Corporate Business',
      status: 'open',
      createdAt: new Date('2024-01-21T08:00:00'),
      updatedAt: new Date('2024-01-21T08:00:00'),
      comments: []
    },
    {
      id: 'ticket-004',
      userId: 'user-004',
      userName: 'Alice Williams',
      userEmail: 'alice.williams@example.com',
      subject: 'Document rejected - need clarification',
      description: 'My document was rejected but I don\'t understand the reason. Can someone explain?',
      category: 'Documentation Upload',
      businessType: 'Local Business',
      status: 'resolved',
      createdAt: new Date('2024-01-15T11:20:00'),
      updatedAt: new Date('2024-01-16T15:30:00'),
      resolvedAt: new Date('2024-01-16T15:30:00'),
      resolvedBy: 'admin-001',
      comments: [
        {
          id: 'comment-002',
          ticketId: 'ticket-004',
          author: 'Admin User',
          authorRole: 'admin',
          message: 'Your document was rejected because the image quality was too low. Please upload a clearer, high-resolution image of your marksheet.',
          createdAt: new Date('2024-01-16T15:30:00')
        }
      ]
    },
    {
      id: 'ticket-005',
      userId: 'user-005',
      userName: 'Charlie Brown',
      userEmail: 'charlie.brown@example.com',
      subject: 'Account access problem',
      description: 'I forgot my password and the reset link is not working.',
      category: 'Forgot Password',
      businessType: 'Corporate Business',
      status: 'in_progress',
      createdAt: new Date('2024-01-19T16:45:00'),
      updatedAt: new Date('2024-01-20T10:00:00'),
      comments: [
        {
          id: 'comment-003',
          ticketId: 'ticket-005',
          author: 'Admin User',
          authorRole: 'admin',
          message: 'I have reset your password. Please check your email for the new temporary password.',
          createdAt: new Date('2024-01-20T10:00:00')
        }
      ]
    },
    {
      id: 'ticket-006',
      userId: 'user-006',
      userName: 'David Wilson',
      userEmail: 'david.wilson@example.com',
      subject: 'Feature request',
      description: 'It would be great if we could track the status of our verification in real-time.',
      category: 'Feedback and Suggestions',
      businessType: 'Local Business',
      status: 'closed',
      createdAt: new Date('2024-01-10T09:00:00'),
      updatedAt: new Date('2024-01-12T14:00:00'),
      resolvedAt: new Date('2024-01-12T14:00:00'),
      resolvedBy: 'admin-001',
      comments: [
        {
          id: 'comment-004',
          ticketId: 'ticket-006',
          author: 'Admin User',
          authorRole: 'admin',
          message: 'Thank you for your suggestion. We have added this feature to our roadmap.',
          createdAt: new Date('2024-01-12T14:00:00')
        }
      ]
    }
  ];

  getTickets(status?: 'open' | 'in_progress' | 'resolved' | 'closed'): Observable<SupportTicket[]> {
    let tickets = [...this.mockTickets];
    if (status) {
      tickets = tickets.filter(t => t.status === status);
    }
    return of(tickets).pipe(delay(300));
  }

  getTicketById(id: string): Observable<SupportTicket | undefined> {
    const ticket = this.mockTickets.find(t => t.id === id);
    return of(ticket).pipe(delay(200));
  }

  updateTicketStatus(id: string, status: 'open' | 'in_progress' | 'resolved' | 'closed'): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        const ticket = this.mockTickets.find(t => t.id === id);
        if (ticket) {
          ticket.status = status;
          ticket.updatedAt = new Date();
          if (status === 'resolved' || status === 'closed') {
            ticket.resolvedAt = new Date();
            ticket.resolvedBy = 'admin-001';
          }
        }
        observer.next(true);
        observer.complete();
      }, 500);
    });
  }

  addComment(ticketId: string, message: string): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        const ticket = this.mockTickets.find(t => t.id === ticketId);
        if (ticket) {
          if (!ticket.comments) {
            ticket.comments = [];
          }
          const comment: TicketComment = {
            id: 'comment-' + Date.now(),
            ticketId: ticketId,
            author: 'Admin User',
            authorRole: 'admin',
            message: message,
            createdAt: new Date()
          };
          ticket.comments.push(comment);
          ticket.updatedAt = new Date();
        }
        observer.next(true);
        observer.complete();
      }, 500);
    });
  }

  getTicketCounts(): Observable<{ open: number; in_progress: number; resolved: number; closed: number; total: number }> {
    const open = this.mockTickets.filter(t => t.status === 'open').length;
    const in_progress = this.mockTickets.filter(t => t.status === 'in_progress').length;
    const resolved = this.mockTickets.filter(t => t.status === 'resolved').length;
    const closed = this.mockTickets.filter(t => t.status === 'closed').length;
    const total = this.mockTickets.length;

    return of({ open, in_progress, resolved, closed, total }).pipe(delay(200));
  }
}

