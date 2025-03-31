import * as redis from '../../shared/redisAdapter';
import pubsubMQ from '@src/shared/pubsubAdapter/PubsubRedisMQ';
import * as dao from '../dao';
import { InternalServerErrorResponse, OkResponse } from "@src/shared/commons/patterns";


export async function getOnlineStatus(username: string) {
  try {
    let isOnline = await redis.getKey(`status:online:username:${username}`, 'false') === 'true'
    let last_seen: string | undefined = await redis.getKey(`status:last_seen:username:${username}`) ?? undefined
    if (!last_seen) {
      const last_seen_db = await dao.getUserLastSeen(username)
      last_seen = last_seen_db ? last_seen_db.toISOString() : undefined
    }
    return new OkResponse({ 
      username: username,
      is_online: isOnline,
      last_seen: last_seen
    }).generate()
  } catch (err: any) {
    return new InternalServerErrorResponse(err).generate()
  }
}

export async function setOnlineStatus(userId: string, username: string, status: boolean) {
  try {
    const last_seen = new Date();
    await redis.setKey(`status:online:username:${username}`, `${status}`, 30)
    await redis.setKey(`status:last_seen:username:${username}`, last_seen.toISOString(), undefined)
    dao.upsertUserLastSeen(userId, username, last_seen);
    await pubsubMQ.publishOnlineStatus(
      username,
      {
        userId,
        username,
        isOnline: status,
        timestamp: last_seen.toISOString()
      }
    );

    return new OkResponse({ status: 'success' }).generate()
  } catch (err: any) {
    // console.error('setOnlineStatus error:', err);
    return new InternalServerErrorResponse(err).generate()
  }
}



