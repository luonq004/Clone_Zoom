"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

// Code ở đây chỉ chạy trên server

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
  const user = await currentUser();

  if (!user) throw new Error("User is not logged in");
  if (!apiKey) throw new Error("NO API key");
  if (!apiSecret) throw new Error("NO API secret");

  // StreamClient không đến từ @stream-io/video-react-sdk mà từ @stream-io/node-sdk vì ta đang ở server side. Và nếu ta đang dùng React thưởng thì ta phải tạo 1 node Express server. Nhưng ở đây ta dùng Next.js nên ta không cần phải tạo 1 server riêng biệt, nhg vẫn cần cài stream-io/node-sdk
  const client = new StreamClient(apiKey, apiSecret);

  // exp is optional (by default the token is valid for an hour)
  const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;

  // Thời gian token được phát hành
  const issued = Math.floor(Date.now() / 1000) - 60;

  // Tạo token
  const token = client.createToken(user.id, exp, issued);

  return token;
};
