

export interface Transaction {  id: string;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  status: 'success' | 'processing' | 'failed';
  date: string;
  amount: string;
}
