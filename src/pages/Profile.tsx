
import { useState, useEffect } from "react";
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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
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
        
        const userProfile = {
          id: data.profile.id,
          email: data.profile.email,
          name: `${data.profile.first_name} ${data.profile.last_name}`,
          bio: data.profile.bio || "No bio provided",
          avatar: 0,
          social: data.socialLinks.reduce((acc, link) => ({
            ...acc,
            [link.social]: link.link
          }), {})
        };

        setProfile(userProfile);
        
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
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && token) {
      fetchProfile();
    }
  }, [isAuthenticated, token]);

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
    setIsSaving(true);

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

    try {
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

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      if (profile) {
        setProfile({
          ...profile,
          name: `${formData.first_name} ${formData.last_name}`,
          bio: formData.bio,
          social: formData.socialLinks
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  if (isLoading || !profile) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-4xl flex items-center justify-center">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
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
          <div className="glass-card rounded-lg p-6">
            <ProfileHeader profile={profile} />
            <ProfileBio profile={profile} />
          </div>
          <ProfileCollections />
        </TabsContent>

        <TabsContent value="collections">
          <div className="glass-card rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">My Collections</h2>
            <ProfileCollections />
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="glass-card rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
            <ProfileSettings 
              formData={formData}
              isSaving={isSaving}
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
