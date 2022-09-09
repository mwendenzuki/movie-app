import React, {useState, useEffect} from 'react'
import Layout from '../components/Layout'
import { supabase } from '../supabase'
import { useAuth } from '../auth'
import axios from 'axios'
import MovieCard from '../components/MovieCard'

export default function Watchlist() {
  const auth = useAuth()
  const [movies, setMovies] = useState([])

const getWatchlist = async () => {
  let movies = []

  const {data, error} = await supabase
    .from("watchlist")
    .select("movie_id")
    .match({user_id: auth.user.id})

    if(error) {
      console.log(error)
    }

    if(data) {
      for( const movie of data ) {
        const {data} = await axios.get(`https://api.themoviedb.org/3/movie/${movie.movie_id}`, {
          params: {
            api_key: "229cde121cf4399f65c4840ed9561364"
        }
      })
      movies.push(data)

      }
      setMovies(movies)

    }
} 

useEffect( () => {
  getWatchlist()
})

const removeFromWatchlist = async (id) => {
  const {data, error} = await supabase
    .from ("watchlist")
    .delete()
    .match({user_id: auth.user.id, movie_id: id})

    if(error) {
      console.log(error)
    }

    if(data) {
      getWatchlist()
    }
}

const renderWatchlist = () => {
  return movies.map(movie => (
    <div>

      <MovieCard movie={movie}/>
      <button className={"button"} onClick={() => removeFromWatchlist(movie.id)}>Remove from watchlist</button>

    </div>
    

  ))
};

  return (
    <div>
      <Layout>

      <h1>Watchlist</h1>

      <div className="grid">
      {renderWatchlist()}
      </div>
     
      </Layout>
    </div>
  )
}
