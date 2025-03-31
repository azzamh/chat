import * as redis from '../../shared/redisAdapter';
import pubsubMQ from '@src/shared/pubsubAdapter/PubsubRedisMQ'
import { InternalServerErrorResponse, OkResponse } from "@src/shared/commons/patterns";


export async function getTypingStatus(username: string) {
  try {
    let isTyping = await redis.getKey(`status:typing:username:${username}`)
    return new OkResponse({ is_typing: isTyping === 'true' }).generate()
  } catch (err: any) {
    return new InternalServerErrorResponse(err).generate()
  }
}

export async function setTypingStatus(userId: string, username: string, status: boolean) {
  try {
    await redis.setKey(`status:typing:username:${username}`, `${status}`, 10)
    await pubsubMQ.publishTypingStatus(
      username,
      {
        userId,
        username,
        isTyping: status,
        timestamp: new Date().toISOString()
      }
    );  
    return new OkResponse({ status: 'success' }).generate()
  } catch (err: any) {
    return new InternalServerErrorResponse(err).generate()
  }
}
