import React, { useState, useEffect } from "react"
import Input from "./form-components/Input"
import Textarea from "./form-components/Textarea"
import Select from "./form-components/Select"
import "./EditMovie.css"

export default function EditMovie(props) {
	const [movieID, setMovieID] = useState(0)
	const [movieTitle, setMovieTitle] = useState("")
	const [movieReleaseDate, setMovieReleaseDate] = useState("")
	const [movieRuntime, setMovieRuntime] = useState("")
	const [movieMpaaRating, setMovieMpaaRating] = useState("")
	const [movieRating, setMovieRating] = useState("")
	const [movieDescription, setMovieDescription] = useState("")
	const [movie, setMovie] = useState({
		id: movieID,
		title: movieTitle,
		release_date: movieReleaseDate,
		runtime: movieRuntime,
		mpaa_rating: movieMpaaRating,
		rating: movieRating,
		description: movieDescription,
	})
	const [error, setError] = useState(null)
	const [isLoaded, setIsLoaded] = useState(false)

	const ratings = [
		{
			value: "G",
			id: "G",
		},
		{
			value: "PG",
			id: "PG",
		},
		{
			value: "PG13",
			id: "PG13",
		},
		{
			value: "R",
			id: "R",
		},
		{
			value: "NC17",
			id: "NC17",
		},
	]

	async function handleSubmit(e) {
		e.preventDefault()
		// setMovie({
		// 	id: movieID,
		// 	title: movieTitle,
		// 	release_date: movieReleaseDate,
		// 	runtime: movieRuntime,
		// 	mpaa_rating: movieMpaaRating,
		// 	rating: movieRating,
		// 	description: movieDescription,
		// })

		const data = new FormData(e.target)
		const payload = Object.fromEntries(data.entries())

		const options = {
			method: "POST",
			body: JSON.stringify(payload),
		}

		const res = await fetch("http://localhost:8080/v1/admin/editmovie", options)
		const json = await res.json()
		console.log(json)
	}

	useEffect(() => {
		const id = props.match.params.id

		async function fetchMovie(id) {
			const res = await fetch("http://localhost:8080/v1/movies/" + id)
			if (res.status !== 200) {
				const err = Error
				err.message = "Invalid response code: " + res.status
				setError(err)
				setIsLoaded(true)
			} else {
				const json = await res.json()
				const releaseDate = new Date(json.movie.release_date)
				setMovieID(id)
				setMovieTitle(json.movie.title)
				setMovieReleaseDate(releaseDate.toISOString().split("T")[0])
				setMovieRuntime(json.movie.runtime)
				setMovieMpaaRating(json.movie.mpaa_rating)
				setMovieRating(json.movie.rating)
				setMovieDescription(json.movie.description)
				setIsLoaded(false)
			}
		}

		if (id > 0) fetchMovie(id)
	}, [])

	if (error) {
		return <p>Could not get movie</p>
	} else if (!isLoaded) {
		return (
			<>
				<h2>Add/Edit Movie</h2>

				<hr />

				<form method="post" onSubmit={handleSubmit}>
					<Input name="id" type="hidden" value={movieID} setValue={(e) => setMovieID(e.target.value)} />
					<Input name="title" title="Title" type="text" value={movieTitle} setValue={(e) => setMovieTitle(e.target.value)} />
					<Input name="release_date" title="Release Date" type="text" value={movieReleaseDate} setValue={(e) => setMovieReleaseDate(e.target.value)} />
					<Input name="runtime" title="Runtime" type="text" value={movieRuntime} setValue={(e) => setMovieRuntime(e.target.value)} />
					<Select name="mpaa_rating" title="MPAA Rating" value={movieMpaaRating} setValue={(e) => setMovieMpaaRating(e.target.value)} placeholder="Choose..." options={ratings} />
					<Input name="rating" title="Rating" type="text" value={movieRating} setValue={(e) => setMovieRating(e.target.value)} />
					<Textarea name="description" title="Description" rows="3" value={movieDescription} setValue={(e) => setMovieDescription(e.target.value)} />

					<hr />

					<button className="btn btn-primary">Save</button>
				</form>
			</>
		)
	} else {
		return <p>Loading...</p>
	}
}
