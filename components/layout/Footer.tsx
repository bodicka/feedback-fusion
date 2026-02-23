import { Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto px-4 py-5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>by the ART</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{currentYear} Feedback Fusion. All rights reserver.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
