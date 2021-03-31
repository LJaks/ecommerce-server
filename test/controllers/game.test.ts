import request from 'supertest'

import { GameDocument } from '../../src/models/Game'
import app from '../../src/app'
import * as dbHelper from '../db-helper'

const nonExistingGameId = '5e57b77b5744fa0b461c7906'

async function createGame(override?: Partial<GameDocument>) {
  let game = {
    name: 'GTA',
    publishedYear: 2001,
    categories: ['action', 'race'],
    price: 20,
    rating: 3.5,
  }

  if (override) {
    game = { ...game, ...override }
  }
  return await request(app).post('/api/v1/games').send(game)
}

describe('game controller', () => {
  beforeEach(async () => {
    await dbHelper.connect()
  })
  afterEach(async () => {
    await dbHelper.clearDatabase()
  })
  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should create a game', async () => {
    const res = await createGame()
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('_id')
    expect(res.body.name).toBe('GTA')
  })

  it('should not create a game with wrong data', async () => {
    const res = await request(app)
      .post('/api/v1/games')
      .send({
        // These fields should be included
        name: 'GTA',
        // publishedYear: 2001,
        // price: 20,
        categories: ['action', 'race'],
        rating: 3.5,
      })
    expect(res.status).toBe(400)
  })

  it('should return an existing game', async () => {
    let res = await createGame()
    expect(res.status).toBe(200)

    const gameId = res.body._id
    res = await request(app).get(`/api/v1/games/${gameId}`)

    expect(res.body._id).toEqual(gameId)
  })

  it('should not return a non-existing game', async () => {
    const res = await request(app).get(`/api/v1/games/${nonExistingGameId}`)
    expect(res.status).toBe(404)
  })

  it('should return all games', async () => {
    const res1 = await createGame({
      name: 'GTA',
      publishedYear: 2000,
      price: 20,
    })

    const res2 = await createGame({
      name: 'GTA II',
      publishedYear: 2002,
      price: 22,
    })

    const res3 = await request(app).get('/api/v1/games')

    expect(res3.body.length).toEqual(2)
    expect(res3.body[0]._id).toEqual(res1.body._id)
    expect(res3.body[1]._id).toEqual(res2.body._id)
  })

  it('should update an existing game', async () => {
    let res = await createGame()
    expect(res.status).toBe(200)

    const gameId = res.body._id
    const update = {
      name: 'GTA II',
      publishedYear: 2002,
      price: 22,
    }

    res = await request(app).put(`/api/v1/games/${gameId}`).send(update)

    expect(res.status).toEqual(200)
    expect(res.body.name).toEqual('GTA II')
    expect(res.body.publishedYear).toEqual(2002)
    expect(res.body.price).toEqual(22)
  })

  it('should delete an existing game', async () => {
    let res = await createGame()
    expect(res.status).toBe(200)
    const gameId = res.body._id

    res = await request(app).delete(`/api/v1/games/${gameId}`)
    expect(res.status).toEqual(204)

    res = await request(app).get(`/api/v1/games/${gameId}`)
    expect(res.status).toBe(404)
  })
})
