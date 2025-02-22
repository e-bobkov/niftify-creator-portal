
import { useState, useEffect } from "react";
import { ProfileSettings } from "./ProfileSettings";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { UserProfile } from "@/types/user";

interface ProfileFormProps {
  profile: UserProfile;
}

export const ProfileForm = ({ profile }: ProfileFormProps) => {
  const updateProfileMutation = useUpdateProfile();
  
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
    if (profile) {
      const [firstName, lastName] = profile.name.split(" ");
      setFormData({
        first_name: firstName,
        last_name: lastName || "",
        bio: profile.bio,
        socialLinks: {
          telegram: profile.social?.telegram || "",
          discord: profile.social?.discord || "",
          instagram: profile.social?.instagram || "",
          twitter: profile.social?.twitter || ""
        }
      });
    }
  }, [profile]);

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

  return (
    <ProfileSettings 
      formData={formData}
      isSaving={updateProfileMutation.isPending}
      onSubmit={handleSubmit}
      onChange={handleInputChange}
    />
  );
};
