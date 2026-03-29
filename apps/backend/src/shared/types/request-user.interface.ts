export interface RequestUser {
  id: string;
  email: string;
  role: string;
  token_version: number;
  is_active: boolean;
  request_token?: string | null;
}