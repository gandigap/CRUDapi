import { IncomingMessage, ServerResponse } from 'http';
import { STATUSES } from '../constants';
import messages from '../constants/messages';
import database from '../db/db';
import { validateRequiredFields, validateFieldsType } from '../utils/validateFields';

const createUser = async (req: IncomingMessage, res: ServerResponse) => {
  let body = '';
  let errors;
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', async () => {
    try {
      const {
        username,
        age,
        hobbies,
      }: { username: string; age: number; hobbies: string[] | [] } = JSON.parse(body);
      if (validateRequiredFields(username, age, hobbies)) {
        res.statusCode = STATUSES.BAD_REQUEST;
        res.end(JSON.stringify({ error: messages.bodyInvalid }));
        return;
      }
      errors = validateFieldsType(username, age, hobbies);
      if (errors) {
        res.statusCode = STATUSES.BAD_REQUEST;
        res.end(JSON.stringify({ error: errors }));
        return;
      }
      const newUser = await database.createUser({ username, age, hobbies });
      res.statusCode = STATUSES.CREATED;
      res.end(JSON.stringify(newUser));
    } catch (error) {
      res.statusCode = STATUSES.BAD_REQUEST;
      res.end(JSON.stringify({ error: messages.bodyInvalid }));
    }
  });
};

export default createUser;
