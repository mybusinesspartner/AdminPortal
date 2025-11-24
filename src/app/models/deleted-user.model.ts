import { User } from './user.model';

export type DeletionType = 'user_initiated' | 'admin_initiated';

export interface DeletedUser {
  userId: string;
  user: User;
  deletedAt: Date;
  deletionType: DeletionType;
  // For user-initiated deletions
  userMessage?: string;
  // For admin-initiated deletions
  adminReason?: string;
  deletedBy?: string; // Admin ID or username
}

