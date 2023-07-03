import { createServer } from 'http';

import { METHODS, STATUSES } from '../constants';
import getRouter from './routers/get-router';
import postRouter from './routers/post-router';
import deleteRouter from './routers/delete-router';
import putRouter from './routers/put-router';
import createResponse from '../utils/create-response';
import messages from '../constants/messages';
import { PORT } from '../config';

const HOST = 'localhost';
const server = createServer();

server.on('request', async (request, response) => {
  const {
    GET, POST, PUT, DELETE,
  } = METHODS;
  try {
    switch (request.method) {
      case GET:
        getRouter(request, response);
        break;
      case POST:
        await postRouter(request, response);
        break;
      case PUT:
        await putRouter(request, response);
        break;
      case DELETE:
        await deleteRouter(request, response);
        break;
      default:
        response.statusCode = STATUSES.BAD_REQUEST;
        response.write('No Response');
        response.end('Start HTTP server');
    }
  } catch (error: any) {
    switch (error.message) {
      case messages.idIsInvalid:
      case messages.bodyInvalid:
        createResponse(response, STATUSES.BAD_REQUEST, error.message);
        break;
      case messages.userDoesNotExist:
        createResponse(response, STATUSES.NOT_FOUND, error.message);
        break;
      default:
        createResponse(response, STATUSES.INTERNAL_SERVER_ERROR, error.message);
        break;
    }
  }
});

server.listen(PORT as unknown as number, HOST, () => {
  process.stdout.write(`Server is running on http://${HOST}:${PORT}`);
});

export default server;
