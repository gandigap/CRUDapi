import { createServer, IncomingMessage, ServerResponse } from 'http';

const host = 'localhost';
const port = 4000;

const requestListener = (request: IncomingMessage, response: ServerResponse) => {
  console.log(request);
  response.writeHead(200);
  response.end('Start HTTP server');
};

const server = createServer(requestListener);

server.listen(port, host, ()=> {
  console.log(`Server is running on http://${host}:${port}`);
});

export default server;
