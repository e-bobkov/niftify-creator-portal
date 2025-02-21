
import { memo } from 'react';

export const ProfileCollections = memo(() => (
  <div className="glass-card rounded-lg p-6 animate-fade-in">
    <h3 className="font-semibold mb-4">My Collections</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="text-muted-foreground text-center p-8 animate-slide-in">
        No collections yet
      </div>
    </div>
  </div>
));

ProfileCollections.displayName = 'ProfileCollections';
