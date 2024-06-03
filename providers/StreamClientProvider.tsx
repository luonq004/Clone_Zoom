"use client";

import { tokenProvider } from "@/actions/stream.actions";
import Loader from "@/components/Loader";
import { useUser } from "@clerk/nextjs";
import {
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-sdk";
import { ReactNode, useEffect, useState } from "react";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
// const userId = "user-id";
// const token = "authentication-token";
// const user: User = { id: userId };

// const client = new StreamVideoClient({ apiKey, user, token });
// const call = client.call("default", "my-first-call");
// call.join({ create: true });

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const { user, isLoaded } = useUser();
  // console.log("user", user);

  useEffect(() => {
    if (!isLoaded || !user) return;
    if (!apiKey) throw new Error("Stream API key is required");

    // Chỉ khi có user với api thì mới tạo 1 video client
    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: user?.id,
        name: user?.username || user?.id,
        image: user?.imageUrl,
      },
      tokenProvider: tokenProvider,
    });

    setVideoClient(client);
  }, [user, isLoaded]);

  if (!videoClient) return <Loader />;

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
