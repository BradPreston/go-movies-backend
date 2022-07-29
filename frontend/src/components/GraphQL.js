import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Input from "./form-components/Input"

export default function GraphQL(props) {
	const [movies, setMovies] = useState([])
	const [isLoaded, setIsLoaded] = useState(false)
	const [error, setError] = useState(null)
	// const [alert, setAlert] = useState({ type: "d-none", message: "" })
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
			const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/graphql`, options)
			const data = await res.json()
			const movieList = Object.values(data.data.list)
			setMovies(movieList)
			setIsLoaded(true)
		}

		fetchMovies()
	}, [])

	const handleSearch = (e) => {
		e.preventDefault()

		let term = ""
		if (searchTerm === "") {
			term = searchTerm
		} else if (searchTerm.split(" ")) {
			searchTerm.split(" ").forEach((word) => {
				term += word[0].toUpperCase() + word.substring(1) + " "
			})
		} else {
			term = searchTerm[0].toUpperCase() + searchTerm.substring(1)
		}

		const payload = `
	    {
	        search(titleContains: "${term}") {
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
			const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/graphql`, options)
			if (res.status !== 200) {
				const err = Error("Invalid response code: " + +res.status)
				setError(err)
				setIsLoaded(false)
			} else {
				const data = await res.json()
				const movieList = Object.values(data.data.search)
				setIsLoaded(true)
				if (movieList.length > 0) setMovies(movieList)
				else setMovies([])
			}
		}

		fetchMovies()
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
				<h2>GraphQL</h2>
				<hr />
				<form style={{ display: "flex", flexDirection: "row", alignContent: "center" }} onSubmit={handleSearch}>
					<Input title="search" type="text" name="search" value={searchTerm} setValue={(e) => setSearchTerm(e.target.value)} placeholder="Search by movie title" />
					{/* <div style={{ display: "flex", alignContent: "center" }}> */}
					<button className="btn btn-primary" style={{ height: "38px", marginTop: "31px", marginLeft: "10px" }}>
						Submit
					</button>
					{/* </div> */}
				</form>
				<div className="list-group">
					{movies.map((movie) => (
						<Link key={movie.id} className="list-group-item list-group-item-aciton" to={`/moviesgraphql/${movie.id}`}>
							<strong>{movie.title}</strong> <br />
							<small className="text-muted">
								({movie.year}) - {movie.runtime} minutes <br />
							</small>
							<br />
							{movie.description.slice(0, 100)}...
						</Link>
					))}
				</div>
			</>
		)
	} else {
		return <p>Loading...</p>
	}
}
