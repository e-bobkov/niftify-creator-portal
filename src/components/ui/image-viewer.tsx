
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BaseComponentProps } from "@/types/common";

interface ImageViewerProps extends BaseComponentProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageViewer = ({ src, alt, isOpen, onClose }: ImageViewerProps) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </DialogContent>
  </Dialog>
);
