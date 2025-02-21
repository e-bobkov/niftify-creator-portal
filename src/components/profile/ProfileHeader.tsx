
import { User as UserIcon } from "lucide-react";
import { UserProfile } from "@/types/user";

interface ProfileHeaderProps {
  profile: UserProfile;
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => (
  <div className="flex flex-col items-center space-y-4 animate-slide-in">
    <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden transition-transform hover:scale-105">
      <UserIcon className="w-20 h-20 text-primary transition-opacity hover:opacity-80" />
    </div>

    <div className="text-center animate-fade-in">
      <h2 className="text-2xl font-bold">{profile.name}</h2>
      <p className="text-muted-foreground">{profile.email}</p>
    </div>
  </div>
);
