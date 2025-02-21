
import { User as UserIcon } from "lucide-react";
import { UserProfile } from "@/types/user";

interface ProfileHeaderProps {
  profile: UserProfile;
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => (
  <div className="flex flex-col items-center space-y-4">
    <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
      <UserIcon className="w-20 h-20 text-primary" />
    </div>

    <div className="text-center">
      <h2 className="text-2xl font-bold">{profile.name}</h2>
      <p className="text-muted-foreground">{profile.email}</p>
    </div>
  </div>
);
