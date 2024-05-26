import { getPartnerUsername } from './partners.db.mjs';
import {} from './partners.model.mjs';

export const getPartnerInDb = async (username) => {
  const partner = await getPartnerUsername(username);
  if (!partner) {
    return { ok: false, error: 404, errorMsg: 'Partner not found' };
  }

  return { ok: true, value: partner };
};

export const createPartner = async (...args) => {
  let partner = {
    name: args[0],
    username: args[1],
    email: args[2],
    password: '12314',
  };

  delete partner.password;

  await neo4jCreatePartner(partner);

  return { ok: true, value: partner };
};
