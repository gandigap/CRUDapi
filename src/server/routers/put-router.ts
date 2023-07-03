import { IncomingMessage, ServerResponse } from 'http';
import * as url from 'url';

import { END_POINT, STATUSES } from '../../constants';
import createResponse from '../../utils/create-response';
import getRequestBody from '../../utils/get-request-body';
import database from '../../db';
import getIdFromPath from '../../utils/get-id-from-path';

const putRouter = async (request: IncomingMessage, response: ServerResponse) => {
  const { pathname } = url.parse(request.url as string, true);
  const id = getIdFromPath(pathname);
  switch (true) {
    case (pathname?.startsWith(`/${END_POINT}/`) && !!id): {
      const body = await getRequestBody(request);
      const updatedUser = database.updateUser(body, id as string);
      createResponse(response, STATUSES.OK, updatedUser);
      break;
    }
    default:
      createResponse(response, STATUSES.NOT_FOUND, `Non-existing endpoint: ${request.url}`);
  }
};

export default putRouter;
