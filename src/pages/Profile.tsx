
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Grid, User as UserIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { UserProfile } from "@/types/user";
import { useToast } from "@/hooks/use-toast";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileBio } from "@/components/profile/ProfileBio";
import { ProfileSettings } from "@/components/profile/ProfileSettings";
import { ProfileCollections } from "@/components/profile/ProfileCollections";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface ApiProfile {
  profile: {
    id: string;
    bio: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  socialLinks: {
    social: string;
    link: string;
  }[];
}

const Profile = () => {
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    bio: "",
    socialLinks: {
      telegram: "",
      discord: "",
      instagram: "",
      twitter: ""
    }
  });

  // Запрос профиля с использованием React Query
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await fetch('https://test.ftsoa.art/profile/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data: ApiProfile = await response.json();
      
      // Инициализируем formData при получении данных
      setFormData({
        first_name: data.profile.first_name,
        last_name: data.profile.last_name,
        bio: data.profile.bio || "",
        socialLinks: {
          telegram: data.socialLinks.find(l => l.social === "telegram")?.link || "",
          discord: data.socialLinks.find(l => l.social === "discord")?.link || "",
          instagram: data.socialLinks.find(l => l.social === "instagram")?.link || "",
          twitter: data.socialLinks.find(l => l.social === "twitter")?.link || ""
        }
      });
      
      return {
        id: data.profile.id,
        email: data.profile.email,
        name: `${data.profile.first_name} ${data.profile.last_name}`,
        bio: data.profile.bio || "No bio provided",
        avatar: 0,
        social: data.socialLinks.reduce((acc, link) => ({
          ...acc,
          [link.social]: link.link
        }), {})
      } as UserProfile;
    },
    enabled: isAuthenticated && !!token,
    staleTime: 1000 * 60 * 5, // Кеш действителен 5 минут
    refetchOnWindowFocus: false // Отключаем автоматическое обновление при фокусе окна
  });

  // Мутация для обновления профиля
  const updateProfileMutation = useMutation({
    mutationFn: async (updateData: any) => {
      const response = await fetch('https://test.ftsoa.art/profile/', {
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
      // Инвалидируем кеш после успешного обновления
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("social.")) {
      const socialNetwork = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialNetwork]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const socialLinks = Object.entries(formData.socialLinks)
      .filter(([, link]) => link)
      .map(([social, link]) => ({
        social,
        link
      }));

    const updateData = {
      bio: formData.bio,
      first_name: formData.first_name,
      last_name: formData.last_name,
      socialLinks
    };

    updateProfileMutation.mutate(updateData);
  };

  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  if (isLoading || !profile) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-4xl flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-32 h-32 bg-primary/10 rounded-full mx-auto mb-4"></div>
          <div className="h-4 w-48 bg-primary/10 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl animate-fade-in">
      <Tabs defaultValue="profile" className="space-y-8">
        <div className="flex items-center justify-between">
          <TabsList className="w-full">
            <TabsTrigger value="profile" onClick={() => setActiveTab("profile")} className="flex-1">
              <UserIcon className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="collections" onClick={() => setActiveTab("collections")} className="flex-1">
              <Grid className="w-4 h-4 mr-2" />
              My Collections
            </TabsTrigger>
            <TabsTrigger value="settings" onClick={() => setActiveTab("settings")} className="flex-1">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="profile" className="space-y-8">
          <div className="glass-card rounded-lg p-6 animate-fade-in">
            <ProfileHeader profile={profile} />
            <ProfileBio profile={profile} />
          </div>
          <ProfileCollections />
        </TabsContent>

        <TabsContent value="collections">
          <div className="glass-card rounded-lg p-6 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">My Collections</h2>
            <ProfileCollections />
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="glass-card rounded-lg p-6 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
            <ProfileSettings 
              formData={formData}
              isSaving={updateProfileMutation.isPending}
              onSubmit={handleSubmit}
              onChange={handleInputChange}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
