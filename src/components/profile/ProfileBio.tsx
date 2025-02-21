
import { UserProfile } from "@/types/user";
import { MessageCircle, Hash, Instagram, Twitter } from "lucide-react";

interface ProfileBioProps {
  profile: UserProfile;
}

export const ProfileBio = ({ profile }: ProfileBioProps) => {
  const socialIcons = [
    { icon: MessageCircle, link: profile.social?.telegram, color: "text-blue-500" },
    { icon: Hash, link: profile.social?.discord, color: "text-indigo-500" },
    { icon: Twitter, link: profile.social?.twitter, color: "text-blue-400" },
    { icon: Instagram, link: profile.social?.instagram, color: "text-pink-500" }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex gap-4 justify-center">
        {socialIcons.map((social, index) => 
          social.link ? (
            <a 
              key={index}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`${social.color} hover:opacity-80 transition-all duration-300 hover:scale-110`}
            >
              <social.icon className="w-6 h-6" />
            </a>
          ) : null
        )}
      </div>

      <div className="w-full text-center animate-slide-in">
        <h3 className="font-semibold mb-2">Bio</h3>
        <p className="text-muted-foreground">{profile.bio}</p>
      </div>
    </div>
  );
};
