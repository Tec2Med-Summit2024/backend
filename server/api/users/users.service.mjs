import { 
  getTicketDB,
  getQRCodeDB,
  getEventsDB,
  getConnectionsDB,
  getNotificationsDB,
  searchUsersDB,
  updateSettingsDB
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

export const getConnections = async (username, role) => {
    const connections = await getConnectionsDB(username, role);
    if (!connections) 
      return { ok: false, error: 404, errorMsg: `${role} not found` };
  
    return { ok: true, value: connections };
};

export const getUserNotifications = async (username, role) => {
  const notifications = await getNotificationsDB(username, role);
  if (!notifications) 
    return { ok: false, error: 404, errorMsg: `${role} not found` };

  return { ok: true, value: notifications };
};


export const searchUsers = async (query, type, user, location, field, institution, interests) => {
    if(!type)
      return { ok: false, error: 400, errorMsg: 'type is required' };
    return { ok: true, value: await searchUsersDB(query, type, user, location, field, institution, interests) };
};

export const updateUserSettings = async (username, role, data) => {
    const res = await updateSettingsDB(username, role, data);
    if (!res) 
      return { ok: false, error: 404, errorMsg: `${role} not found` };
  
    return { ok: true, value: res };
};
