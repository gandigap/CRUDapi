export interface User {
  id: string,
  username: string,
  age: number,
  hobbies: string[],
}

export type UserData = Partial<User>;

export interface Database {
  getAllUsers: () => User[];
  createUser (user: User): User;
  getUserById (id: string): User;
  updateUser (user: Partial<User>, id: string): User | undefined;
  removeUserById (id: string): void;
}
