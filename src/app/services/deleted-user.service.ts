import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DeletedUser, DeletionType } from '../models/deleted-user.model';

@Injectable({
  providedIn: 'root'
})
export class DeletedUserService {
  private deletedUsers: DeletedUser[] = [];

  constructor() {
    // Load from localStorage on initialization
    this.loadFromStorage();
    // Initialize sample data if localStorage is empty
    if (this.deletedUsers.length === 0) {
      this.initializeSampleData();
    }
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem('deletedUsers');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        this.deletedUsers = parsed.map((du: any) => ({
          ...du,
          deletedAt: new Date(du.deletedAt)
        }));
      } catch (e) {
        console.error('Error parsing deleted users from localStorage', e);
        this.deletedUsers = [];
      }
    }
  }

  private saveToStorage(): void {
    localStorage.setItem('deletedUsers', JSON.stringify(this.deletedUsers));
  }

  private initializeSampleData(): void {
    const sampleDeletedUsers: DeletedUser[] = [
      {
        userId: 'del-001',
        user: {
          id: 'del-001',
          name: 'Michael Chen',
          email: 'michael.chen@example.com',
          phone: '+1234567901',
          collegeName: 'Stanford University',
          yearOfPassout: 2022,
          businessType: 'Corporate Business',
          status: 'approved',
          submittedAt: new Date('2023-12-01'),
          documentUrl: 'https://picsum.photos/800/600?random=10'
        },
        deletedAt: new Date('2024-01-20T10:30:00'),
        deletionType: 'user_initiated',
        userMessage: 'I no longer need this account as I have switched to a different platform. Thank you for the service.'
      },
      {
        userId: 'del-002',
        user: {
          id: 'del-002',
          name: 'Sarah Martinez',
          email: 'sarah.martinez@example.com',
          phone: '+1234567902',
          collegeName: 'MIT',
          yearOfPassout: 2023,
          businessType: 'Local Business',
          status: 'approved',
          submittedAt: new Date('2023-11-15'),
          documentUrl: 'https://picsum.photos/800/600?random=11'
        },
        deletedAt: new Date('2024-01-19T14:20:00'),
        deletionType: 'admin_initiated',
        adminReason: 'Account deleted due to multiple policy violations and inappropriate behavior reported by other users.',
        deletedBy: 'admin-001'
      },
      {
        userId: 'del-003',
        user: {
          id: 'del-003',
          name: 'David Kim',
          email: 'david.kim@example.com',
          phone: '+1234567903',
          collegeName: 'Harvard University',
          yearOfPassout: 2021,
          businessType: 'Corporate Business',
          status: 'approved',
          submittedAt: new Date('2023-10-20'),
          documentUrl: 'https://picsum.photos/800/600?random=12'
        },
        deletedAt: new Date('2024-01-18T09:15:00'),
        deletionType: 'user_initiated',
        userMessage: 'I am closing my business and will not be using this service anymore. Please delete my account.'
      },
      {
        userId: 'del-004',
        user: {
          id: 'del-004',
          name: 'Emily Rodriguez',
          email: 'emily.rodriguez@example.com',
          phone: '+1234567904',
          collegeName: 'UC Berkeley',
          yearOfPassout: 2024,
          businessType: 'Local Business',
          status: 'pending',
          submittedAt: new Date('2024-01-10'),
          documentUrl: 'https://picsum.photos/800/600?random=13'
        },
        deletedAt: new Date('2024-01-17T16:45:00'),
        deletionType: 'admin_initiated',
        adminReason: 'Account deleted due to fraudulent activity and suspicious document submissions.',
        deletedBy: 'admin-002'
      },
      {
        userId: 'del-005',
        user: {
          id: 'del-005',
          name: 'James Wilson',
          email: 'james.wilson@example.com',
          phone: '+1234567905',
          collegeName: 'Yale University',
          yearOfPassout: 2022,
          businessType: 'Corporate Business',
          status: 'approved',
          submittedAt: new Date('2023-09-05'),
          documentUrl: 'https://picsum.photos/800/600?random=14'
        },
        deletedAt: new Date('2024-01-16T11:30:00'),
        deletionType: 'user_initiated',
        userMessage: 'I found a better alternative service that better fits my needs. Thank you for everything!'
      },
      {
        userId: 'del-006',
        user: {
          id: 'del-006',
          name: 'Lisa Anderson',
          email: 'lisa.anderson@example.com',
          phone: '+1234567906',
          collegeName: 'Princeton University',
          yearOfPassout: 2023,
          businessType: 'Local Business',
          status: 'approved',
          submittedAt: new Date('2023-08-12'),
          documentUrl: 'https://picsum.photos/800/600?random=15'
        },
        deletedAt: new Date('2024-01-15T13:20:00'),
        deletionType: 'admin_initiated',
        adminReason: 'Account deleted due to repeated violations of terms of service and community guidelines.',
        deletedBy: 'admin-001'
      },
      {
        userId: 'del-007',
        user: {
          id: 'del-007',
          name: 'Robert Taylor',
          email: 'robert.taylor@example.com',
          phone: '+1234567907',
          collegeName: 'Columbia University',
          yearOfPassout: 2021,
          businessType: 'Corporate Business',
          status: 'approved',
          submittedAt: new Date('2023-07-18'),
          documentUrl: 'https://picsum.photos/800/600?random=16'
        },
        deletedAt: new Date('2024-01-14T08:00:00'),
        deletionType: 'user_initiated',
        userMessage: 'I am taking a break from business activities and will not be active. Please delete my account for now.'
      },
      {
        userId: 'del-008',
        user: {
          id: 'del-008',
          name: 'Amanda Brown',
          email: 'amanda.brown@example.com',
          phone: '+1234567908',
          collegeName: 'Cornell University',
          yearOfPassout: 2024,
          businessType: 'Local Business',
          status: 'rejected',
          submittedAt: new Date('2024-01-05'),
          documentUrl: 'https://picsum.photos/800/600?random=17',
          remarks: 'Document quality insufficient'
        },
        deletedAt: new Date('2024-01-13T15:10:00'),
        deletionType: 'admin_initiated',
        adminReason: 'Account deleted due to spam activity and multiple fake account creation attempts.',
        deletedBy: 'admin-003'
      },
      {
        userId: 'del-009',
        user: {
          id: 'del-009',
          name: 'Jennifer White',
          email: 'jennifer.white@example.com',
          phone: '+1234567909',
          collegeName: 'Duke University',
          yearOfPassout: 2023,
          businessType: 'Corporate Business',
          status: 'approved',
          submittedAt: new Date('2023-06-20'),
          documentUrl: 'https://picsum.photos/800/600?random=18'
        },
        deletedAt: new Date('2024-01-12T10:45:00'),
        deletionType: 'user_initiated',
        userMessage: 'I have decided to pursue a different career path and no longer need this business account. Thank you for your support during my time here.'
      },
      {
        userId: 'del-010',
        user: {
          id: 'del-010',
          name: 'Christopher Lee',
          email: 'christopher.lee@example.com',
          phone: '+1234567910',
          collegeName: 'Northwestern University',
          yearOfPassout: 2022,
          businessType: 'Local Business',
          status: 'approved',
          submittedAt: new Date('2023-05-15'),
          documentUrl: 'https://picsum.photos/800/600?random=19'
        },
        deletedAt: new Date('2024-01-11T14:20:00'),
        deletionType: 'user_initiated',
        userMessage: 'Due to personal circumstances, I need to step away from my business. Please delete my account as I will not be returning.'
      },
      {
        userId: 'del-011',
        user: {
          id: 'del-011',
          name: 'Patricia Garcia',
          email: 'patricia.garcia@example.com',
          phone: '+1234567911',
          collegeName: 'University of Chicago',
          yearOfPassout: 2024,
          businessType: 'Corporate Business',
          status: 'approved',
          submittedAt: new Date('2023-04-10'),
          documentUrl: 'https://picsum.photos/800/600?random=20'
        },
        deletedAt: new Date('2024-01-10T09:30:00'),
        deletionType: 'user_initiated',
        userMessage: 'The platform does not meet my current business requirements. I have found a more suitable solution elsewhere.'
      },
      {
        userId: 'del-012',
        user: {
          id: 'del-012',
          name: 'Daniel Moore',
          email: 'daniel.moore@example.com',
          phone: '+1234567912',
          collegeName: 'Vanderbilt University',
          yearOfPassout: 2021,
          businessType: 'Local Business',
          status: 'approved',
          submittedAt: new Date('2023-03-25'),
          documentUrl: 'https://picsum.photos/800/600?random=21'
        },
        deletedAt: new Date('2024-01-09T16:15:00'),
        deletionType: 'user_initiated',
        userMessage: 'I am consolidating my business operations and will be using a different platform that offers better integration with my existing systems.'
      },
      {
        userId: 'del-013',
        user: {
          id: 'del-013',
          name: 'Michelle Thompson',
          email: 'michelle.thompson@example.com',
          phone: '+1234567913',
          collegeName: 'Rice University',
          yearOfPassout: 2023,
          businessType: 'Corporate Business',
          status: 'approved',
          submittedAt: new Date('2023-02-18'),
          documentUrl: 'https://picsum.photos/800/600?random=22'
        },
        deletedAt: new Date('2024-01-08T11:00:00'),
        deletionType: 'user_initiated',
        userMessage: 'After careful consideration, I have decided to discontinue my business venture. Please remove my account from your system.'
      },
      {
        userId: 'del-014',
        user: {
          id: 'del-014',
          name: 'Kevin Harris',
          email: 'kevin.harris@example.com',
          phone: '+1234567914',
          collegeName: 'Georgetown University',
          yearOfPassout: 2022,
          businessType: 'Local Business',
          status: 'approved',
          submittedAt: new Date('2023-01-30'),
          documentUrl: 'https://picsum.photos/800/600?random=23'
        },
        deletedAt: new Date('2024-01-07T13:45:00'),
        deletionType: 'user_initiated',
        userMessage: 'I am relocating to a different country and will not be able to continue using this service. Thank you for everything!'
      },
      {
        userId: 'del-015',
        user: {
          id: 'del-015',
          name: 'Nicole Clark',
          email: 'nicole.clark@example.com',
          phone: '+1234567915',
          collegeName: 'Carnegie Mellon University',
          yearOfPassout: 2024,
          businessType: 'Corporate Business',
          status: 'approved',
          submittedAt: new Date('2022-12-12'),
          documentUrl: 'https://picsum.photos/800/600?random=24'
        },
        deletedAt: new Date('2024-01-06T08:20:00'),
        deletionType: 'user_initiated',
        userMessage: 'I have merged my business with another company and no longer need this separate account. Please delete it.'
      },
      {
        userId: 'del-016',
        user: {
          id: 'del-016',
          name: 'Ryan Lewis',
          email: 'ryan.lewis@example.com',
          phone: '+1234567916',
          collegeName: 'Emory University',
          yearOfPassout: 2021,
          businessType: 'Local Business',
          status: 'approved',
          submittedAt: new Date('2022-11-08'),
          documentUrl: 'https://picsum.photos/800/600?random=25'
        },
        deletedAt: new Date('2024-01-05T15:30:00'),
        deletionType: 'user_initiated',
        userMessage: 'The service was helpful initially, but I have outgrown it and need more advanced features that are not available here.'
      },
      {
        userId: 'del-017',
        user: {
          id: 'del-017',
          name: 'Stephanie Walker',
          email: 'stephanie.walker@example.com',
          phone: '+1234567917',
          collegeName: 'Wake Forest University',
          yearOfPassout: 2023,
          businessType: 'Corporate Business',
          status: 'approved',
          submittedAt: new Date('2022-10-22'),
          documentUrl: 'https://picsum.photos/800/600?random=26'
        },
        deletedAt: new Date('2024-01-04T10:10:00'),
        deletionType: 'user_initiated',
        userMessage: 'I am taking an extended sabbatical and will not be active for the foreseeable future. Please delete my account.'
      },
      {
        userId: 'del-018',
        user: {
          id: 'del-018',
          name: 'Brandon Hall',
          email: 'brandon.hall@example.com',
          phone: '+1234567918',
          collegeName: 'Tufts University',
          yearOfPassout: 2022,
          businessType: 'Local Business',
          status: 'approved',
          submittedAt: new Date('2022-09-14'),
          documentUrl: 'https://picsum.photos/800/600?random=27'
        },
        deletedAt: new Date('2024-01-03T12:00:00'),
        deletionType: 'user_initiated',
        userMessage: 'Due to financial constraints, I am unable to continue my business operations. Please remove my account.'
      }
    ];

    this.deletedUsers = sampleDeletedUsers;
    this.saveToStorage();
  }

  addDeletedUser(
    userId: string,
    user: any,
    deletionType: DeletionType,
    reasonOrMessage: string,
    deletedBy?: string
  ): void {
    const deletedUser: DeletedUser = {
      userId,
      user,
      deletedAt: new Date(),
      deletionType,
      deletedBy
    };

    if (deletionType === 'user_initiated') {
      deletedUser.userMessage = reasonOrMessage;
    } else {
      deletedUser.adminReason = reasonOrMessage;
    }

    this.deletedUsers.push(deletedUser);
    this.saveToStorage();
  }

  getDeletedUsers(type?: DeletionType): Observable<DeletedUser[]> {
    this.loadFromStorage();
    
    let filtered = [...this.deletedUsers];
    
    if (type) {
      filtered = filtered.filter(du => du.deletionType === type);
    }
    
    // Sort by deletion date, most recent first
    filtered.sort((a, b) => b.deletedAt.getTime() - a.deletedAt.getTime());
    
    return of(filtered).pipe(delay(300));
  }

  getDeletedUserCount(type?: DeletionType): Observable<number> {
    this.loadFromStorage();
    
    if (type) {
      const count = this.deletedUsers.filter(du => du.deletionType === type).length;
      return of(count).pipe(delay(100));
    }
    
    return of(this.deletedUsers.length).pipe(delay(100));
  }
}

