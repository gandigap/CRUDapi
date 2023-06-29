import { IncomingMessage, ServerResponse } from 'http';
import { STATUSES } from '../../constants';

const getController = (request: IncomingMessage, response: ServerResponse) => {
  switch (request.url) {
    // response for unexpected get requests
    default:
      response.statusCode = STATUSES.BAD_REQUEST;
      response.write(`CANNOT GET ${request.url}`);
      response.end();
  }
};

export default getController;
