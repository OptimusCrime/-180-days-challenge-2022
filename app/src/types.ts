export interface Entry {
  id: number;
  added: number;
  comment: string | null;
}

export interface AuthApiResponse {
  token: string;
}

export interface EntryApiResponse {
  id: number;
  added: string;
  comment: string | null;
}

export interface EntriesApiResponse {
  data: EntryApiResponse[];
}
