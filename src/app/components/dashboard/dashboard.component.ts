import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { SupportTicketService } from '../../services/support-ticket.service';
import { ReportedUserService } from '../../services/reported-user.service';
import { ContactRequestService } from '../../services/contact-request.service';
import { DeletedUserService } from '../../services/deleted-user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  pendingCount = 0;
  approvedCount = 0;
  rejectedCount = 0;
  totalCount = 0;

  ticketOpenCount = 0;
  ticketInProgressCount = 0;
  ticketResolvedCount = 0;
  ticketClosedCount = 0;
  ticketTotalCount = 0;

  reportedUsersCount = 0;
  deletedUsersCount = 0;

  contactRequestsPendingCount = 0;
  contactRequestsResolvedCount = 0;

  constructor(
    private userService: UserService,
    private ticketService: SupportTicketService,
    private reportedUserService: ReportedUserService,
    private contactRequestService: ContactRequestService,
    private deletedUserService: DeletedUserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStatistics();
    this.loadTicketStatistics();
    this.loadReportedUsersStatistics();
    this.loadContactRequestsStatistics();
  }

  loadStatistics(): void {
    this.userService.getPendingUsers().subscribe(users => {
      this.pendingCount = users.length;
      this.updateTotal();
    });
    this.userService.getApprovedUsers().subscribe(users => {
      this.approvedCount = users.length;
      this.updateTotal();
    });
    this.userService.getRejectedUsers().subscribe(users => {
      this.rejectedCount = users.length;
      this.updateTotal();
    });
  }

  loadTicketStatistics(): void {
    this.ticketService.getTicketCounts().subscribe(counts => {
      this.ticketOpenCount = counts.open;
      this.ticketInProgressCount = counts.in_progress;
      this.ticketResolvedCount = counts.resolved;
      this.ticketClosedCount = counts.closed;
      this.ticketTotalCount = counts.total;
    });
  }

  updateTotal(): void {
    this.totalCount = this.pendingCount + this.approvedCount + this.rejectedCount;
  }

  navigateToVerification(): void {
    this.router.navigate(['/document-verification']);
  }

  navigateToSupportTickets(): void {
    this.router.navigate(['/support-tickets']);
  }

  navigateToReportedUsers(): void {
    this.router.navigate(['/reported-users']);
  }

  navigateToContactUs(): void {
    this.router.navigate(['/contact-us']);
  }

  navigateToDeletedUsers(): void {
    this.router.navigate(['/deleted-users']);
  }

  loadReportedUsersStatistics(): void {
    this.reportedUserService.getReportedUsersCount().subscribe(count => {
      this.reportedUsersCount = count;
    });
    this.deletedUserService.getDeletedUserCount().subscribe(count => {
      this.deletedUsersCount = count;
    });
  }

  loadContactRequestsStatistics(): void {
    this.contactRequestService.getContactRequestCounts().subscribe(counts => {
      this.contactRequestsPendingCount = counts.noOperation;
      this.contactRequestsResolvedCount = counts.resolved;
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
