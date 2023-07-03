import { IncomingMessage, ServerResponse } from 'http';
import * as url from 'url';

import { END_POINT, STATUSES, idRegEx } from '../../constants';
import database from '../../db';
import createResponse from '../../utils/create-response';
import getIdFromPath from '../../utils/get-id-from-path';

const deleteRouter = async (request: IncomingMessage, response: ServerResponse) => {
  const { pathname } = url.parse(request.url as string, true);
  const id = getIdFromPath(pathname);
  switch (true) {
    case (pathname?.startsWith(`/${END_POINT}/`) && !!id): {
      await database.removeUserById(id as string);
      createResponse(response, STATUSES.NO_CONTENT);
      break;
    }
    default:
      createResponse(response, STATUSES.NOT_FOUND, `Non-existing endpoint: ${request.url}`);
  }
};

export default deleteRouter;
