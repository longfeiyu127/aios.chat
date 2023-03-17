import axios from "axios";
import https from "https";
import { log } from "logger";
import type { NextApiRequest, NextApiResponse } from "next";
import { encode } from "../../common/encoder/encoder";
import { StreamChat } from "stream-chat";

const client = axios.create({
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
    "Content-Type": "application/json",
    Host: "api.aioschat.com",
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

/**
 * 
{
  type: 'message.new',
  cid: 'messaging:!members-yTaIiCO1GUuTKOR6ajNFQsHnGic3y-wntFV_nDVAZME',
  channel_id: '!members-yTaIiCO1GUuTKOR6ajNFQsHnGic3y-wntFV_nDVAZME',
  channel_type: 'messaging',
  message: {
    id: 'longjueyue-948S8JrfGLXsdpxvgHyUm',
    text: '测试一下',
    html: '<p>测试一下</p>\n',
    type: 'regular',
    user: {
      id: 'longjueyue',
      role: 'user',
      created_at: '2023-03-08T08:53:22.993329Z',
      updated_at: '2023-03-10T10:09:28.512551Z',
      last_active: '2023-03-08T08:53:24.598836Z',
      banned: false,
      online: false,
      teams: [Array],
      name: 'longjueyue',
      image: '/src/assets/userImages/photo-1569443693539-175ea9f007e8.jpeg',
      last_name: '',
      first_name: '',
      staff_user: true,
      dashboard_user: true
    },
    attachments: [],
    latest_reactions: [],
    own_reactions: [],
    reaction_counts: {},
    reaction_scores: {},
    reply_count: 0,
    cid: 'messaging:!members-yTaIiCO1GUuTKOR6ajNFQsHnGic3y-wntFV_nDVAZME',
    created_at: '2023-03-10T10:13:48.572585Z',
    updated_at: '2023-03-10T10:13:48.572585Z',
    shadowed: false,
    mentioned_users: [],
    silent: false,
    pinned: false,
    pinned_at: null,
    pinned_by: null,
    pin_expires: null
  },
  user: {
    id: 'longjueyue',
    role: 'user',
    created_at: '2023-03-08T08:53:22.993329Z',
    updated_at: '2023-03-10T10:09:28.512551Z',
    last_active: '2023-03-08T08:53:24.598836Z',
    banned: false,
    online: false,
    teams: [ 'red', 'blue', 'ai-chat' ],
    channel_unread_count: 0,
    image: '/src/assets/userImages/photo-1569443693539-175ea9f007e8.jpeg',
    last_name: '',
    unread_channels: 0,
    channel_last_read_at: '2023-03-10T10:08:09.324526848Z',
    unread_count: 0,
    dashboard_user: true,
    name: 'longjueyue',
    staff_user: true,
    total_unread_count: 0,
    first_name: ''
  },
  watcher_count: 1,
  team: 'red',
  created_at: '2023-03-10T10:13:48.579756065Z',
  members: [
    {
      user_id: 'chat-robot',
      user: [Object],
      created_at: '2023-03-10T07:17:19.968506Z',
      updated_at: '2023-03-10T07:17:19.968506Z',
      banned: false,
      shadow_banned: false,
      role: 'member',
      channel_role: 'channel_member'
    },
    {
      user_id: 'longjueyue',
      user: [Object],
      created_at: '2023-03-10T07:17:19.968506Z',
      updated_at: '2023-03-10T07:17:19.968506Z',
      banned: false,
      shadow_banned: false,
      role: 'owner',
      channel_role: 'channel_member'
    }
  ],
  message_id: 'longjueyue-948S8JrfGLXsdpxvgHyUm'
}
 * @param res 
 */

const sendMsg = async (id: string, msg: string) => {
  log(`id: ${id}`);
  log(`msg: ${msg}`);
  const client = new StreamChat(
    process.env.STREAM_CHAT_API_KEY!,
    process.env.STREAM_CHAT_API_SECRET,
    {
      axiosRequestConfig: {
        timeout: 300000,
      },
    }
  );
  const channel = client.channel("messaging", id);
  // Here, 'travel' will be the channel ID
  await channel.create();

  channel.sendMessage({
    text: msg,
    user_id: "chat-robot",
  });
};

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.body?.type === "message.new" && req.body?.user?.id !== "chat-robot") {
    if (
      (req.body.members as Array<any>).some(
        (item: any) => item.user_id === "chat-robot"
      )
    ) {
      const messages = req.body.message.text;
      const data = {
        messages: [{ role: "user", content: messages }],
        tokensLength: encode(messages).length,
        model: "gpt-3.5-turbo",
      };
      // https://api.aioschat.com
      client
        .post("https://api.aioschat.com", data, {})
        .then((res) => {
          log(`res: ${res.status}`);
          if (
            res.status === 200 &&
            res.data?.choices &&
            res.data?.choices[0]?.block === false
          ) {
            const text = res.data?.choices[0]?.text
              ?.trimStart()
              .replace(/\n{1,}/g, "")
              .replace(/'/g, '"');
            log(`text ${text}`);
            text && sendMsg(req.body.channel_id, text);
          }
        })
        .catch((err) => {
          log(`err aioschat: ${err}`);
          console.log("err", err);
        });

      // client.get("https://www.baidu.com/").then((res) => {
      //   console.log("res", res.status);
      // });
    }
  }

  res.json({
    code: 0,
    msg: "成功",
  });
}
