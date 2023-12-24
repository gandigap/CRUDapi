import cluster from 'cluster';
import { version as uuidVersion, validate as uuidValidate, v4 } from 'uuid';
import {
  DbRequest, DbResponse, User, DbOperations,
} from '../types/db-types';
import isUser from '../utils/userUtils';

let users: User[] = [];
const multi = JSON.parse(process.env.MULTI || 'false');

const isDbRequest = (message: DbRequest): message is DbRequest => (
  !!message
    && !!message.operation
    && typeof message.operation === 'string'
    && (message.data === undefined
      || typeof message.data === 'string'
      || isUser(message.data))
);

const isDbResponse = (message: DbResponse): message is DbResponse => (
  message
    && !!message.operation
    && typeof message.operation === 'string'
    && (message.data === undefined
      || message.data instanceof Object
      || typeof message.data === 'string')
);

if (multi && cluster.isPrimary) {
  cluster.on('message', (worker, message: DbRequest) => {
    if (!isDbRequest(message)) {
      return;
    }

    const { operation, data } = message;
    switch (operation) {
      case DbOperations.FindUsers:
        worker.send({ ok: true, operation, data: users });
        break;
      case DbOperations.FindOneUserById:
        if (
          typeof data === 'string'
          && uuidValidate(data)
          && uuidVersion(data) === 4
        ) {
          worker.send({
            ok: true,
            operation,
            data: users.find((u) => u.id === data),
          });
        } else {
          worker.send({ ok: false, operation });
        }
        break;
      case DbOperations.CreateUser:
        if (data === undefined || typeof data === 'string' || !isUser(data)) {
          worker.send({ ok: false, operation });
          return;
        }
        // eslint-disable-next-line no-case-declarations
        const user = { id: v4(), ...data };
        users = [...users, user];
        worker.send({ ok: true, operation, data: user });
        break;
      case DbOperations.UpdateUser:
        if (data === undefined || typeof data === 'string' || !isUser(data)) {
          worker.send({ ok: false, operation });
          return;
        }
        if (!users.find((value) => value.id === data.id)) {
          worker.send({ ok: false, operation });
          return;
        }
        users = [...users.filter((value) => value.id !== data.id), data];
        worker.send({ ok: true, operation, data });
        break;
      case DbOperations.RemoveUser:
        users = users.filter((value) => value.id !== data);
        worker.send({ ok: true, operation });
        break;

      default:
        worker.send({ ok: false, operation });
        break;
    }
  });
}
const performDbOperation = <User>(
  operation: DbOperations,
  data?: User | string,
): Promise<unknown> => {
  if (cluster.isPrimary) {
    throw new Error(
      'DB operations should be called only from Workers, not from Primary thread',
    );
  }
  return new Promise((resolve, _reject) => {
    const listener = (message: any) => {
      if (!isDbResponse(message)) {
        return;
      }
      resolve(message.data);
      process.removeListener('message', listener);
    };
    process.addListener('message', listener);
    process.send?.({ operation, data });
  });
};

class DataBase {
  users: User[];

  constructor() {
    this.users = [];
  }

  findUsers = async () => {
    if (multi) {
      return performDbOperation<User[]>(DbOperations.FindUsers);
    }
    return this.users;
  };

  findOneUserById = async (id: string) => {
    if (multi) {
      return performDbOperation<User>(DbOperations.FindOneUserById, id);
    }
    return this.users.find((user) => user.id === id);
  };

  createUser = async (user: User) => {
    if (multi) {
      return performDbOperation<User>(DbOperations.CreateUser, user);
    }
    const newUser = {
      id: v4(),
      ...user,
    };
    this.users = [...this.users, newUser];
    return newUser;
  };

  updateUser = async (user: User) => {
    if (multi) {
      return performDbOperation<User>(DbOperations.UpdateUser, user);
    }
    if (this.users.find((value) => value.id === user.id)) {
      this.users = [...this.users.filter((filteredUser) => filteredUser.id !== user.id), user];
      return user;
    }
    return false;
  };

  removeUser = async (id: string) => {
    if (multi) {
      return performDbOperation(DbOperations.RemoveUser, id);
    }
    if (this.users.find((user) => user.id === id)) {
      this.users = this.users.filter((value) => value.id !== id);
    } else {
      return false;
    }
    return true;
  };
}

const database = new DataBase();

export default database;
