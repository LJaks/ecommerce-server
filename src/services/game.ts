import Game, { GameDocument } from '../models/Game'

function createGame(game: GameDocument): Promise<GameDocument> {
  return game.save()
}

function findById(gameId: string): Promise<GameDocument> {
  return Game.findById(gameId)
    .exec()
    .then((game) => {
      if (!game) {
        throw new Error(`Game ${gameId} not found`)
      }
      return game
    })
}

type FindAllQuery = {
  name?: string | RegExp;
  categories?: string[];
}

function findAll(query?: FindAllQuery): Promise<GameDocument[]> {
  const preparedQuery: FindAllQuery = {}

  if (query) {
    if (query.name) {
      preparedQuery.name = new RegExp(query.name, 'i')
    }
    if (query.categories) {
      preparedQuery.categories = query.categories
    }
  }

  return Game.find(preparedQuery).sort({ name: 1 }).exec()
}

function updateGame(
  gameId: string,
  update: Partial<GameDocument>
): Promise<GameDocument> {
  return Game.findById(gameId)
    .exec()
    .then((game) => {
      if (!game) {
        throw new Error(`Game ${gameId} not found`)
      }

      if (update.name) {
        game.name = update.name
      }
      if (update.publishedYear) {
        game.publishedYear = update.publishedYear
      }
      if (update.price) {
        game.price = update.price
      }
      if (update.categories) {
        game.categories = update.categories
      }
      if (update.rating) {
        game.rating = update.rating
      }
      if (update.imgUrl) {
        game.imgUrl = update.imgUrl
      }
      return game.save()
    })
}

function deleteGame(gameId: string): Promise<GameDocument | null> {
  return Game.findByIdAndDelete(gameId).exec()
}

export default {
  createGame,
  findById,
  findAll,
  updateGame,
  deleteGame,
}
