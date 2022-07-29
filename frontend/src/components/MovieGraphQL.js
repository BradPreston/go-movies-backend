import React, { useState, useEffect } from "react"

const MovieGraphQL = (props) => {
	const [movie, setMovie] = useState({})
	const [isLoaded, setIsLoaded] = useState(false)
	const [error, setError] = useState(null)

	useEffect(() => {
		const payload = `
        {
            movie(id: ${props.match.params.id}) {
                id
                title
                runtime
                year
                description
                mpaa_rating
				poster
            }
        }
        `

		const headers = new Headers()
		headers.append("Content-Type", "application/json")

		const options = {
			method: "POST",
			body: payload,
			headers: headers,
		}

		async function fetchMovie() {
			const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/graphql`, options)
			if (res.status !== 200) {
				const err = Error("Invalid response code: " + +res.status)
				setError(err)
				setIsLoaded(false)
			} else {
				const data = await res.json()
				setMovie(data.data.movie)
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

				{movie.poster !== "" && (
					<div>
						<img src={`https://image.tmdb.org/t/p/w200${movie.poster}`} alt={`movie poster for ${movie.title}`} />
					</div>
				)}

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

export default MovieGraphQL
