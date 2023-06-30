import { IncomingMessage, ServerResponse } from 'http';
import * as url from 'url';

import { END_POINT, STATUSES } from '../../constants';
import getRequestBody from '../../utils/get-request-body';
import database from '../../db';
import createResponse from '../../utils/create-response';

const postRouter = async (request: IncomingMessage, response: ServerResponse) => {
  const { pathname } = url.parse(request.url as string, true);
  switch (true) {
    case (pathname === `/${END_POINT}`): {
      const body = await getRequestBody(request);
      const updatedUser = database.createUser(body);
      createResponse(response, STATUSES.CREATED, updatedUser);
      break;
    }
    default:
      response.statusCode = STATUSES.BAD_REQUEST;
      response.write(`Request is invalid: ${request.url}`);
      response.end();
  }
};

export default postRouter;
