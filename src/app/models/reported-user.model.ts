import { User } from './user.model';

export type ReportStatus = 'pending' | 'investigating' | 'resolved' | 'dismissed';
export type ReportReason = 'Harassment' | 'Fraud' | 'Privacy Violation' | 'Other';

export interface UserReport {
  id: string;
  reportedUserId: string;
  reportedUser: User;
  reportedBy: string;
  reportedByEmail: string;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  reportedAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolutionNotes?: string;
}

export interface ReportedUserSummary {
  userId: string;
  user: User;
  totalReports: number;
  reports: UserReport[];
  firstReportedAt: Date;
  lastReportedAt: Date;
  mostCommonReason: ReportReason;
  lastReportReason: ReportReason;
  lastReportDescription: string;
  lastReportedBy: string;
  lastReportedByEmail: string;
  status: ReportStatus;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

