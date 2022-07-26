import React, { useState, useEffect } from "react"
import Input from "./form-components/Input"
import Textarea from "./form-components/Textarea"
import Select from "./form-components/Select"
import Alert from "./ui/Alert"
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
	const [errors, setErrors] = useState([])
	const [alert, setAlert] = useState({
		type: "d-none",
		message: ""
	})

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

		// client side validation
		const validationErrors = []
		if (movieTitle === "") validationErrors.push("title")
		if (movieReleaseDate === "") validationErrors.push("release_date")
		if (movieRuntime === "") validationErrors.push("runtime")
		if (movieMpaaRating === "") validationErrors.push("mpaa_rating")
		if (movieRating === "") validationErrors.push("rating")
		if (movieDescription === "") validationErrors.push("description")

		setErrors(validationErrors)

		if (errors.length > 0) return false

		const data = new FormData(e.target)
		const payload = Object.fromEntries(data.entries())

		const options = {
			method: "POST",
			body: JSON.stringify(payload),
		}

		const res = await fetch("http://localhost:8080/v1/admin/editmovie", options)
		const json = await res.json()
		console.log(json)
		if (json.error) {
			setAlert({
				type: "alert-danger",
				message: json.error.message,
			})
		} else {
			setAlert({
				type: "alert-success",
				message: "Changes saved",
			})
		}
	}

	function hasError(key) {
		return errors.indexOf(key) !== -1
	}

	useEffect(() => {
		const id = props.match.params.id

		async function fetchMovie(id) {
			const res = await fetch("http://localhost:8080/v1/movies/" + id)
			if (res.status !== 200) {
				const err = Error
				err.message = "Invalid response code: " + res.status
				setError(err)
				setIsLoaded(true);
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
				<Alert type={alert.type} message={alert.message} />
				<hr />

				<form method="post" onSubmit={handleSubmit}>
					<Input name="id" type="hidden" value={movieID} setValue={(e) => setMovieID(e.target.value)} />
					<Input
						name="title"
						title="Title"
						type="text"
						value={movieTitle}
						setValue={(e) => setMovieTitle(e.target.value)}
						className={hasError("title") ? "is-invalid" : ""}
						errorDiv={hasError("title") ? "text-danger" : "d-none"}
						errorMsg={"Please enter a title"}
					/>
					<Input
						name="release_date"
						title="Release Date"
						type="text"
						value={movieReleaseDate}
						setValue={(e) => setMovieReleaseDate(e.target.value)}
						className={hasError("release_date") ? "is-invalid" : ""}
						errorDiv={hasError("release_date") ? "text-danger" : "d-none"}
						errorMsg={"Please enter a release date"}
					/>
					<Input
						name="runtime"
						title="Runtime"
						type="text"
						value={movieRuntime}
						setValue={(e) => setMovieRuntime(e.target.value)}
						className={hasError("runtime") ? "is-invalid" : ""}
						errorDiv={hasError("runtime") ? "text-danger" : "d-none"}
						errorMsg={"Please enter a runtime"}
					/>
					<Select
						name="mpaa_rating"
						title="MPAA Rating"
						value={movieMpaaRating}
						setValue={(e) => setMovieMpaaRating(e.target.value)}
						placeholder="Choose..."
						options={ratings}
						className={hasError("mpaa_rating") ? "is-invalid" : ""}
						errorDiv={hasError("mpaa_rating") ? "text-danger" : "d-none"}
						errorMsg={"Please choose an MPAA rating"}
					/>
					<Input
						name="rating"
						title="Rating"
						type="text"
						value={movieRating}
						setValue={(e) => setMovieRating(e.target.value)}
						className={hasError("rating") ? "is-invalid" : ""}
						errorDiv={hasError("rating") ? "text-danger" : "d-none"}
						errorMsg={"Please enter a rating"}
					/>
					<Textarea
						name="description"
						title="Description"
						rows="3"
						value={movieDescription}
						setValue={(e) => setMovieDescription(e.target.value)}
						className={hasError("description") ? "is-invalid" : ""}
						errorDiv={hasError("description") ? "text-danger" : "d-none"}
						errorMsg={"Please enter a description"}
					/>

					<hr />

					<button className="btn btn-primary">Save</button>
				</form>
			</>
		)
	} else {
		return <p>Loading...</p>
	}
}
