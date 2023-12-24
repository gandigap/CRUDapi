import { IncomingMessage, ServerResponse } from 'http';

import { DEFAULT_END_POINT, METHODS, STATUSES } from '../constants';
import {
  getUsers, deleteUser, updateUser, createUser, getUserById,
} from '../controllers';

const handleUsersRequest = (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const { method, url } = req;

  if (method === METHODS.GET && url === DEFAULT_END_POINT) {
    getUsers(req, res);
  } else if (method === METHODS.GET && url?.startsWith(DEFAULT_END_POINT)) {
    getUserById(req, res);
  } else if (method === METHODS.POST && url === DEFAULT_END_POINT) {
    createUser(req, res);
  } else if (method === METHODS.PUT && url?.startsWith(DEFAULT_END_POINT)) {
    updateUser(req, res);
  } else if (method === METHODS.DELETE && url?.startsWith(DEFAULT_END_POINT)) {
    deleteUser(req, res);
  } else {
    res.statusCode = STATUSES.NOT_FOUND;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
  }
};

export default handleUsersRequest;
