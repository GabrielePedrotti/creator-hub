import { Profile } from '@/types/profile';
import { User, AtSign, FileText, Image } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ProfileInfoEditorProps {
  profile: Profile;
  onProfileChange: (updates: Partial<Profile>) => void;
}

const ProfileInfoEditor = ({ profile, onProfileChange }: ProfileInfoEditorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Informazioni Profilo</h3>

      <div className="space-y-4">
        {/* Avatar */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground flex items-center gap-1">
            <Image size={12} />
            Foto Profilo (URL)
          </Label>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <User size={24} />
                </div>
              )}
            </div>
            <Input
              placeholder="https://example.com/avatar.jpg"
              value={profile.avatar}
              onChange={(e) => onProfileChange({ avatar: e.target.value })}
              className="flex-1"
            />
          </div>
        </div>

        {/* Username */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground flex items-center gap-1">
            <AtSign size={12} />
            Username
          </Label>
          <Input
            placeholder="username"
            value={profile.username}
            onChange={(e) => onProfileChange({ username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
          />
          <p className="text-xs text-muted-foreground">
            linkpulse.app/{profile.username || 'username'}
          </p>
        </div>

        {/* Display Name */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground flex items-center gap-1">
            <User size={12} />
            Nome Visualizzato
          </Label>
          <Input
            placeholder="Il tuo nome"
            value={profile.displayName}
            onChange={(e) => onProfileChange({ displayName: e.target.value })}
          />
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground flex items-center gap-1">
            <FileText size={12} />
            Bio
          </Label>
          <Textarea
            placeholder="Una breve descrizione di te..."
            value={profile.bio}
            onChange={(e) => onProfileChange({ bio: e.target.value })}
            rows={3}
            maxLength={150}
          />
          <p className="text-xs text-muted-foreground text-right">
            {profile.bio.length}/150
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoEditor;
