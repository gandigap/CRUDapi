export enum DbOperations {
  FindUsers = 'FindUsers',
  FindOneUserById = 'FindOneUserById',
  CreateUser = 'CreateUser',
  UpdateUser = 'UpdateUser',
  RemoveUser = 'RemoveUser',
}

export interface DbRequest {
  operation: DbOperations;
  data?: User | string;
}

export interface DbResponse {
  ok: boolean;
  operation: DbOperations;
  data?: User | User[];
}

export interface User {
  username: string;
  id?: string;
  age: number;
  hobbies: string[];
}
