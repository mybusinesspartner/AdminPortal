import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeletedUserService } from '../../services/deleted-user.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { DeletedUser, DeletionType } from '../../models/deleted-user.model';

@Component({
  selector: 'app-deleted-users',
  templateUrl: './deleted-users.component.html',
  styleUrl: './deleted-users.component.css'
})
export class DeletedUsersComponent implements OnInit {
  deletedUsers: DeletedUser[] = [];
  filteredUsers: DeletedUser[] = [];
  paginatedUsers: DeletedUser[] = [];
  isLoading = false;
  activeTab: 'all' | 'user_initiated' | 'admin_initiated' = 'all';
  searchTerm = '';
  
  // Count properties
  allCount = 0;
  userInitiatedCount = 0;
  adminInitiatedCount = 0;
  
  // Pagination properties
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  pageSizeOptions = [10, 25, 50];

  constructor(
    private deletedUserService: DeletedUserService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadCounts();
    this.loadDeletedUsers();
  }

  loadCounts(): void {
    this.deletedUserService.getDeletedUserCount().subscribe(count => {
      this.allCount = count;
    });
    this.deletedUserService.getDeletedUserCount('user_initiated').subscribe(count => {
      this.userInitiatedCount = count;
    });
    this.deletedUserService.getDeletedUserCount('admin_initiated').subscribe(count => {
      this.adminInitiatedCount = count;
    });
  }

  loadDeletedUsers(): void {
    this.isLoading = true;
    const type = this.activeTab === 'all' ? undefined : this.activeTab as DeletionType;
    
    this.deletedUserService.getDeletedUsers(type).subscribe({
      next: (users) => {
        this.deletedUsers = users;
        this.applyFilters();
        this.loadCounts(); // Refresh counts after loading users
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Failed to load deleted users');
      }
    });
  }

  switchTab(tab: 'all' | 'user_initiated' | 'admin_initiated'): void {
    if (this.activeTab !== tab) {
      this.activeTab = tab;
      this.currentPage = 1;
      this.searchTerm = '';
      this.loadDeletedUsers();
      this.loadCounts();
    }
  }

  applyFilters(): void {
    let filtered = [...this.deletedUsers];

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(deletedUser =>
        deletedUser.user.name.toLowerCase().includes(term) ||
        deletedUser.user.email.toLowerCase().includes(term) ||
        (deletedUser.userMessage && deletedUser.userMessage.toLowerCase().includes(term)) ||
        (deletedUser.adminReason && deletedUser.adminReason.toLowerCase().includes(term)) ||
        (deletedUser.deletedBy && deletedUser.deletedBy.toLowerCase().includes(term))
      );
    }

    this.filteredUsers = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
      const container = document.querySelector('.deleted-users-list');
      if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  onPageSizeChange(): void {
    this.itemsPerPage = Number(this.itemsPerPage);
    this.currentPage = 1;
    this.updatePagination();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  logout(): void {
    this.authService.logout();
  }
}

