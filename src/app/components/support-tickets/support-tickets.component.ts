import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupportTicketService } from '../../services/support-ticket.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { SupportTicket, TicketCategory, BusinessType } from '../../models/support-ticket.model';

type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

@Component({
  selector: 'app-support-tickets',
  templateUrl: './support-tickets.component.html',
  styleUrl: './support-tickets.component.css'
})
export class SupportTicketsComponent implements OnInit {
  tickets: SupportTicket[] = [];
  filteredTickets: SupportTicket[] = [];
  paginatedTickets: SupportTicket[] = [];
  isLoading = false;
  activeTab: TicketStatus | 'all' = 'all';
  searchTerm = '';
  selectedCategory: 'all' | TicketCategory = 'all';
  selectedBusinessType: 'all' | BusinessType = 'all';
  
  // Pagination properties
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  pageSizeOptions = [10, 25, 50];
  
  counts = {
    all: 0,
    open: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0
  };

  constructor(
    private ticketService: SupportTicketService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadTickets();
    this.loadCounts();
    this.updatePagination();
  }

  loadCounts(): void {
    this.ticketService.getTicketCounts().subscribe(counts => {
      this.counts.all = counts.total;
      this.counts.open = counts.open;
      this.counts.in_progress = counts.in_progress;
      this.counts.resolved = counts.resolved;
      this.counts.closed = counts.closed;
    });
  }

  loadTickets(): void {
    this.isLoading = true;
    const status = this.activeTab === 'all' ? undefined : this.activeTab;
    
    this.ticketService.getTickets(status).subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Failed to load support tickets');
      }
    });
  }

  switchTab(tab: TicketStatus | 'all'): void {
    if (this.activeTab !== tab) {
      this.activeTab = tab;
      this.currentPage = 1; // Reset to first page when switching tabs
      this.loadTickets();
    }
  }

  applyFilters(): void {
    let filtered = [...this.tickets];

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(ticket =>
        ticket.subject.toLowerCase().includes(term) ||
        ticket.description.toLowerCase().includes(term) ||
        ticket.userName.toLowerCase().includes(term) ||
        ticket.userEmail.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(ticket => ticket.category === this.selectedCategory);
    }

    // Business Type filter
    if (this.selectedBusinessType !== 'all') {
      filtered = filtered.filter(ticket => ticket.businessType === this.selectedBusinessType);
    }

    this.filteredTickets = filtered;
    this.currentPage = 1; // Reset to first page when filters change
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredTickets.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedTickets = this.filteredTickets.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
      // Scroll to top of tickets list
      const ticketsContainer = document.querySelector('.tickets-list');
      if (ticketsContainer) {
        ticketsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    // Convert to number since select returns string
    this.itemsPerPage = Number(this.itemsPerPage);
    this.currentPage = 1; // Reset to first page when changing page size
    this.updatePagination();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  onBusinessTypeChange(): void {
    this.applyFilters();
  }

  viewTicket(ticketId: string): void {
    this.router.navigate(['/support-tickets', ticketId]);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getCategoryClass(category: string): string {
    // Convert category to a valid CSS class name
    return `category-${category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  getBusinessTypeBadgeClass(type: BusinessType): string {
    return type === 'Corporate Business' ? 'business-type corporate' : 'business-type local';
  }

  logout(): void {
    this.authService.logout();
  }
}

