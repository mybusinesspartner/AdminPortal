import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})
export class UserDetailComponent implements OnInit {
  user: User | null = null;
  isLoading = false;
  isProcessing = false;
  remarks = '';
  isReadOnly = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.loadUser(userId);
    }
  }

  loadUser(id: string): void {
    this.isLoading = true;
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.user = user || null;
        if (user) {
          this.isReadOnly = user.status !== 'pending';
          if (user.remarks) {
            this.remarks = user.remarks;
          }
        }
        this.isLoading = false;
        if (!user) {
          this.toastService.error('User not found');
          this.router.navigate(['/dashboard']);
        }
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Failed to load user details');
      }
    });
  }

  approve(): void {
    if (!this.user || this.isProcessing) return;

    this.isProcessing = true;
    this.userService.approveUser(this.user.id, this.remarks).subscribe({
      next: () => {
        this.toastService.success('User verification approved successfully');
        this.router.navigate(['/document-verification'], { queryParams: { tab: 'approved' } });
      },
      error: () => {
        this.isProcessing = false;
        this.toastService.error('Failed to approve user');
      }
    });
  }

  reject(): void {
    if (!this.user || this.isProcessing) return;

    if (!this.remarks.trim()) {
      this.toastService.warning('Please add remarks before rejecting');
      return;
    }

    this.isProcessing = true;
    this.userService.rejectUser(this.user.id, this.remarks).subscribe({
      next: () => {
        this.toastService.success('User verification rejected');
        this.router.navigate(['/document-verification'], { queryParams: { tab: 'rejected' } });
      },
      error: () => {
        this.isProcessing = false;
        this.toastService.error('Failed to reject user');
      }
    });
  }

  goBack(): void {
    // Navigate back to document verification page
    // Preserve the active tab based on user status if available
    if (this.user) {
      const tab = this.user.status === 'pending' ? 'pending' : 
                  this.user.status === 'approved' ? 'approved' : 'rejected';
      this.router.navigate(['/document-verification'], { queryParams: { tab } });
    } else {
      this.router.navigate(['/document-verification']);
    }
  }

  getBusinessTypeClass(): string {
    if (!this.user) return '';
    return this.user.businessType === 'Corporate Business' ? 'business-type corporate' : 'business-type local';
  }
}

