
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAdminGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("Bu sayfaya erişmek için giriş yapmanız gerekiyor");
          navigate("/auth");
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", session.user.id)
          .single();

        if (error || !profile?.is_admin) {
          toast.error("Bu sayfaya erişim yetkiniz bulunmuyor");
          navigate("/");
          return;
        }
      } catch (error) {
        console.error("Admin kontrolü sırasında hata:", error);
        toast.error("Bir hata oluştu");
        navigate("/");
      }
    };

    checkAdminStatus();
  }, [navigate]);
};
