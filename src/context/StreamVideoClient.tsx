import ToasterTitle from "@/components/ui/toaster-title";
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
  const { toast } = useToast();

  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    let currentClient: StreamVideoClient | null = null;

    const initializeClient = async () => {
      try {
        // If there's an existing client, disconnect it first
        if (client) {
          console.log("Disconnecting existing client");
          await client.disconnectUser();
          setClient(null);
        }

        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.log(error, "Error getting session");
          toast({
            title: <ToasterTitle title="Error getting session" type="error" />,
            description: "Error getting session",
            variant: "destructive",
          });
          return;
        }

        const { data: axiosData } = await axios.get("/api/getStreamToken");
        setToken(axiosData?.token as string);

        console.log("Initializing new Stream client for user:", user.id);
        currentClient = new StreamVideoClient({
          apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
          user: {
            id: user?.id,
            name: user?.name!,
            image: user?.image_url!,
            // Add a timestamp to help track client instances
            custom: {
              clientInitTime: new Date().toISOString(),
            },
          },
          token: axiosData?.token as string,
        });

        setClient(currentClient);
      } catch (error) {
        console.log(error, "Error from stream");
        toast({
          title: (
            <ToasterTitle
              title="Failed Initialization of Stream"
              type="error"
            />
          ),
          description: "Failed to get stream token",
        });
      }
    };

    initializeClient();

    // Cleanup function that runs on unmount or before re-running effect
    return () => {
      console.log("Cleaning up Stream client connection");
      if (currentClient) {
        currentClient.disconnectUser();
      }
      if (client) {
        client.disconnectUser();
      }
      setClient(null);
      setToken("");
    };
  }, [user]); // Keep user as the only dependency

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
