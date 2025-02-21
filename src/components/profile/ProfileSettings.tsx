
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
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">First Name</label>
        <Input
          name="first_name"
          value={formData.first_name}
          onChange={onChange}
          placeholder="First Name"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Last Name</label>
        <Input
          name="last_name"
          value={formData.last_name}
          onChange={onChange}
          placeholder="Last Name"
        />
      </div>
    </div>

    <div className="space-y-2">
      <label className="text-sm font-medium">Bio</label>
      <Input
        name="bio"
        value={formData.bio}
        onChange={onChange}
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
            onChange={onChange}
            placeholder="https://t.me/username"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Discord</label>
          <Input
            name="social.discord"
            value={formData.socialLinks.discord}
            onChange={onChange}
            placeholder="https://discord.com/users/id"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Instagram</label>
          <Input
            name="social.instagram"
            value={formData.socialLinks.instagram}
            onChange={onChange}
            placeholder="https://instagram.com/username"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Twitter</label>
          <Input
            name="social.twitter"
            value={formData.socialLinks.twitter}
            onChange={onChange}
            placeholder="https://twitter.com/username"
          />
        </div>
      </div>
    </div>

    <Button type="submit" disabled={isSaving}>
      {isSaving ? "Saving..." : "Save Changes"}
    </Button>
  </form>
);
