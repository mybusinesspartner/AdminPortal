import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User, VerificationRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private mockUsers: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      collegeName: 'Stanford University',
      yearOfPassout: 2023,
      businessType: 'Corporate Business',
      status: 'pending',
      submittedAt: new Date('2024-01-15'),
      documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1234567891',
      collegeName: 'MIT',
      yearOfPassout: 2022,
      businessType: 'Local Business',
      status: 'pending',
      submittedAt: new Date('2024-01-16'),
      documentUrl: 'https://picsum.photos/800/600?random=1'
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      phone: '+1234567892',
      collegeName: 'Harvard University',
      yearOfPassout: 2024,
      businessType: 'Corporate Business',
      status: 'pending',
      submittedAt: new Date('2024-01-17'),
      documentUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'
    },
    {
      id: '4',
      name: 'Alice Williams',
      email: 'alice.williams@example.com',
      phone: '+1234567893',
      collegeName: 'UC Berkeley',
      yearOfPassout: 2023,
      businessType: 'Local Business',
      status: 'pending',
      submittedAt: new Date('2024-01-18'),
      documentUrl: 'https://picsum.photos/800/600?random=2'
    },
    {
      id: '5',
      name: 'Charlie Brown',
      email: 'charlie.brown@example.com',
      phone: '+1234567894',
      collegeName: 'Yale University',
      yearOfPassout: 2022,
      businessType: 'Corporate Business',
      status: 'pending',
      submittedAt: new Date('2024-01-19'),
      documentUrl: 'https://via.placeholder.com/800x600/9B59B6/FFFFFF?text=Certificate+Image'
    },
    {
      id: '6',
      name: 'David Wilson',
      email: 'david.wilson@example.com',
      phone: '+1234567895',
      collegeName: 'Princeton University',
      yearOfPassout: 2021,
      businessType: 'Corporate Business',
      status: 'approved',
      submittedAt: new Date('2024-01-10'),
      documentUrl: 'https://www.africau.edu/images/default/sample.pdf',
      remarks: 'All documents verified. Approved on 2024-01-12.'
    },
    {
      id: '7',
      name: 'Emma Davis',
      email: 'emma.davis@example.com',
      phone: '+1234567896',
      collegeName: 'Columbia University',
      yearOfPassout: 2023,
      businessType: 'Local Business',
      status: 'approved',
      submittedAt: new Date('2024-01-11'),
      documentUrl: 'https://picsum.photos/800/600?random=3',
      remarks: 'Document quality is excellent. Verification successful.'
    },
    {
      id: '8',
      name: 'Frank Miller',
      email: 'frank.miller@example.com',
      phone: '+1234567897',
      collegeName: 'Cornell University',
      yearOfPassout: 2022,
      businessType: 'Corporate Business',
      status: 'approved',
      submittedAt: new Date('2024-01-12'),
      documentUrl: 'https://via.placeholder.com/800x600/2F855A/FFFFFF?text=Verified+Document+Image',
      remarks: 'All requirements met. Approved.'
    },
    {
      id: '9',
      name: 'Grace Lee',
      email: 'grace.lee@example.com',
      phone: '+1234567898',
      collegeName: 'University of Chicago',
      yearOfPassout: 2023,
      businessType: 'Local Business',
      status: 'rejected',
      submittedAt: new Date('2024-01-08'),
      documentUrl: 'https://picsum.photos/800/600?random=4',
      remarks: 'Image quality is too low. Please upload a clearer document.'
    },
    {
      id: '10',
      name: 'Henry Taylor',
      email: 'henry.taylor@example.com',
      phone: '+1234567899',
      collegeName: 'Duke University',
      yearOfPassout: 2024,
      businessType: 'Corporate Business',
      status: 'rejected',
      submittedAt: new Date('2024-01-09'),
      documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      remarks: 'Document is incomplete. Missing required pages.'
    },
    {
      id: '11',
      name: 'Ivy Chen',
      email: 'ivy.chen@example.com',
      phone: '+1234567900',
      collegeName: 'Northwestern University',
      yearOfPassout: 2022,
      businessType: 'Local Business',
      status: 'rejected',
      submittedAt: new Date('2024-01-07'),
      documentUrl: 'https://via.placeholder.com/800x600/C53030/FFFFFF?text=Invalid+Document+Image',
      remarks: 'Document does not match the provided information. Please verify and resubmit.'
    }
  ];

  getPendingUsers(): Observable<User[]> {
    return of(this.mockUsers.filter(u => u.status === 'pending')).pipe(delay(300));
  }

  getUserById(id: string): Observable<User | undefined> {
    const user = this.mockUsers.find(u => u.id === id);
    return of(user).pipe(delay(200));
  }

  approveUser(id: string, remarks?: string): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        const user = this.mockUsers.find(u => u.id === id);
        if (user) {
          user.status = 'approved';
          user.remarks = remarks;
        }
        observer.next(true);
        observer.complete();
      }, 500);
    });
  }

  rejectUser(id: string, remarks?: string): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        const user = this.mockUsers.find(u => u.id === id);
        if (user) {
          user.status = 'rejected';
          user.remarks = remarks;
        }
        observer.next(true);
        observer.complete();
      }, 500);
    });
  }

  getApprovedUsers(): Observable<User[]> {
    return of(this.mockUsers.filter(u => u.status === 'approved')).pipe(delay(300));
  }

  getRejectedUsers(): Observable<User[]> {
    return of(this.mockUsers.filter(u => u.status === 'rejected')).pipe(delay(300));
  }

  getAllUsers(): Observable<User[]> {
    return of(this.mockUsers).pipe(delay(300));
  }

  deleteUser(id: string): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        const index = this.mockUsers.findIndex(u => u.id === id);
        if (index !== -1) {
          this.mockUsers.splice(index, 1);
        }
        observer.next(true);
        observer.complete();
      }, 500);
    });
  }
}

