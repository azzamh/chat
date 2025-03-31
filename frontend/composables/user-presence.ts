export function useUserPresence() {
  const { $socket } = useNuxtApp()
  const users = ref<UserPresences[]>([]);
  const usersMap = ref<Map<string, UserPresences>>(new Map());
  let statusCheckerInterval: NodeJS.Timeout | null = null;
  const OFFLINE_THRESHOLD = 10000; // 10 seconds in milliseconds

  const subscribeAllUsersPresenceInRoom = (roomId: string) => {
    $socket?.emit('subscribe_all_users_presence_in_room', { roomId });
  }

  const subscribeToUserPresence = (username: string) => {
    $socket?.emit('subscribe_to_user_presence', { username });
  }

  watch($socket.socket, (newVal, oldVal) => {
    initSocketEvents()
  })

  function startStatusChecker() {
    stopStatusChecker();
    statusCheckerInterval = setInterval(() => {
      const now = new Date().getTime();
      usersMap.value.forEach((user, username) => {
        const lastSeenTime = new Date(user.lastSeen).getTime();
        if (user.isOnline && (now - lastSeenTime) > OFFLINE_THRESHOLD) {
          usersMap.value.set(username, {
            ...user,
            isOnline: false
          });
        }
      });
      users.value.forEach((user, index) => {
        const lastSeenTime = new Date(user.lastSeen).getTime();
        if (user.isOnline && (now - lastSeenTime) > OFFLINE_THRESHOLD) {
          users.value[index] = {
            ...user,
            isOnline: false
          };
        }
      });
    }, 5000); // Check every 5 seconds
  }

  function stopStatusChecker() {
    if (statusCheckerInterval) {
      clearInterval(statusCheckerInterval);
      statusCheckerInterval = null;
    }
  }


  function initSocketEvents() {
    $socket?.off('online_status_update')
    $socket?.on('online_status_update', onOlineStatusUpdate)
    startStatusChecker()
  }

  function onOlineStatusUpdate(data: any) {
    const userIndex = users.value.findIndex(user => user.username === data.username);
    usersMap.value.set(data.username, data);
    if (userIndex !== -1) {
      // Update using array methods to maintain reactivity
      users.value[userIndex] = {
        ...users.value[userIndex],
        isOnline: data.isOnline,
        lastSeen: data.lastSeen
      };
    }else{
      // Add new user
      users.value.push({
        username: data.username,
        isOnline: data.isOnline,
        lastSeen: data.lastSeen,
        isTyping: false,
        lastTyped: new Date().toDateString()
      });
    }
  }

  return {
    users,
    usersMap,
    subscribeToUserPresence,
    subscribeAllUsersPresenceInRoom,
    initSocketEvents
  }
}

export interface UserPresences {
  username: string;
  isOnline: boolean;
  lastSeen: string;
  isTyping: boolean;
  lastTyped: string;
}


