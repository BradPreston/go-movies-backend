import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const Movies = () => {
	const [movies, setMovies] = useState([])
	const [isLoaded, setIsLoaded] = useState(false)
	const [error, setError] = useState(null)

	useEffect(() => {
		async function fetchMovies() {
			const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/movies`)
			if (res.status !== 200) {
				const err = Error("Invalid response code: " + +res.status)
				setError(err)
				setIsLoaded(false)
			} else {
				const json = await res.json()
				setMovies(json.movies)
				setIsLoaded(true)
			}
		}
		fetchMovies()
	}, [])

	if (error) {
		return (
			<p>
				<strong>{error.message}</strong>
			</p>
		)
	} else if (isLoaded) {
		return (
			<>
				<h2>Choose a movie</h2>

				<div className="list-group">
					{movies &&
						movies.map((movie) => {
							return (
								<Link key={movie.id} to={`/movies/${movie.id}`} className="list-group-item list-group-item-action">
									{movie.title}
								</Link>
							)
						})}
				</div>
			</>
		)
	} else {
		return <p>Loading...</p>
	}
}

export default Movies
