
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { UserProfile } from "@/types/user";

interface ApiProfile {
  profile: {
    id: string;
    bio: string;
    first_name: string;
    last_name: string;
    email: string;
    role: 'user' | 'partner';
  };
  socialLinks: {
    social: string;
    link: string;
  }[];
}

export const useProfile = () => {
  const { token, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await fetch('https://test.ftsoa.art/profile/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch profile');
      }

      const data: ApiProfile = await response.json();
      
      return {
        id: data.profile.id,
        email: data.profile.email,
        name: `${data.profile.first_name} ${data.profile.last_name}`,
        bio: data.profile.bio || "No bio provided",
        avatar: 0,
        role: data.profile.role,
        social: data.socialLinks.reduce((acc, link) => ({
          ...acc,
          [link.social]: link.link
        }), {})
      } as UserProfile;
    },
    enabled: isAuthenticated && !!token,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};
