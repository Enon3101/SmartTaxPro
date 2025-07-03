import { Facebook, Twitter, Linkedin, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SocialShareProps {
  url: string;
  title: string;
  description: string;
}

export const SocialShare = ({ url, title, description }: SocialShareProps) => {
  const shareUrl = `https://myeca.in${url}`;
  
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
  };
  
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground">Share:</span>
      <Button variant="outline" size="sm" asChild>
        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
          <Facebook className="h-4 w-4" />
        </a>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
          <Twitter className="h-4 w-4" />
        </a>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer">
          <Linkedin className="h-4 w-4" />
        </a>
      </Button>
      {navigator.share && (
        <Button variant="outline" size="sm" onClick={handleNativeShare}>
          <Share2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};