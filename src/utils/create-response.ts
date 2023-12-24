import { ServerResponse } from 'http';
import { STATUSES } from '../constants';

const createResponse = (
  response: ServerResponse,
  statusCode: STATUSES,
  payload?: unknown,
) => {
  response.writeHead(statusCode, { 'Content-Type': 'application/json' });

  if (typeof payload === 'string') {
    response.end(JSON.stringify({ message: payload }));
  } else {
    response.end(JSON.stringify(payload));
  }
};

export default createResponse;
