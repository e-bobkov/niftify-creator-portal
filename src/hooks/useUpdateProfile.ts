import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";
import { getApiUrl, API_ENDPOINTS } from "@/config/api";

interface ProfileUpdateData {
  bio: string;
  first_name: string;
  last_name: string;
  socialLinks: Array<{
    social: string;
    link: string;
  }>;
}

export const useUpdateProfile = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateData: ProfileUpdateData) => {
      const response = await fetch(getApiUrl(API_ENDPOINTS.PROFILE.MAIN), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  });
};
