import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DocumentVerificationComponent } from './components/document-verification/document-verification.component';
import { SupportTicketsComponent } from './components/support-tickets/support-tickets.component';
import { SupportTicketDetailComponent } from './components/support-ticket-detail/support-ticket-detail.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { ReportedUsersComponent } from './components/reported-users/reported-users.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'document-verification', component: DocumentVerificationComponent, canActivate: [AuthGuard] },
  { path: 'support-tickets', component: SupportTicketsComponent, canActivate: [AuthGuard] },
  { path: 'support-tickets/:id', component: SupportTicketDetailComponent, canActivate: [AuthGuard] },
  { path: 'reported-users', component: ReportedUsersComponent, canActivate: [AuthGuard] },
  { path: 'user/:id', component: UserDetailComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }
];
