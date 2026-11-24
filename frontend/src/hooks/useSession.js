import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

export function useSession() {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => (await api.get('/auth/me')).data.data,
    retry: false,
    staleTime: 60_000,
  });
}
