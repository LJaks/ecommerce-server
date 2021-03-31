import request from 'supertest'

import { UserDocument } from '../../src/models/User'
import app from '../../src/app'
import * as dbHelper from '../db-helper'

const nonExistingUserId = '5e57b77b5744fa0b461c7906'

async function createUser(override?: Partial<UserDocument>) {
  let user = {
    firstName: 'Alex',
    lastName: 'Al',
    username: 'alexal',
    email: 'alex@al.com',
    password: 'alex',
    isAdmin: true,
  }

  if (override) {
    user = { ...user, ...override }
  }
  return await request(app).post('/api/v1/users').send(user)
}

describe('user controller', () => {
  beforeEach(async () => {
    await dbHelper.connect()
  })
  afterEach(async () => {
    await dbHelper.clearDatabase()
  })
  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should create a user', async () => {
    const res = await createUser()
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('_id')
    expect(res.body.username).toBe('alexal')
  })

  it('should not create a user with wrong data', async () => {
    const res = await request(app).post('/api/v1/users').send({
      firstName: 'Alex',
      lastName: 'Al',
      // These fields should be included
      // username: 'alexal',
      email: 'alex@al.com',
      password: '123',
    })
    expect(res.status).toBe(400)
  })

  it('should return an existing user', async () => {
    let res = await createUser()
    expect(res.status).toBe(200)

    const userId = res.body._id
    res = await request(app).get(`/api/v1/users/${userId}`)

    expect(res.body._id).toEqual(userId)
  })

  it('should not return a non-existing user', async () => {
    const res = await request(app).get(`/api/v1/users/${nonExistingUserId}`)
    expect(res.status).toBe(404)
  })

  it('should return all users', async () => {
    const res1 = await createUser({
      username: 'alexal',
      email: 'alex@al.com',
      password: 'alex',
      isAdmin: true,
    })

    const res2 = await createUser({
      username: 'carlal',
      email: 'carl@al.com',
      password: 'carl',
      isAdmin: false,
    })

    const res3 = await request(app).get('/api/v1/users')

    expect(res3.body.length).toEqual(2)
    expect(res3.body[0]._id).toEqual(res1.body._id)
    expect(res3.body[1]._id).toEqual(res2.body._id)
  })

  it('should update an existing user', async () => {
    let res = await createUser()
    expect(res.status).toBe(200)

    const userId = res.body._id
    const update = {
      firstName: 'Carl',
      lastName: 'Al',
      email: 'carl@al.com',
      password: 'carl',
    }

    res = await request(app).put(`/api/v1/users/${userId}`).send(update)

    expect(res.status).toEqual(200)
    expect(res.body.firstName).toEqual('Carl')
    expect(res.body.lastName).toEqual('Al')
    expect(res.body.email).toEqual('carl@al.com')
    expect(res.body.password).toEqual('carl')
  })

  it('should delete an existing user', async () => {
    let res = await createUser()
    expect(res.status).toBe(200)
    const userId = res.body._id

    res = await request(app).delete(`/api/v1/users/${userId}`)
    expect(res.status).toEqual(204)

    res = await request(app).get(`/api/v1/users/${userId}`)
    expect(res.status).toBe(404)
  })
})
