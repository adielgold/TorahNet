import { createClient } from "@/utils/supabase/client";
import axios from "axios";
import { useEffect, useState } from "react";

const useConnectStreamClient = () => {
  const supabase = createClient();

  const [token, setToken] = useState<string | null>("");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.log(error, "Error getting session");
        return;
      }

      const { data: axiosData } = await axios.get("/api/getStreamToken");

      setToken(axiosData?.token as string);
    })();
  }, []);

  return token;
};

export default useConnectStreamClient;
