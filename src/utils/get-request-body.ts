import { IncomingMessage } from 'http';
import { User } from '../types';

const getRequestBody = (request: IncomingMessage): Promise<User> => (
  new Promise((resolve, reject) => {
    try {
      let body = '';

      request.on('data', (chunk: string) => {
        body += chunk.toString();
      });

      request.on('end', () => {
        resolve(body ? JSON.parse(body) : {});
      });
    } catch (error) {
      reject(error);
    }
  })
);

export default getRequestBody;
