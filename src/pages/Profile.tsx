import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User,
  MessageCircle, Hash, Instagram, Twitter,
  Settings, Grid, User as UserIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { UserProfile } from "@/types/user";
import { useToast } from "@/hooks/use-toast";

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

  // Form states
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
        
        // Преобразуем данные в формат UserProfile
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
        
        // Заполняем форму текущими данными
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
      .filter(([, link]) => link) // Только непустые ссылки
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

      // Обновляем отображаемый профиль
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

  const socialIcons = [
    { icon: MessageCircle, link: profile.social?.telegram, color: "text-blue-500" },
    { icon: Hash, link: profile.social?.discord, color: "text-indigo-500" },
    { icon: Twitter, link: profile.social?.twitter, color: "text-blue-400" },
    { icon: Instagram, link: profile.social?.instagram, color: "text-pink-500" }
  ];

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
            <div className="flex flex-col items-center space-y-4">
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-20 h-20 text-primary" />
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className="text-muted-foreground">{profile.email}</p>
              </div>

              <div className="flex gap-4">
                {socialIcons.map((social, index) => 
                  social.link ? (
                    <a 
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${social.color} hover:opacity-80 transition-opacity`}
                    >
                      <social.icon className="w-6 h-6" />
                    </a>
                  ) : null
                )}
              </div>

              <div className="w-full text-center">
                <h3 className="font-semibold mb-2">Bio</h3>
                <p className="text-muted-foreground">{profile.bio}</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-lg p-6">
            <h3 className="font-semibold mb-4">My Collections</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="text-muted-foreground text-center p-8">
                No collections yet
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="collections">
          <div className="glass-card rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">My Collections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-muted-foreground text-center p-8">
                No collections yet
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="glass-card rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <Input
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="First Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <Input
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <Input
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself"
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Telegram</label>
                    <Input
                      name="social.telegram"
                      value={formData.socialLinks.telegram}
                      onChange={handleInputChange}
                      placeholder="https://t.me/username"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Discord</label>
                    <Input
                      name="social.discord"
                      value={formData.socialLinks.discord}
                      onChange={handleInputChange}
                      placeholder="https://discord.com/users/id"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Instagram</label>
                    <Input
                      name="social.instagram"
                      value={formData.socialLinks.instagram}
                      onChange={handleInputChange}
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Twitter</label>
                    <Input
                      name="social.twitter"
                      value={formData.socialLinks.twitter}
                      onChange={handleInputChange}
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
