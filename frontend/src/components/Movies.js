import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const Movies = () => {
	const [movies, setMovies] = useState([])

	useEffect(() => {
		setMovies([
			{ id: 1, title: "Spiderman", runtime: 109 },
			{ id: 2, title: "Logan", runtime: 142 },
			{ id: 3, title: "The Princess Bride", runtime: 85 },
			{ id: 4, title: "Soul", runtime: 97 },
		])
	}, [])

	return (
		<>
			<h2>Choose a movie</h2>

			<ul>
				{movies &&
					movies.map((movie) => {
						return (
							<li key={movie.id}>
								<Link to={`/movies/${movie.id}`}>{movie.title}</Link>
							</li>
						)
					})}
			</ul>
		</>
	)
}

export default Movies
