import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, UserRound, Users, PersonStanding, UserCircle,
  MessageCircle, Hash, Instagram, Twitter,
  Settings, Grid, User as UserIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { UserProfile } from "@/types/user";

const AVATAR_OPTIONS = [
  { icon: User, id: 0 },
  { icon: UserRound, id: 1 },
  { icon: Users, id: 2 },
  { icon: PersonStanding, id: 3 },
  { icon: UserCircle, id: 4 },
];

const mockUserProfile: UserProfile = {
  id: "1",
  email: "user@example.com",
  name: "John Doe",
  bio: "Digital art enthusiast and collector",
  avatar: 0,
  social: {
    telegram: "https://t.me/username",
    discord: "username#1234",
    twitter: "https://twitter.com/username",
    instagram: "https://instagram.com/username"
  }
};

const Profile = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [profile] = useState<UserProfile>(mockUserProfile);

  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  const AvatarIcon = AVATAR_OPTIONS[profile.avatar].icon;

  const socialIcons = [
    { icon: MessageCircle, link: profile.social?.telegram, color: "text-blue-500" },
    { icon: Hash, link: profile.social?.discord, color: "text-indigo-500" },
    { icon: Twitter, link: profile.social?.twitter, color: "text-blue-400" },
    { icon: Instagram, link: profile.social?.instagram, color: "text-pink-500" }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Tabs defaultValue="profile" className="space-y-8">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="profile" onClick={() => setActiveTab("profile")}>
              <UserIcon className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="collections" onClick={() => setActiveTab("collections")}>
              <Grid className="w-4 h-4 mr-2" />
              My Collections
            </TabsTrigger>
            <TabsTrigger value="settings" onClick={() => setActiveTab("settings")}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="profile" className="space-y-8">
          <div className="bg-card rounded-lg p-6 shadow-lg">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                <AvatarIcon className="w-20 h-20 text-primary" />
              </div>
              
              <div className="flex gap-2">
                {AVATAR_OPTIONS.map((avatar) => (
                  <Button
                    key={avatar.id}
                    variant={profile.avatar === avatar.id ? "default" : "outline"}
                    size="icon"
                    className="rounded-full"
                    // onClick={() => handleAvatarChange(avatar.id)}
                  >
                    <avatar.icon className="w-5 h-5" />
                  </Button>
                ))}
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

              <div className="w-full">
                <h3 className="font-semibold mb-2">Bio</h3>
                <p className="text-muted-foreground">{profile.bio}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-lg">
            <h3 className="font-semibold mb-4">My Collections</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Collection items will go here */}
              <div className="text-muted-foreground text-center p-8">
                No collections yet
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="collections">
          <div className="bg-card rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">My Collections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Full collections list will go here */}
              <div className="text-muted-foreground text-center p-8">
                No collections yet
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="bg-card rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Settings</h2>
            {/* Settings form will go here */}
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
