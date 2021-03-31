// const add = async (req: any, res: any) => {
//   const result = await axios.get(url)
//   const data = result.data.results

//   data.forEach(async (movie: any) => {
//     const newMovie = new Movie({
//       name: movie.title,
//       description: movie.overview,
//       publishedYear: extractYear(movie.release_date),
//       genres: findGenres(movie.genre_ids),
//       duration: await getDuration(movie.id),
//       rating: movie.vote_average,
//       cast: await getCast(movie.id),
//       poster: `${imgSrc}${movie.poster_path}`,
//       background: `${bgSrc}${movie.backdrop_path}`,
//     })
//     await newMovie.save()
//   })
//   res.send('ok')
// }
