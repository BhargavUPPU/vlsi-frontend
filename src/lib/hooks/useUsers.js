import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usersService } from '../api/services/admin';
import { useGetAll, useGetById, useCreate, useUpdate, useDelete } from './useAdmin';

// User management hooks
export const useUsers = (options) => useGetAll('users', usersService, options);
export const useUser = (id, options) => useGetById('users', usersService, id, options);
export const useCreateUser = (options) => useCreate('users', usersService, options);
export const useUpdateUser = (options) => useUpdate('users', usersService, options);
export const useDeleteUser = (options) => useDelete('users', usersService, options);

export const useUpdateUserRole = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, role }) => usersService.updateRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User role updated successfully');
      options.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update user role');
      options.onError?.(error);
    }
  });
};

export const useResetPassword = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId) => usersService.resetPassword(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Password reset successfully');
      options.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reset password');
      options.onError?.(error);
    }
  });
};
