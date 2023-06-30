import { IncomingMessage, ServerResponse } from 'http';
import * as url from 'url';

import { END_POINT, STATUSES } from '../../constants';
import database from '../../db';
import createResponse from '../../utils/create-response';
import getIdFromPath from '../../utils/get-id-from-path';

const getRouter = (request: IncomingMessage, response: ServerResponse) => {
  const { pathname } = url.parse(request.url as string, true);
  const id = getIdFromPath(pathname);

  switch (true) {
    case (pathname === `/${END_POINT}`): {
      const users = database.getAllUsers();
      createResponse(response, STATUSES.OK, users);
      break;
    }
    case (pathname?.startsWith(`/${END_POINT}/`) && !!id): {
      const user = database.getUserById(id as string);
      createResponse(response, STATUSES.OK, user);
      break;
    }
    default:
      createResponse(response, STATUSES.BAD_REQUEST, `Request is invalid: ${request.url}`);
      break;
  }
};

export default getRouter;
