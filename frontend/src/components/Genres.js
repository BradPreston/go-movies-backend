import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const Genres = () => {
	const [genres, setGenres] = useState([])
	const [isLoaded, setIsLoaded] = useState(false)
	const [error, setError] = useState(null)

	useEffect(() => {
		async function fetchGenres() {
			const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/genres`)
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

	if (error) {
		return (
			<p>
				<strong>Error: {error.message}</strong>
			</p>
		)
	} else if (isLoaded) {
		return (
			<>
				<h2>Genres</h2>

				<div className="list-group">
					{genres.map((genre) => (
						<Link
							key={genre.id}
							to={{
								pathname: `/genres/${genre.id}`,
								genreName: genre.genre_name,
							}}
							className="list-group-item list-group-item-action"
						>
							{genre.genre_name}
						</Link>
					))}
				</div>
			</>
		)
	} else {
		return <p>Loading...</p>
	}
}

export default Genres
