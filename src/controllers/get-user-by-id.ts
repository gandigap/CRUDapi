import { IncomingMessage, ServerResponse } from 'http';
import { validate } from 'uuid';
import { STATUSES } from '../constants';
import messages from '../constants/messages';
import database from '../db/db';

const getUserById = async (req: IncomingMessage, res: ServerResponse) => {
  const userId = req.url?.split('/')[3];
  if (!userId || !validate(userId)) {
    res.statusCode = STATUSES.BAD_REQUEST;
    res.end(JSON.stringify({ error: messages.idIsInvalid }));
    return;
  }
  const user = await database.findOneUserById(userId);
  if (user) {
    res.statusCode = STATUSES.OK;
    res.end(JSON.stringify(user));
  } else {
    res.statusCode = STATUSES.NOT_FOUND;
    res.end(JSON.stringify({ error: messages.userDoesNotExist }));
  }
};

export default getUserById;
