import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const Genre = (props) => {
	const [movies, setMovies] = useState({})
	const [isLoaded, setIsLoaded] = useState(false)
	const [error, setError] = useState(null)
	const [genreName, setGenreName] = useState(null)

	useEffect(() => {
		async function fetchGenre() {
			const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/genres/` + props.match.params.id)
			if (res.status !== 200) {
				const err = Error("Invalid response code: " + +res.status)
				setError(err)
				setIsLoaded(false)
			} else {
				const json = await res.json()
				setMovies(json.movies)
				setIsLoaded(true)
				setGenreName(props.location.genreName)
			}
		}
		fetchGenre()
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
				<h2>Genre: {genreName}</h2>

				{movies ? (
					<div className="list-group">
						{movies.map((movie) => (
							<Link key={movie.id} to={`/movies/${movie.id}`} className="list-group-item list-group-item-action">
								{movie.title}
							</Link>
						))}
					</div>
				) : (
					<p>No movies in this genre</p>
				)}
			</>
		)
	} else {
		return <p>Loading...</p>
	}
}

export default Genre
