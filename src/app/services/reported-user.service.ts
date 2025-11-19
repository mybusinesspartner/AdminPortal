import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { UserReport, ReportedUserSummary, ReportStatus, ReportReason } from '../models/reported-user.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ReportedUserService {
  constructor(private userService: UserService) {}

  private createMockReports(users: any[]): UserReport[] {
    const reports: UserReport[] = [];
    
    // Create multiple reports for user '1' (more than 5 reports - 7 reports)
    const user1 = users.find(u => u.id === '1');
    if (user1) {
      const reasons: ReportReason[] = ['Harassment', 'Fraud', 'Privacy Violation', 'Other'];
      for (let i = 1; i <= 7; i++) {
        reports.push({
          id: `report-00${i}`,
          reportedUserId: '1',
          reportedUser: user1,
          reportedBy: `Reporter ${i}`,
          reportedByEmail: `reporter${i}@example.com`,
          reason: reasons[i % reasons.length],
          description: `Report ${i}: User has been reported for ${reasons[i % reasons.length].toLowerCase()}.`,
          status: 'pending',
          reportedAt: new Date(2024, 0, 20 + i)
        });
      }
    }

    // Create reports for other users
    const user2 = users.find(u => u.id === '2');
    if (user2) {
      reports.push({
        id: 'report-008',
        reportedUserId: '2',
        reportedUser: user2,
        reportedBy: 'Alice Reporter',
        reportedByEmail: 'alice.reporter@example.com',
        reason: 'Fraud',
        description: 'This user appears to be involved in fraudulent activities.',
        status: 'investigating',
        reportedAt: new Date(2024, 0, 18)
      });
    }

    const user3 = users.find(u => u.id === '3');
    if (user3) {
      reports.push({
        id: 'report-009',
        reportedUserId: '3',
        reportedUser: user3,
        reportedBy: 'Bob Reporter',
        reportedByEmail: 'bob.reporter@example.com',
        reason: 'Privacy Violation',
        description: 'User is violating privacy by sharing personal information without consent.',
        status: 'pending',
        reportedAt: new Date(2024, 0, 19)
      });
    }
    
    return reports;
  }

  getReportedUserSummaries(): Observable<ReportedUserSummary[]> {
    return this.userService.getAllUsers().pipe(
      map((users: any[]) => {
        const mockReports = this.createMockReports(users);
        const userMap = new Map<string, UserReport[]>();
        
        mockReports.forEach(report => {
          const userId = report.reportedUserId;
          if (!userMap.has(userId)) {
            userMap.set(userId, []);
          }
          userMap.get(userId)!.push(report);
        });

        const summaries: ReportedUserSummary[] = [];
        userMap.forEach((reports, userId) => {
          const user = reports[0].reportedUser;
          const totalReports = reports.length;
          
          const dates = reports.map(r => r.reportedAt.getTime()).sort((a, b) => a - b);
          const firstReportedAt = new Date(dates[0]);
          const lastReportedAt = new Date(dates[dates.length - 1]);
          
          const reasonCounts = new Map<ReportReason, number>();
          reports.forEach(r => {
            reasonCounts.set(r.reason, (reasonCounts.get(r.reason) || 0) + 1);
          });
          let mostCommonReason: ReportReason = 'Other';
          let maxCount = 0;
          reasonCounts.forEach((count, reason) => {
            if (count > maxCount) {
              maxCount = count;
              mostCommonReason = reason;
            }
          });

          const sortedReports = [...reports].sort((a, b) => b.reportedAt.getTime() - a.reportedAt.getTime());
          const latestReport = sortedReports[0];
          const status = latestReport.status;

          const daysSinceLastReport = (Date.now() - lastReportedAt.getTime()) / (1000 * 60 * 60 * 24);
          let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
          if (totalReports >= 10 || (totalReports >= 5 && daysSinceLastReport < 1)) {
            severity = 'critical';
          } else if (totalReports >= 5 || (totalReports >= 3 && daysSinceLastReport < 3)) {
            severity = 'high';
          } else if (totalReports >= 2 || daysSinceLastReport < 7) {
            severity = 'medium';
          }

          summaries.push({
            userId,
            user,
            totalReports,
            reports,
            firstReportedAt,
            lastReportedAt,
            mostCommonReason,
            lastReportReason: latestReport.reason,
            lastReportDescription: latestReport.description,
            lastReportedBy: latestReport.reportedBy,
            lastReportedByEmail: latestReport.reportedByEmail,
            status,
            severity
          });
        });

        summaries.sort((a, b) => {
          const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          if (severityOrder[b.severity] !== severityOrder[a.severity]) {
            return severityOrder[b.severity] - severityOrder[a.severity];
          }
          return b.totalReports - a.totalReports;
        });

        return summaries;
      }),
      delay(300)
    );
  }

  getReportCounts(): Observable<{ pending: number; investigating: number; resolved: number; dismissed: number; total: number }> {
    return this.userService.getAllUsers().pipe(
      map((users: any[]) => {
        const mockReports = this.createMockReports(users);
        const pending = mockReports.filter(r => r.status === 'pending').length;
        const investigating = mockReports.filter(r => r.status === 'investigating').length;
        const resolved = mockReports.filter(r => r.status === 'resolved').length;
        const dismissed = mockReports.filter(r => r.status === 'dismissed').length;
        const total = mockReports.length;

        return { pending, investigating, resolved, dismissed, total };
      }),
      delay(200)
    );
  }

  getReportedUsersCount(): Observable<number> {
    return this.getReportedUserSummaries().pipe(
      map(summaries => summaries.length),
      delay(200)
    );
  }
}

