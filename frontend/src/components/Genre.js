import React, { useState, useEffect } from "react"

const Genre = (props) => {
	const [genre, setGenre] = useState({})
	const [isLoaded, setIsLoaded] = useState(false)
	const [error, setError] = useState(null)

	useEffect(() => {
		async function fetchGenre() {
			const res = await fetch("http://localhost:8080/v1/genres/" + props.match.params.id)
			if (res.status !== 200) {
				const err = Error("Invalid response code: " + +res.status)
				setError(err)
				setIsLoaded(false)
			} else {
				const json = await res.json()
				setGenre(json.genre)
				setIsLoaded(true)
			}
		}
		fetchGenre()
	}, [])

	// if (genre.genres) {
	// 	genre.genres = Object.values(genre.genres)
	// } else {
	// 	genre.genres = []
	// }

	if (error) {
		return (
			<p>
				<strong>{error.message}</strong>
			</p>
		)
	} else if (isLoaded) {
		return (
			<>
				<h2>Genre: {genre.genre_name}</h2>

				{/* <div className="float-start">
					<small>rating: {movie.mpaa_rating}</small>
				</div>
				<div className="float-end">
					{movie.genres.map((movie, i) => (
						<span className="badge bg-secondary me-1" key={i}>
							{movie}
						</span>
					))}
				</div>
				<div className="clearfix"></div>
				<hr />

				<table className="table table-compact table-striped">
					<thead></thead>
					<tbody>
						<tr>
							<td>
								<strong>Title:</strong>
							</td>
							<td>{movie.title}</td>
						</tr>

						<tr>
							<td>
								<strong>Description:</strong>
							</td>
							<td>{movie.description}</td>
						</tr>

						<tr>
							<td>
								<strong>Runtime:</strong>
							</td>
							<td>{movie.runtime} minutes</td>
						</tr>
					</tbody>
				</table> */}
			</>
		)
	} else {
		return <p>Loading...</p>
	}
}

export default Genre
