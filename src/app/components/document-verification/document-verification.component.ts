import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { User } from '../../models/user.model';

type TabType = 'pending' | 'approved' | 'rejected';

@Component({
  selector: 'app-document-verification',
  templateUrl: './document-verification.component.html',
  styleUrl: './document-verification.component.css'
})
export class DocumentVerificationComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  activeTab: TabType = 'pending';
  pendingCount = 0;
  approvedCount = 0;
  rejectedCount = 0;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Check for tab query parameter
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab && ['pending', 'approved', 'rejected'].includes(tab)) {
        this.activeTab = tab as TabType;
      }
      this.loadUsers();
      this.loadCounts();
    });
  }

  loadCounts(): void {
    this.userService.getPendingUsers().subscribe(users => {
      this.pendingCount = users.length;
    });
    this.userService.getApprovedUsers().subscribe(users => {
      this.approvedCount = users.length;
    });
    this.userService.getRejectedUsers().subscribe(users => {
      this.rejectedCount = users.length;
    });
  }

  loadUsers(): void {
    this.isLoading = true;
    let userObservable;
    
    switch (this.activeTab) {
      case 'pending':
        userObservable = this.userService.getPendingUsers();
        break;
      case 'approved':
        userObservable = this.userService.getApprovedUsers();
        break;
      case 'rejected':
        userObservable = this.userService.getRejectedUsers();
        break;
      default:
        userObservable = this.userService.getPendingUsers();
    }

    userObservable.subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Failed to load users. Please try again.');
      }
    });
  }

  switchTab(tab: TabType): void {
    if (this.activeTab !== tab) {
      this.activeTab = tab;
      this.loadUsers();
    }
  }

  viewUser(userId: string): void {
    this.router.navigate(['/user', userId]).then(() => {
      this.loadCounts();
      this.loadUsers();
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}

