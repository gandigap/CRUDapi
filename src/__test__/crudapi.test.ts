import supertest from 'supertest';
import { validate as uuidValidate } from 'uuid';

import { DEFAULT_END_POINT, END_POINT, STATUSES } from '../constants';
import { UserData } from '../types';
import server from '..';

const testUser :UserData = {
  username: 'John Doe',
  age: 22,
  hobbies: ['swimming', 'football'],
};

afterEach(async () => server.close());

describe('Get all users with status 200 (OK)', () => {
  it('should return empty array', async () => {
    const res = await supertest(server).get(DEFAULT_END_POINT).send();

    expect(res.statusCode).toBe(STATUSES.OK);
    expect(res.body).toEqual([]);
  });
});

describe('Create a new user', () => {
  it('should create a new user with status 201 (CREATED) and correct id in response ', async () => {
    const res = await supertest(server).post(DEFAULT_END_POINT).send(testUser);
    const { id } = res.body;
    testUser.id = id;

    expect(res.statusCode).toBe(STATUSES.CREATED);
    expect(uuidValidate(res.body.id)).toBeTruthy();
  });
});

describe('Get user by id', () => {
  it('should get user with correct response and status OK', async () => {
    const res = await supertest(server).get(`/${END_POINT}/${testUser.id}`).send();

    expect(res.statusCode).toEqual(STATUSES.OK);
    expect(res.body).toStrictEqual({ ...testUser });
  });
});

describe('Remove user', () => {
  it('should delete user with status NO CONTENT', async () => {
    const createRes = await supertest(server).post(DEFAULT_END_POINT).send(testUser);
    const { id } = createRes.body;

    const deleteRes = await supertest(server).delete(`/${END_POINT}/${id}`).send();

    expect(deleteRes.statusCode).toEqual(STATUSES.NO_CONTENT);
  });
});
