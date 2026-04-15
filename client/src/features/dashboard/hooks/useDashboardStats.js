import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard.api';

/**
 * Hook to fetch admin dashboard statistics
 */
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: dashboardApi.getStats,
    staleTime: 60_000, // 1 minute
  });
};
