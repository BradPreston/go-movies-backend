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

	function handleSubmit(e) {
		e.preventDefault()
		setMovie({
			id: movieID,
			title: movieTitle,
			release_date: movieReleaseDate,
			runtime: movieRuntime,
			mpaa_rating: movieMpaaRating,
			rating: movieRating,
			description: movieDescription,
		})
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
				setMovie({
					id: id,
					title: json.movie.title,
					releaseDate: releaseDate.toISOString().split("T")[0],
					runtime: json.movie.runtime,
					mpaa_rating: json.movie.mpaa_rating,
					rating: json.movie.rating,
					description: json.movie.description,
				})
				setIsLoaded(false)
			}
		}

		if (id > 0) {
			fetchMovie(id)
		} else {
		}
	}, [])

	if (error) {
		return <p>Could not get movie</p>
	} else if (!isLoaded) {
		return (
			<>
				<h2>Add/Edit Movie</h2>

				<hr />

				<form method="post" onSubmit={handleSubmit}>
					<Input name="id" type="hidden" value={movie.id} setValue={(e) => setMovieID(e.target.value)} />
					<Input name="title" title="Title" type="text" value={movie.title} setValue={(e) => setMovieTitle(e.target.value)} />
					<Input name="release_date" title="Release Date" type="text" value={movie.releaseDate} setValue={(e) => setMovieReleaseDate(e.target.value)} />
					<Input name="runtime" title="Runtime" type="text" value={movie.runtime} setValue={(e) => setMovieRuntime(e.target.value)} />
					<Select name="mpaa_rating" title="MPAA Rating" value={movie.mpaa_rating} setValue={(e) => setMovieMpaaRating(e.target.value)} placeholder="Choose..." options={ratings} />
					<Input name="rating" title="Rating" type="text" value={movie.rating} setValue={(e) => setMovieRating(e.target.value)} />
					<Textarea name="description" title="Description" rows="3" value={movie.description} setValue={(e) => setMovieDescription(e.target.value)} />

					<hr />

					<button className="btn btn-primary">Save</button>
				</form>
			</>
		)
	} else {
		return <p>Loading...</p>
	}
}
