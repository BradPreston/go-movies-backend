import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const Genres = () => {
	const [genres, setGenres] = useState([])
	const [isLoaded, setIsLoaded] = useState(false)
	const [error, setError] = useState(null)

	useEffect(() => {
		async function fetchGenres() {
			const res = await fetch("http://localhost:8080/v1/genres")
			if (res.status !== 200) {
				const err = Error("Invalid response code: " + +res.status)
				setError(err)
				setIsLoaded(false)
			} else {
				const json = await res.json()
				setGenres(json.genres)
				setIsLoaded(true)
			}
		}
		fetchGenres()
	})

	return (
		<>
			<h2>Genres</h2>

			<ul>
				{genres.map((genre) => (
					<li key={genre.id}>{<Link to={`/genre/${genre.id}`}>{genre.genre_name}</Link>}</li>
				))}
			</ul>
		</>
	)
}

export default Genres
