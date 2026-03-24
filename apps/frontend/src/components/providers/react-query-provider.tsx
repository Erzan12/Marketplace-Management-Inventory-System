// src/components/providers/react-query-provider.tsx
'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}


  // const handleLogin = async () => {
  //   try {
  //     const response = await api.post('/api/auth/login', {
  //       email,
  //       password,
  //     });

  //     const { access_token } = response.data.access_token;

  //     localStorage.setItem('token', access_token);
  //     alert('Login successful!');
  //     router.push('/'); // redirect to homepage
  //   } catch (error) {
  //     console.error(error);
  //     alert('Login failed. Check your credentials.');
  //   }
  // };