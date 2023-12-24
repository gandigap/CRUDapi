import { User } from '../types/db-types';

const isUser = (arg: User): arg is User => (
  arg
    && !!arg.username
    && typeof arg.username === 'string'
    && arg.age !== undefined
    && typeof arg.age === 'number'
    && Array.isArray(arg.hobbies)
    && (!arg.hobbies.length || arg.hobbies.every((h) => typeof h === 'string'))
);

export default isUser;
