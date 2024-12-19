// withAuth.tsx
import { useRouter } from "next/router";
import { useEffect, useState, ComponentType } from "react";
import { createClient } from "@/utils/supabase/client";
import { useStreamClient } from "@/context/StreamVideoClient";
import { StreamVideo } from "@stream-io/video-react-sdk";
import { Loader } from "lucide-react";

const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P>
): ComponentType<P> => {
  const AuthenticatedComponent = (props: P) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    const supabase = createClient();

    useEffect(() => {
      const checkAuth = async () => {
        const user = await supabase.auth.getUser();
        if (!user?.data || user?.error) {
          router.push("/");
        } else {
          setIsAuthenticated(true);
        }
      };
      checkAuth();
    }, [router]);

    if (!isAuthenticated)
      return (
        <div className="min-h-screen w-full items-center justify-center flex">
          <Loader className="w-12 h-12 animate-spin text-primary-blue" />
        </div>
      );

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
