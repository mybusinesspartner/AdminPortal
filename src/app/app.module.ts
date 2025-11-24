import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DocumentVerificationComponent } from './components/document-verification/document-verification.component';
import { SupportTicketsComponent } from './components/support-tickets/support-tickets.component';
import { SupportTicketDetailComponent } from './components/support-ticket-detail/support-ticket-detail.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { DocumentViewerComponent } from './components/document-viewer/document-viewer.component';
import { ToastComponent } from './components/toast/toast.component';
import { ReportedUsersComponent } from './components/reported-users/reported-users.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { DeletedUsersComponent } from './components/deleted-users/deleted-users.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    DocumentVerificationComponent,
    SupportTicketsComponent,
    SupportTicketDetailComponent,
    UserListComponent,
    UserDetailComponent,
    DocumentViewerComponent,
    ToastComponent,
    ReportedUsersComponent,
    ContactUsComponent,
    DeletedUsersComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

