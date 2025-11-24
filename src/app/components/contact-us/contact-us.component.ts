import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContactRequestService } from '../../services/contact-request.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ContactRequest, SupportType } from '../../models/contact-request.model';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent implements OnInit {
  requests: ContactRequest[] = [];
  filteredRequests: ContactRequest[] = [];
  paginatedRequests: ContactRequest[] = [];
  isLoading = false;
  searchTerm = '';
  activeTab: 'pending' | 'resolved' = 'pending';
  selectedSupportType: 'all' | SupportType = 'all';
  
  // Counts for tabs
  pendingCount = 0;
  resolvedCount = 0;
  
  // Pagination properties
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  pageSizeOptions = [10, 25, 50];
  
  // Support type options
  supportTypeOptions: SupportType[] = ['General Inquiry', 'Support', 'Feedback', 'Other'];

  // Confirmation dialog properties
  showConfirmation = false;
  selectedRequest: ContactRequest | null = null;
  confirmationAction: 'resolve' | 'pending' | null = null;
  isProcessing = false;

  constructor(
    private contactRequestService: ContactRequestService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadRequests();
    this.loadCounts();
  }

  loadCounts(): void {
    this.contactRequestService.getContactRequestCounts().subscribe(counts => {
      this.pendingCount = counts.noOperation;
      this.resolvedCount = counts.resolved;
    });
  }

  loadRequests(): void {
    this.isLoading = true;
    
    const requestObservable = this.activeTab === 'pending'
      ? this.contactRequestService.getContactRequests(true)
      : this.contactRequestService.getResolvedContactRequests();
    
    requestObservable.subscribe({
      next: (requests) => {
        this.requests = requests;
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Failed to load contact requests');
      }
    });
  }

  switchTab(tab: 'pending' | 'resolved'): void {
    if (this.activeTab !== tab) {
      this.activeTab = tab;
      this.currentPage = 1; // Reset to first page when switching tabs
      this.selectedSupportType = 'all'; // Reset filter when switching tabs
      this.searchTerm = ''; // Reset search when switching tabs
      this.loadRequests();
    }
  }

  applyFilters(): void {
    let filtered = [...this.requests];

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(request =>
        request.subject.toLowerCase().includes(term) ||
        request.message.toLowerCase().includes(term) ||
        request.name.toLowerCase().includes(term) ||
        request.email.toLowerCase().includes(term) ||
        (request.phone && request.phone.toLowerCase().includes(term))
      );
    }

    // Support type filter
    if (this.selectedSupportType !== 'all') {
      filtered = filtered.filter(request => request.supportType === this.selectedSupportType);
    }

    this.filteredRequests = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  onSupportTypeChange(): void {
    this.applyFilters();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredRequests.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedRequests = this.filteredRequests.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
      const container = document.querySelector('.requests-list');
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

  showResolveConfirmation(request: ContactRequest): void {
    this.selectedRequest = request;
    this.confirmationAction = 'resolve';
    this.showConfirmation = true;
    document.body.style.overflow = 'hidden';
  }

  showPendingConfirmation(request: ContactRequest): void {
    this.selectedRequest = request;
    this.confirmationAction = 'pending';
    this.showConfirmation = true;
    document.body.style.overflow = 'hidden';
  }

  cancelConfirmation(): void {
    this.showConfirmation = false;
    this.selectedRequest = null;
    this.confirmationAction = null;
    document.body.style.overflow = '';
  }

  confirmAction(): void {
    if (!this.selectedRequest || !this.confirmationAction || this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    if (this.confirmationAction === 'resolve') {
      this.contactRequestService.updateContactRequest(this.selectedRequest.id, 'resolved', 'admin-001').subscribe({
        next: () => {
          this.toastService.success('Request marked as resolved');
          this.cancelConfirmation();
          this.loadRequests();
          this.loadCounts();
          this.isProcessing = false;
        },
        error: () => {
          this.toastService.error('Failed to resolve request');
          this.isProcessing = false;
        }
      });
    } else if (this.confirmationAction === 'pending') {
      this.contactRequestService.removeOperation(this.selectedRequest.id).subscribe({
        next: () => {
          this.toastService.success('Request moved to pending');
          this.cancelConfirmation();
          this.loadRequests();
          this.loadCounts();
          this.isProcessing = false;
        },
        error: () => {
          this.toastService.error('Failed to move request to pending');
          this.isProcessing = false;
        }
      });
    }
  }

  onConfirmationBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.cancelConfirmation();
    }
  }
}

