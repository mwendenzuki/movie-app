import React, {useEffect, useState} from 'react'
import Layout from '../components/Layout'
import axios from 'axios'
import TinderCard from 'react-tinder-card'
import MovieCard from '../components/MovieCard'
import {supabase} from '../supabase'
import {useAuth} from '../auth'

export default function Home() {
  const auth = useAuth()
  const [movies, setMovies] = useState([])
  const [message, setMessage] = useState("")

const fetchMovies = async () => {
  const {data} = await axios.get("https://api.themoviedb.org/3/discover/movie", {
    params: {
      page: Math.random() *501,
      api_key: "229cde121cf4399f65c4840ed9561364"
    }
  })

  setMovies(data.results)

}
const addToWatchlist = async (movie) => {
  const {data, error} = await supabase.from("watchlist")
                                      .insert({movie_id: movie.id, user_id: auth.user.id})
    if (error) {
      console.log(error)
    }

    if (data) {
      setMessage("Movie has been added to your watchlist!")
    }

}

useEffect( () => {
  if(auth.user) {
    fetchMovies()
  }
 
},[auth])  

const renderMovies = () => {
  return movies.map(movie => (

    <TinderCard 
    key={movie.id}
    onSwipe={direction => direction === "right" ? addToWatchlist(movie): null}
    >

      <MovieCard movie={movie} swipe={true}/>

    </TinderCard>
  ))
}

  return (
    <Layout>

      <h1 >Welcome! Choose a movie:</h1>
      <br></br>
      <h3>(Swipe left to skip and right to add it to your watchlist!)</h3>
      <br></br>
      {message && message}

    <div className='movie-wrapper'>

    {!auth.user && <h2>Please sign in!</h2>}
    {renderMovies()}
    
    </div>
      
    </Layout>
    
)}
