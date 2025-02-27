
import { Author } from "@/types/user";
import { ArrowLeft, MessageCircle, Hash, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AuthorSocial } from "@/types/user";

interface AuthorHeaderProps {
  author: Author;
  socials?: AuthorSocial[];
}

export const AuthorHeader = ({ author, socials }: AuthorHeaderProps) => {
  const navigate = useNavigate();

  // Преобразуем массив socials в объект для удобного доступа
  const socialsMap = socials?.reduce((acc, social) => {
    acc[social.social] = social.link;
    return acc;
  }, {} as Record<string, string>) || {};

  const socialIcons = [
    {
      icon: MessageCircle,
      link: socialsMap.telegram,
      color: "text-blue-500"
    }, 
    {
      icon: Hash,
      link: socialsMap.discord,
      color: "text-indigo-500"
    }, 
    {
      icon: Twitter,
      link: socialsMap.twitter,
      color: "text-blue-400"
    }, 
    {
      icon: Instagram,
      link: socialsMap.instagram,
      color: "text-pink-500"
    }
  ];

  return (
    <div className="mb-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2 mb-4">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <div className="glass-card rounded-xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold">
            {author.first_name?.charAt(0)}{author.last_name?.charAt(0)}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold mb-2">
              {author.first_name} {author.last_name}
            </h1>
            
            <p className="text-muted-foreground mb-4">
              {author.bio || "No bio provided"}
            </p>
            
            <div className="flex gap-4 justify-center md:justify-start">
              {socialIcons.map((social, index) => social.link ? (
                <a 
                  key={index} 
                  href={social.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`${social.color} hover:opacity-80 transition-opacity`}
                >
                  <social.icon className="w-6 h-6" />
                </a>
              ) : null)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
