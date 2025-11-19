import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ReportedUserService } from '../../services/reported-user.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ReportedUserSummary, ReportStatus, UserReport, ReportReason } from '../../models/reported-user.model';
import { BusinessType } from '../../models/user.model';

@Component({
  selector: 'app-reported-users',
  templateUrl: './reported-users.component.html',
  styleUrl: './reported-users.component.css'
})
export class ReportedUsersComponent implements OnInit, OnDestroy {
  summaries: ReportedUserSummary[] = [];
  deletedSummaries: ReportedUserSummary[] = [];
  filteredSummaries: ReportedUserSummary[] = [];
  paginatedSummaries: ReportedUserSummary[] = [];
  isLoading = false;
  activeTab: 'all' | 'deleted' = 'all';
  searchTerm = '';
  selectedBusinessType: 'all' | BusinessType = 'all';
  selectedReportType: 'all' | ReportReason = 'all';
  
  // Modal properties
  showModal = false;
  selectedSummary: ReportedUserSummary | null = null;
  showDeleteConfirmation = false;
  isDeleting = false;
  
  // Pagination properties
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  pageSizeOptions = [10, 25, 50];
  

  constructor(
    private reportedUserService: ReportedUserService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadSummaries();
    // Load deleted users count from localStorage
    const deletedCount = localStorage.getItem('deletedUsersCount');
    if (deletedCount) {
      // Note: We can't restore the actual deleted summaries from localStorage easily,
      // but we can track the count. The actual deleted summaries are stored in component state.
    }
  }

  loadSummaries(): void {
    this.isLoading = true;
    this.reportedUserService.getReportedUserSummaries().subscribe({
      next: (summaries) => {
        this.summaries = summaries;
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Failed to load reported users');
      }
    });
  }

  switchTab(tab: 'all' | 'deleted'): void {
    if (this.activeTab !== tab) {
      this.activeTab = tab;
      this.applyFilters();
    }
  }

  applyFilters(): void {
    // Choose source based on active tab
    const source = this.activeTab === 'deleted' ? this.deletedSummaries : this.summaries;
    let filtered = [...source];

    if (this.selectedBusinessType !== 'all') {
      filtered = filtered.filter(summary => summary.user.businessType === this.selectedBusinessType);
    }

    if (this.selectedReportType !== 'all') {
      filtered = filtered.filter(summary => summary.lastReportReason === this.selectedReportType);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(summary =>
        summary.user.name.toLowerCase().includes(term) ||
        summary.user.email.toLowerCase().includes(term) ||
        summary.lastReportReason.toLowerCase().includes(term)
      );
    }

    this.filteredSummaries = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  onBusinessTypeChange(): void {
    this.applyFilters();
  }

  onReportTypeChange(): void {
    this.applyFilters();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredSummaries.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedSummaries = this.filteredSummaries.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
      const container = document.querySelector('.summaries-list');
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

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  viewReports(summary: ReportedUserSummary): void {
    this.selectedSummary = summary;
    this.showModal = true;
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedSummary = null;
    this.showDeleteConfirmation = false;
    // Restore body scroll
    document.body.style.overflow = '';
  }

  onModalBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  viewUser(userId: string): void {
    this.router.navigate(['/user', userId], { queryParams: { from: 'reported-users' } });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  getStatusBadgeClass(status: ReportStatus): string {
    const statusClasses: Record<ReportStatus, string> = {
      'pending': 'status-pending',
      'investigating': 'status-investigating',
      'resolved': 'status-resolved',
      'dismissed': 'status-dismissed'
    };
    return statusClasses[status] || '';
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getSeverityClass(severity: string): string {
    return `severity-${severity}`;
  }

  isHighPriority(summary: ReportedUserSummary): boolean {
    return summary.totalReports > 5;
  }

  ngOnDestroy(): void {
    // Restore body scroll if modal was open
    document.body.style.overflow = '';
  }

  getSortedReports(): UserReport[] {
    if (!this.selectedSummary) return [];
    // Sort reports by date, most recent first
    return [...this.selectedSummary.reports].sort((a, b) => 
      b.reportedAt.getTime() - a.reportedAt.getTime()
    );
  }

  showDeleteDialog(): void {
    this.showDeleteConfirmation = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
  }

  confirmDelete(): void {
    if (!this.selectedSummary || this.isDeleting) return;

    this.isDeleting = true;
    // Store the summary before deletion
    const summaryToDelete = { ...this.selectedSummary };
    
    this.userService.deleteUser(this.selectedSummary.userId).subscribe({
      next: () => {
        // Move summary to deleted list
        const index = this.summaries.findIndex(s => s.userId === summaryToDelete.userId);
        if (index !== -1) {
          this.summaries.splice(index, 1);
          this.deletedSummaries.push(summaryToDelete);
          // Update localStorage to track deleted count
          localStorage.setItem('deletedUsersCount', this.deletedSummaries.length.toString());
        }
        
        this.toastService.success('User deleted successfully');
        this.showDeleteConfirmation = false;
        this.closeModal();
        // Apply filters to update the view
        this.applyFilters();
      },
      error: () => {
        this.isDeleting = false;
        this.toastService.error('Failed to delete user');
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}

