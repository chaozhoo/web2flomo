export type NavItem = 'library' | 'notes';

export interface Note {
  id: string;
  title: string;
  content: string;
  status: 'pending' | 'imported' | 'deleted';
  createdAt: string;
  updatedAt: string;
}

export interface Library {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'deleted';
  createdAt: string;
  updatedAt: string;
}