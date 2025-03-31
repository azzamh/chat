import { DecodedToken } from '@src/shared/types'
import * as userService from '@src/users/services'
import * as chatService from '@src/chats/services'
import * as presenceService from '@src/presence/services'
import { Server, Socket } from 'socket.io'
import * as redis from '@src/shared/redisAdapter'
import pubsubMQ from '@src/shared/pubsubAdapter/PubsubRedisMQ'

const userSocketMap = new Map<string, string>();
/**
 * Fungsi untuk mendaftarkan event "chat" pada socket
 * @param io - instance Server Socket.IO (global)
 * @param socket - instance Socket khusus client yang terhubung
 */
export async function chatHandler(io: Server, socket: Socket) {

  let subscribedUsers: Set<string> = new Set()

  try{
    //user connected
    const tokenData = (socket as any).userData as DecodedToken
    const tokenStr = socket.handshake.query.token as string;
    const username = tokenData.username

    let user = await initConectedUser(tokenStr, username, socket)


    // event "send_messages" 
    socket.on('send_messages', async (data: any) => {
      let parsedData: SendMeddagePayload;
      try {
        parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      } catch (error) {
        console.error('Failed to parse message data:', error);
        return;
      }

      const { roomId, message } = parsedData;
      const resp = await chatService.sendMessage(tokenStr, roomId, message);
    })

    socket.on('subscribe_all_users_presence_in_room', async (data: any) => {
      const { roomId } = data;
      const { data:participants } = await chatService.getRoomParticipants(tokenStr, roomId);

      for (const participant of participants) {
        if (!subscribedUsers.has(participant.username)) {
          pubsubMQ.subscribeToOnlineStatus(tokenData.username, participant.username, async (data) => {
            const socketId = userSocketMap.get(username);
            if (socketId) {
              io.to(socketId).emit('online_status_update', {
                username: participant.username,
                isOnline: data.isOnline,
                lastSeen: data.timestamp,
              });
            }
          })
        }
        subscribedUsers.add(participant.username)
      }
    })

    socket.on('subscribe_to_user_presence', async (data: any) => {
      const { username } = data;
      if (!subscribedUsers.has(username)) {
        pubsubMQ.subscribeToOnlineStatus(tokenData.username, username, async (data) => {
        })
      }
      subscribedUsers.add(username)
    })

    socket.on('online_status_heartbeat', async () => {
      await presenceService.setOnlineStatus(tokenStr, true)
    })

    // Event disconnect
    socket.on('disconnect', async () => {
      subscribedUsers.clear()
      //set user lastactivity &  status to offline
      await presenceService.setOnlineStatus(tokenStr, false)
    })

    pubsubMQ.subscribeMessagesInbox(username, async (data) => {
      const resp = await chatService.getMessageById(tokenStr, data.id as unknown as string)
      const messageData = resp.data
      const socketId = userSocketMap.get(username);
      if (socketId) {
        io.to(socketId).emit('receive_message', messageData);
      }

    });

    pubsubMQ.subscribeMessagesOutbox(username, async (data) => {

      const socketId = userSocketMap.get(username);
      if (socketId) {
        io.to(socketId).emit('send_messages_success', data);
      }
    });

  } catch (error) {
    console.error('Error in chatHandler:', error)
    socket.disconnect()
    // redis.unsubscribeFromChannel(`send_messages:${userId}`)
  }
  
}


interface PubsubPrivateMessageData {
  senderId: string;
  recipientId: string;
  messageId: string;
}

interface SendMeddagData{
  roomId: string;
  message: string;
}

type SendMeddagePayload = SendMeddagData//[SendMeddagData];


async function initConectedUser(tokenStr: string, username: string, socket: Socket) {
  userSocketMap.set(username, socket.id);
  let user = await userService.getUserInfo(tokenStr)

  if (user.status !== 200) {
    socket.disconnect()
    throw new Error('User not found')
  }

  //set user lastactivity &  status to online
  await presenceService.setOnlineStatus(tokenStr, true)//updatePresenceStatus(user.data.id, true)
  return user
}