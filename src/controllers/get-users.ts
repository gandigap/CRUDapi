import { IncomingMessage, ServerResponse } from 'http';
import { STATUSES } from '../constants';
import database from '../db/db';

const getUsers = async (_req: IncomingMessage, res: ServerResponse) => {
  const allUsers = await database.findUsers();
  res.statusCode = STATUSES.OK;
  res.end(JSON.stringify(allUsers));
};

export default getUsers;
