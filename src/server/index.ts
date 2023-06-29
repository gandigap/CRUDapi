import { createServer } from 'http';
import { METHODS, STATUSES } from '../constants';
import getController from './controllers/get-controller';
import postController from './controllers/post-controller';
import deleteController from './controllers/delete-controller';
import putController from './controllers/put-controller';

const HOST = 'localhost';
const PORT = 4000;

const server = createServer();

server.on('request', (request, response) => {
  const {
    GET, POST, PUT, DELETE,
  } = METHODS;

  switch (request.method) {
    case GET:
      getController(request, response);
      break;
    case POST:
      postController(request, response);
      break;
    case PUT:
      putController(request, response);
      break;
    case DELETE:
      deleteController(request, response);
      break;
    default:
      // Send response for requests with no other response
      response.statusCode = STATUSES.BAD_REQUEST;
      response.write('No Response');
      response.end('Start HTTP server');
  }
});

server.listen(PORT, HOST, () => {
  process.stdout.write(`Server is running on http://${HOST}:${PORT}`);
});

export default server;
