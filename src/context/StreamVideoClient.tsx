import { useToast } from "@/components/ui/use-toast";
import { useUserStore } from "@/stores/userStore";
import { createClient } from "@/utils/supabase/client";
import { StreamVideoClient } from "@stream-io/video-react-sdk";
import axios from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type StreamContextType = {
  client: StreamVideoClient | null;
  setClient: (client: StreamVideoClient) => void;
  token: string | null;
  setToken: (token: string) => void;
};

const StreamContext = createContext<StreamContextType | null>(null);

const StreamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [token, setToken] = useState<string>("");
  const { user } = useUserStore();

  const supabase = createClient();

  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.log(error, "Error getting session");
          toast({
            title: "Error getting session",
            description: "Error getting session",
            variant: "destructive",
          });
          return;
        }

        const { data: axiosData } = await axios.get("/api/getStreamToken");

        setToken(axiosData?.token as string);

        const client = new StreamVideoClient({
          apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
          user: { id: user?.id, name: user?.name!, image: user?.image_url! },
          token: axiosData?.token as string,
        });

        setClient(client);
      } catch (error) {
        console.log(error, "Error from stream");

        toast({
          title: "Failed Initialization of Stream",
          description: "Failed to get stream token",
        });
      }
    })();

    return () => {
      if (client) {
        client?.disconnectUser();
        setClient(null);
        setToken("");
      }
    };
  }, [user]);

  return (
    <StreamContext.Provider value={{ client, setClient, token, setToken }}>
      {children}
    </StreamContext.Provider>
  );
};

export const useStreamClient = () => {
  const streamContext = useContext(StreamContext);

  if (!streamContext) {
    throw new Error(
      "useCurrentUser has to be used within <StreamContext.Provider>"
    );
  }

  return streamContext;
};

export default StreamProvider;
