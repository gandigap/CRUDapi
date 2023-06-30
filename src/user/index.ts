import { v4 as uuidv4 } from 'uuid';
import { UserData } from '../types';
import CustomError from '../custom-error/custom-error';
import messages from '../constants/messages';

class UserCreator {
  id: string;

  username: string;

  age: number;

  hobbies: string [];

  constructor({
    id = uuidv4(),
    username,
    age,
    hobbies,
  } : UserData) {
    if (!username || !age || !hobbies) {
      throw new CustomError(messages.bodyInvalid);
    }
    this.id = id;
    this.username = username;
    this.age = age;
    this.hobbies = hobbies;
  }
}

export default UserCreator;
