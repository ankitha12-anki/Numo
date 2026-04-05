export interface Calculation {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export type AuthPage = 'login' | 'register' | 'forgot-password' | 'reset-password';
