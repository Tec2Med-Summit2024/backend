import {
  getTicketDB,
  getQRCodeDB,
  getEventsDB,
  getNotificationsDB,
  searchUsersDB,
  updateSettingsDB,
  getUserTypeDB,
  followUserDB,
  unfollowUserDB,
  getFollowingDB,
  checkFollowingDB
} from './users.db.mjs';

export const getTicket = async (username, role) => {
  const ticket = await getTicketDB(username, role);
  if (!ticket) 
    return { ok: false, error: 404, errorMsg: `${role} not found` };

  return { ok: true, value: ticket };
};
  
export const getQRCode = async (username, role) => {
  const qrCode = await getQRCodeDB(username, role);
  if (!qrCode) 
    return { ok: false, error: 404, errorMsg: `${role} not found` };

  return { ok: true, value: qrCode };
};

export const getEvents = async (username, role) => {
    const events = await getEventsDB(username, role);
    if (!events) 
      return { ok: false, error: 404, errorMsg: `${role} not found` };
  
    return { ok: true, value: events };
};

export const getUserNotifications = async (username, role) => {
  const notifications = await getNotificationsDB(username, role);
  if (!notifications) 
    return { ok: false, error: 404, errorMsg: `${role} not found` };

  return { ok: true, value: notifications };
};


export const searchUsers = async (query, type, user, location, field, institution, interests, expertises, limit) => {
    return { ok: true, value: await searchUsersDB(query, type, user, location, field, institution, interests, expertises, limit) };
};

export const updateUserSettings = async (username, role, data) => {
    const res = await updateSettingsDB(username, role, data);
    if (!res) 
      return { ok: false, error: 404, errorMsg: `${role} not found` };
  
    return { ok: true, value: res };
  };
  
  export const followUser = async (followerUsername, targetUsername) => {
    const res = await followUserDB(followerUsername, targetUsername);
    if (!res.ok) {
      return res;
    }
    
    return { ok: true, value: res.value };
  };
  
  export const unfollowUser = async (followerUsername, targetUsername) => {
    const res = await unfollowUserDB(followerUsername, targetUsername);
    if (!res.ok) {
      return res;
    }
    
    return { ok: true, value: res.value };
  };
  
  export const getFollowing = async (username) => {
    const res = await getFollowingDB(username);
    if (!res.ok) {
      return res;
    }
    
    return { ok: true, value: res.value };
  };
  
  export const checkFollowing = async (followerUsername, targetUsername) => {
    const res = await checkFollowingDB(followerUsername, targetUsername);
    if (!res.ok) {
      return res;
    }
    
    return { ok: true, value: res.value };
  };

export const getUserTypes = async (username, role) => {
  const res = await getUserTypeDB(username, role);
  if (!res) 
    return { ok: false, error: 404, errorMsg: `${role} not found` };

  return { ok: true, value: res };
};

