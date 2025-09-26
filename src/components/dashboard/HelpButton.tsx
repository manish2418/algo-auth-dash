import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

/**
 * Help Button Component
 * 
 * Fixed position help button that appears in the bottom right corner
 * of the dashboard for user assistance.
 */
export const HelpButton = () => {
  return (
    <Button
      className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700"
      size="icon"
    >
      <HelpCircle className="h-6 w-6" />
    </Button>
  );
}; 