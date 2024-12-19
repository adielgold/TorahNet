import { useStreamClient } from "@/context/StreamVideoClient";
import { useUserStore } from "@/stores/userStore";
import { StreamVideo } from "@stream-io/video-react-sdk";
import { ReactNode } from "react";

const ClientWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUserStore();

  const { client } = useStreamClient();

  return (
    <>
      {user ? (
        <StreamVideo client={client!}>{children}</StreamVideo>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default ClientWrapper;
