import http, { IncomingMessage, ServerResponse } from 'http';
import handleUsersRequest from './routes/router';
import { PORT } from './config';

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    res.setHeader('Content-Type', 'application/json');
    handleUsersRequest(req, res);
  },
);

const port = PORT || 4000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default server;
