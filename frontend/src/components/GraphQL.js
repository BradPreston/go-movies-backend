import React, { useState, useEffect } from "react"
import Input from "./form-components/Input"

export default function GraphQL(props) {
	const [movies, setMovies] = useState([])
	const [isLoaded, setIsLoaded] = useState(false)
	const [error, setError] = useState(null)
	const [alert, setAlert] = useState({ type: "d-none", message: "" })
	const [searchTerm, setSearchTerm] = useState("")

	useEffect(() => {
		const payload = `
        {
            list {
                id
                title
                runtime
                year
                description
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

		async function fetchMovies() {
			const res = await fetch("http://localhost:8080/v1/graphql", options)
			const data = await res.json()
			const movieList = Object.values(data.data.list)
			setMovies(movieList)
		}

		fetchMovies()

		handleSearch(searchTerm)
	}, [searchTerm])

	function handleSearch(searchTerm) {
		const payload = `
        {
            search(titleContains: "${searchTerm}") {
                id
                title
                runtime
                year
                description
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

		async function fetchMovies() {
			const res = await fetch("http://localhost:8080/v1/graphql", options)
			const data = await res.json()
			const movieList = Object.values(data.data.search)
			if (movieList.length > 0) setMovies(movieList)
			else setMovies([])
		}

		fetchMovies()
	}

	return (
		<>
			<h2>GraphQL</h2>
			<hr />
			<Input title="search" type="text" name="search" value={searchTerm} setValue={(e) => setSearchTerm(e.target.value)} placeholder="Search by movie title" />
			<div className="list-group">
				{movies.map((movie) => (
					<a key={movie.id} className="list-group-item list-group-item-aciton" href="#!">
						<strong>{movie.title}</strong> <br />
						<small className="text-muted">
							({movie.year}) - {movie.runtime} minutes <br />
						</small>
						<br />
						{movie.description.slice(0, 100)}...
					</a>
				))}
			</div>
		</>
	)
}
