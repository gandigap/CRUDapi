import { idRegEx } from '../constants';
import messages from '../constants/messages';
import CustomError from '../custom-error/custom-error';
import { User, UserData } from '../types';
import UserCreator from '../user';

class DataBase {
  users: User[];

  constructor() {
    this.users = [];
  }

  setAllUsers(users: User[]) {
    this.users = users;
  }

  getAllUsers() {
    return this.users;
  }

  getUserById(id: string) {
    const isValidId = id?.match(idRegEx)?.[0] && id.length === 36;
    if (!isValidId) {
      throw new CustomError(messages.idIsInvalid);
    }

    const requiredUser = this.users.find((user) => user.id === id);

    if (!requiredUser) {
      throw new CustomError(messages.userDoesNotExist);
    }

    return requiredUser;
  }

  createUser(userData: UserData) {
    const user = new UserCreator(userData);

    this.users.push(user);
    return this.getUserById(user.id);
  }

  updateUser(user: Partial<User>, id: string) {
    const requiredUser = this.users.find((itaratedUser) => itaratedUser.id === id);
    if (requiredUser) {
      this.users[this.users.indexOf(requiredUser)] = { ...requiredUser, ...user };
    }
    return this.getUserById(id);
  }

  removeUserById(id: string) {
    const isValidId = id?.match(idRegEx)?.[0] && id.length === 36;

    if (!isValidId) {
      throw new CustomError(messages.idIsInvalid);
    }

    const index = this.users.findIndex((user: User) => user.id === id);

    if (index === -1) {
      throw new CustomError(`User by id:${id} wasn\`t found`);
    }

    this.users.splice(index, 1);
  }
}

const database = new DataBase();

export default database;
