import Game from '../../src/models/Game'
import GameService from '../../src/services/game'
import * as dbHelper from '../db-helper'

const nonExistingGameId = '5e57b77b5744fa0b461c7906'

async function createGame() {
  const game = new Game({
    name: 'GTA',
    publishedYear: 2001,
    categories: ['action', 'race'],
    price: 20,
    rating: 3.5,
  })
  return await GameService.createGame(game)
}

describe('game service', () => {
  beforeEach(async () => {
    await dbHelper.connect()
  })
  afterEach(async () => {
    await dbHelper.clearDatabase()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('shoud create a game', async () => {
    const game = await createGame()
    expect(game).toHaveProperty('_id')
    expect(game).toHaveProperty('name', 'GTA')
    expect(game).toHaveProperty('price', 20)
  })
  it('should get a game with id', async () => {
    const game = await createGame()
    const found = await GameService.findById(game._id)
    expect(found.name).toEqual(game.name)
    expect(found._id).toEqual(game._id)
  })

  // Check https://jestjs.io/docs/en/asynchronous for more info about
  // how to test async code, especially with error
  it('should not get a non-existing game', async () => {
    expect.assertions(1)
    return GameService.findById(nonExistingGameId).catch((e) => {
      expect(e.message).toMatch(`Game ${nonExistingGameId} not found`)
    })
  })

  it('should update an existing game', async () => {
    const game = await createGame()
    const update = {
      name: 'GTA II',
      publishedYear: 2002,
      price: 22,
    }
    const updated = await GameService.updateGame(game._id, update)
    expect(updated).toHaveProperty('_id', game._id)
    expect(updated).toHaveProperty('name', 'GTA II')
    expect(updated).toHaveProperty('publishedYear', 2002)
    expect(updated).toHaveProperty('price', 22)
  })

  it('should not update a non-existing game', async () => {
    expect.assertions(1)
    const update = {
      name: 'GTA II',
      publishedYear: 2002,
      price: 22,
    }
    return GameService.updateGame(nonExistingGameId, update).catch((e) => {
      expect(e.message).toMatch(`Game ${nonExistingGameId} not found`)
    })
  })

  it('should delete an existing game', async () => {
    expect.assertions(1)
    const game = await createGame()
    await GameService.deleteGame(game._id)
    return GameService.findById(game._id).catch((e) => {
      expect(e.message).toBe(`Game ${game._id} not found`)
    })
  })
})
