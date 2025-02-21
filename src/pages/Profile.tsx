
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User,
  MessageCircle, Hash, Instagram, Twitter,
  Settings, Grid, User as UserIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { UserProfile } from "@/types/user";

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
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        setProfile({
          id: data.profile.id,
          email: data.profile.email,
          name: `${data.profile.first_name} ${data.profile.last_name}`,
          bio: data.profile.bio || "No bio provided",
          avatar: 0,
          social: data.socialLinks.reduce((acc, link) => ({
            ...acc,
            [link.social]: link.link
          }), {})
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
            <h2 className="text-2xl font-bold mb-6">Settings</h2>
            <div className="text-muted-foreground text-center p-8">
              Settings page is under construction
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
