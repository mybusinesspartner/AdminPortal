import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { User, BusinessType } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit, OnChanges {
  @Input() users: User[] = [];
  @Input() isLoading = false;
  @Input() readOnly = false;
  @Output() viewUser = new EventEmitter<string>();

  filteredUsers: User[] = [];
  paginatedUsers: User[] = [];
  searchTerm = '';
  selectedBusinessType: 'all' | BusinessType = 'all';
  sortBy: 'name' | 'date' = 'date';
  sortOrder: 'asc' | 'desc' = 'desc';
  
  // Pagination properties
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  pageSizeOptions = [10, 25, 50];

  ngOnInit(): void {
    this.filteredUsers = [...this.users];
    this.updatePagination();
  }

  ngOnChanges(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onSortChange(sortBy: 'name' | 'date'): void {
    if (this.sortBy === sortBy) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = sortBy;
      this.sortOrder = 'desc';
    }
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.users];

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.phone.includes(term)
      );
    }

    // Business Type filter
    if (this.selectedBusinessType !== 'all') {
      filtered = filtered.filter(user => user.businessType === this.selectedBusinessType);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (this.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = a.submittedAt.getTime() - b.submittedAt.getTime();
          break;
      }
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });

    this.filteredUsers = filtered;
    this.currentPage = 1; // Reset to first page when filters change
    this.updatePagination();
  }

  onBusinessTypeChange(): void {
    this.applyFilters();
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
      // Scroll to top of table
      const tableContainer = document.querySelector('.table-container');
      if (tableContainer) {
        tableContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  onViewUser(userId: string): void {
    this.viewUser.emit(userId);
  }

  getSortIcon(field: 'name' | 'date'): string {
    if (this.sortBy !== field) return '⇅';
    return this.sortOrder === 'asc' ? '↑' : '↓';
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  onPageSizeChange(): void {
    // Convert to number since select returns string
    this.itemsPerPage = Number(this.itemsPerPage);
    this.currentPage = 1; // Reset to first page when changing page size
    this.updatePagination();
  }
}

