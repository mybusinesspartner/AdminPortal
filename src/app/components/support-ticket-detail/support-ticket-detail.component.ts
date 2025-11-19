import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupportTicketService } from '../../services/support-ticket.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { SupportTicket } from '../../models/support-ticket.model';

@Component({
  selector: 'app-support-ticket-detail',
  templateUrl: './support-ticket-detail.component.html',
  styleUrl: './support-ticket-detail.component.css'
})
export class SupportTicketDetailComponent implements OnInit {
  ticket: SupportTicket | null = null;
  isLoading = false;
  newComment = '';
  isAddingComment = false;
  isUpdatingStatus = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: SupportTicketService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const ticketId = this.route.snapshot.paramMap.get('id');
    if (ticketId) {
      this.loadTicket(ticketId);
    }
  }

  loadTicket(id: string): void {
    this.isLoading = true;
    this.ticketService.getTicketById(id).subscribe({
      next: (ticket) => {
        this.ticket = ticket || null;
        this.isLoading = false;
        if (!ticket) {
          this.toastService.error('Ticket not found');
          this.router.navigate(['/support-tickets']);
        }
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Failed to load ticket details');
      }
    });
  }

  updateStatus(status: 'open' | 'in_progress' | 'resolved' | 'closed'): void {
    if (!this.ticket || this.isUpdatingStatus) return;

    this.isUpdatingStatus = true;
    this.ticketService.updateTicketStatus(this.ticket.id, status).subscribe({
      next: () => {
        this.toastService.success(`Ticket status updated to ${status.replace('_', ' ')}`);
        this.loadTicket(this.ticket!.id);
        this.isUpdatingStatus = false;
      },
      error: () => {
        this.isUpdatingStatus = false;
        this.toastService.error('Failed to update ticket status');
      }
    });
  }

  addComment(): void {
    if (!this.ticket || !this.newComment.trim() || this.isAddingComment) return;

    this.isAddingComment = true;
    this.ticketService.addComment(this.ticket.id, this.newComment).subscribe({
      next: () => {
        this.toastService.success('Comment added successfully');
        this.newComment = '';
        this.loadTicket(this.ticket!.id);
        this.isAddingComment = false;
      },
      error: () => {
        this.isAddingComment = false;
        this.toastService.error('Failed to add comment');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/support-tickets']);
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getCategoryClass(category: string): string {
    // Convert category to a valid CSS class name
    return `category-${category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
  }

  getBusinessTypeClass(): string {
    if (!this.ticket) return '';
    return this.ticket.businessType === 'Corporate Business' ? 'business-corporate' : 'business-local';
  }

  getBusinessTypeBadgeClass(): string {
    if (!this.ticket) return '';
    return this.ticket.businessType === 'Corporate Business' ? 'business-type-corporate' : 'business-type-local';
  }

  logout(): void {
    this.authService.logout();
  }
}

