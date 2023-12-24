import { IncomingMessage, ServerResponse } from 'http';
import { validate } from 'uuid';
import { STATUSES } from '../constants';
import messages from '../constants/messages';
import database from '../db/db';
import { validateRequiredFields, validateFieldsType } from '../utils/validateFields';

const updateUser = async (req: IncomingMessage, res: ServerResponse) => {
  let errors;
  const userId = req.url?.split('/')[3];

  if (!userId || !validate(userId)) {
    res.statusCode = STATUSES.BAD_REQUEST;
    res.end(JSON.stringify({ error: messages.idIsInvalid }));
    return;
  }
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', async () => {
    try {
      const {
        username,
        age,
        hobbies,
      }: { username: string; age: number; hobbies: string[] } = JSON.parse(body);

      if (validateRequiredFields(username, age, hobbies)) {
        res.statusCode = STATUSES.BAD_REQUEST;
        res.end(JSON.stringify({ error: messages.bodyInvalid }));
        return;
      }

      errors = validateFieldsType(username, age, hobbies);

      if (errors) {
        res.statusCode = STATUSES.NOT_FOUND;
        res.end(JSON.stringify({ error: errors }));
        return;
      }
      const updatedUser = await database.updateUser({
        id: userId,
        username,
        age,
        hobbies,
      });

      if (updatedUser) {
        res.statusCode = STATUSES.OK;
        res.end(JSON.stringify(updatedUser));
      } else {
        res.statusCode = STATUSES.NOT_FOUND;
        res.end(JSON.stringify({ error: messages.userDoesNotExist }));
      }
    } catch (error) {
      res.statusCode = STATUSES.BAD_REQUEST;
      res.end(JSON.stringify({ error: messages.bodyInvalid }));
    }
  });
};

export default updateUser;
