import React, { useState, useEffect } from "react"

const Movie = (props) => {
	const [movie, setMovie] = useState({})
	const [isLoaded, setIsLoaded] = useState(false)
	const [error, setError] = useState(null)

	useEffect(() => {
		async function fetchMovie() {
			const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/movies/` + props.match.params.id)
			if (res.status !== 200) {
				const err = Error("Invalid response code: " + +res.status)
				setError(err)
				setIsLoaded(false)
			} else {
				const json = await res.json()
				setMovie(json.movie)
				setIsLoaded(true)
			}
		}
		fetchMovie()
	}, [props.match.params.id])

	if (movie.genres) {
		movie.genres = Object.values(movie.genres)
	} else {
		movie.genres = []
	}

	if (error) {
		return (
			<p>
				<strong>{error.message}</strong>
			</p>
		)
	} else if (isLoaded) {
		return (
			<>
				<h2>
					Movie: {movie.title} ({movie.year})
				</h2>

				<div className="float-start">
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
				</table>
			</>
		)
	} else {
		return <p>Loading...</p>
	}
}

export default Movie
