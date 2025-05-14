
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

export const toast = ({ title, description, action, variant }: ToastProps) => {
  return sonnerToast(title, {
    description,
    action,
    // Map variant to Sonner's type
    type: variant === "destructive" ? "error" : "default",
  });
};

export const useToast = () => {
  return {
    toast,
  };
};
