import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ContactRequest } from '../models/contact-request.model';

@Injectable({
  providedIn: 'root'
})
export class ContactRequestService {
  private mockContactRequests: ContactRequest[] = [
    {
      id: 'contact-001',
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      phone: '+1-555-0101',
      subject: 'General Inquiry',
      message: 'I would like to know more about your services and pricing options.',
      supportType: 'General Inquiry',
      createdAt: new Date('2024-01-22T09:00:00')
    },
    {
      id: 'contact-002',
      name: 'Bob Williams',
      email: 'bob.williams@example.com',
      phone: '+1-555-0102',
      subject: 'Partnership Opportunity',
      message: 'We are interested in partnering with your platform. Can we schedule a call?',
      supportType: 'General Inquiry',
      createdAt: new Date('2024-01-21T14:30:00')
    },
    {
      id: 'contact-003',
      name: 'Carol Davis',
      email: 'carol.davis@example.com',
      subject: 'Feature Request',
      message: 'It would be great if you could add bulk upload functionality for documents.',
      supportType: 'Feedback',
      createdAt: new Date('2024-01-20T11:15:00'),
      operation: 'responded',
      operatedAt: new Date('2024-01-20T15:30:00'),
      operatedBy: 'admin-001'
    },
    {
      id: 'contact-004',
      name: 'David Miller',
      email: 'david.miller@example.com',
      phone: '+1-555-0104',
      subject: 'Account Issue',
      message: 'I am unable to access my account. Please help me recover it.',
      supportType: 'Support',
      createdAt: new Date('2024-01-19T16:45:00')
    },
    {
      id: 'contact-005',
      name: 'Emma Brown',
      email: 'emma.brown@example.com',
      phone: '+1-555-0105',
      subject: 'Billing Question',
      message: 'I have a question about my recent invoice. Can someone contact me?',
      supportType: 'Support',
      createdAt: new Date('2024-01-18T10:20:00'),
      operation: 'resolved',
      operatedAt: new Date('2024-01-18T14:00:00'),
      operatedBy: 'admin-002'
    },
    {
      id: 'contact-006',
      name: 'Frank Wilson',
      email: 'frank.wilson@example.com',
      subject: 'Technical Support',
      message: 'The mobile app is crashing when I try to upload photos. Please fix this issue.',
      supportType: 'Support',
      createdAt: new Date('2024-01-17T13:10:00')
    },
    {
      id: 'contact-007',
      name: 'Grace Lee',
      email: 'grace.lee@example.com',
      phone: '+1-555-0107',
      subject: 'Feedback',
      message: 'I love the new update! The UI is much cleaner now.',
      supportType: 'Feedback',
      createdAt: new Date('2024-01-16T08:30:00'),
      operation: 'acknowledged',
      operatedAt: new Date('2024-01-16T09:00:00'),
      operatedBy: 'admin-001'
    },
    {
      id: 'contact-008',
      name: 'Henry Taylor',
      email: 'henry.taylor@example.com',
      phone: '+1-555-0108',
      subject: 'Registration Help',
      message: 'I am having trouble completing my registration. The form keeps showing errors.',
      supportType: 'Support',
      createdAt: new Date('2024-01-15T12:00:00')
    },
    {
      id: 'contact-009',
      name: 'Iris Martinez',
      email: 'iris.martinez@example.com',
      phone: '+1-555-0109',
      subject: 'Custom Request',
      message: 'I have a unique situation that doesn\'t fit into the standard categories.',
      supportType: 'Other',
      createdAt: new Date('2024-01-14T10:00:00')
    }
  ];

  getContactRequests(noOperationOnly: boolean = false): Observable<ContactRequest[]> {
    let requests = [...this.mockContactRequests];
    
    if (noOperationOnly) {
      requests = requests.filter(request => !request.operation);
    } else {
      // If false, return all requests
      requests = requests;
    }
    
    // Sort by creation date, most recent first
    requests.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return of(requests).pipe(delay(300));
  }

  getResolvedContactRequests(): Observable<ContactRequest[]> {
    let requests = [...this.mockContactRequests];
    
    // Filter only requests with operation === 'resolved' (exclude 'acknowledged', 'responded', etc.)
    requests = requests.filter(request => request.operation === 'resolved');
    
    // Sort by operation date, most recent first
    requests.sort((a, b) => {
      const dateA = a.operatedAt?.getTime() || 0;
      const dateB = b.operatedAt?.getTime() || 0;
      return dateB - dateA;
    });
    
    return of(requests).pipe(delay(300));
  }

  getContactRequestById(id: string): Observable<ContactRequest | undefined> {
    const request = this.mockContactRequests.find(r => r.id === id);
    return of(request).pipe(delay(200));
  }

  updateContactRequest(id: string, operation: string, operatedBy: string): Observable<ContactRequest> {
    const request = this.mockContactRequests.find(r => r.id === id);
    if (request) {
      request.operation = operation;
      request.operatedAt = new Date();
      request.operatedBy = operatedBy;
    }
    return of(request!).pipe(delay(200));
  }

  removeOperation(id: string): Observable<ContactRequest> {
    const request = this.mockContactRequests.find(r => r.id === id);
    if (request) {
      request.operation = undefined;
      request.operatedAt = undefined;
      request.operatedBy = undefined;
    }
    return of(request!).pipe(delay(200));
  }

  getContactRequestCounts(): Observable<{ total: number; noOperation: number; resolved: number }> {
    const total = this.mockContactRequests.length;
    const noOperation = this.mockContactRequests.filter(r => !r.operation).length;
    // Only count requests with operation === 'resolved' (matching the resolved tab filter)
    const resolved = this.mockContactRequests.filter(r => r.operation === 'resolved').length;
    return of({ total, noOperation, resolved }).pipe(delay(100));
  }
}

