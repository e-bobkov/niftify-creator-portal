
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProfileSettingsProps {
  formData: {
    first_name: string;
    last_name: string;
    bio: string;
    socialLinks: {
      telegram: string;
      discord: string;
      instagram: string;
      twitter: string;
    };
  };
  isSaving: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const ProfileSettings = ({ formData, isSaving, onSubmit, onChange }: ProfileSettingsProps) => (
  <form onSubmit={onSubmit} className="space-y-6 animate-fade-in">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2 animate-slide-in" style={{ animationDelay: '100ms' }}>
        <label className="text-sm font-medium">First Name</label>
        <Input
          name="first_name"
          value={formData.first_name}
          onChange={onChange}
          placeholder="First Name"
          className="transition-all duration-300 focus:scale-[1.02]"
        />
      </div>
      <div className="space-y-2 animate-slide-in" style={{ animationDelay: '200ms' }}>
        <label className="text-sm font-medium">Last Name</label>
        <Input
          name="last_name"
          value={formData.last_name}
          onChange={onChange}
          placeholder="Last Name"
          className="transition-all duration-300 focus:scale-[1.02]"
        />
      </div>
    </div>

    <div className="space-y-2 animate-slide-in" style={{ animationDelay: '300ms' }}>
      <label className="text-sm font-medium">Bio</label>
      <Input
        name="bio"
        value={formData.bio}
        onChange={onChange}
        placeholder="Tell us about yourself"
        className="transition-all duration-300 focus:scale-[1.02]"
      />
    </div>

    <div className="space-y-4">
      <h3 className="font-semibold">Social Links</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(formData.socialLinks).map(([social, value], index) => (
          <div key={social} className="space-y-2 animate-slide-in" style={{ animationDelay: `${400 + index * 100}ms` }}>
            <label className="text-sm font-medium capitalize">{social}</label>
            <Input
              name={`social.${social}`}
              value={value}
              onChange={onChange}
              placeholder={`https://${social}.com/username`}
              className="transition-all duration-300 focus:scale-[1.02]"
            />
          </div>
        ))}
      </div>
    </div>

    <Button 
      type="submit" 
      disabled={isSaving}
      className="animate-scale transition-all duration-300 hover:scale-105"
    >
      {isSaving ? "Saving..." : "Save Changes"}
    </Button>
  </form>
);
