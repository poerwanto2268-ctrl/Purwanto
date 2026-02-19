
export type Gender = 'Laki-laki' | 'Perempuan';

export interface Citizen {
  id: string;
  nik: string;
  name: string;
  pob: string; // Place of Birth
  dob: string; // Date of Birth
  gender: Gender;
  religion: string;
  maritalStatus: string;
  occupation: string;
  address: string;
  isHeadOfFamily: boolean;
  familyCardId: string;
}

export interface FamilyCard {
  id: string;
  noKk: string;
  headName: string;
  address: string;
  rt: string;
  rw: string;
  members: string[]; // List of Citizen IDs
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
}

export interface OfficialLetter {
  id: string;
  type: 'Surat Pengantar' | 'Surat Keterangan Domisili' | 'Surat Kematian';
  citizenId: string;
  date: string;
  purpose: string;
  content: string;
}

export enum ViewMode {
  DASHBOARD = 'DASHBOARD',
  CITIZENS = 'CITIZENS',
  FAMILIES = 'FAMILIES',
  LETTERS = 'LETTERS',
  AI_TOOLS = 'AI_TOOLS',
  TREASURY = 'TREASURY'
}
