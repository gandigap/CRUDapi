import { IncomingMessage, ServerResponse } from 'http';
import { validate } from 'uuid';
import { STATUSES } from '../constants';
import messages from '../constants/messages';
import database from '../db/db';

const deleteUser = async (req: IncomingMessage, res: ServerResponse) => {
  const userId = req.url?.split('/')[3];

  if (!userId || !validate(userId)) {
    res.statusCode = STATUSES.BAD_REQUEST;
    res.end(JSON.stringify({ error: messages.idIsInvalid }));
    return;
  }
  const deleted = await database.removeUser(userId);

  if (deleted) {
    res.statusCode = STATUSES.NO_CONTENT;
    res.end();
  } else {
    res.statusCode = STATUSES.NOT_FOUND;
    res.end(JSON.stringify({ error: messages.userDoesNotExist }));
  }
};

export default deleteUser;
