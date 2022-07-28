import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import Home from "./components/Home"
import Admin from "./components/Admin"
import Movies from "./components/Movies"
import Genres from "./components/Genres"
import Genre from "./components/Genre"
import Movie from "./components/Movie"
import EditMovie from "./components/EditMovie"
import Login from "./components/Login"
import GraphQL from "./components/GraphQL"
import MovieGraphQL from "./components/MovieGraphQL"

export default function App() {
	const [jwt, setJwt] = useState("")

	let loginLink
	if (jwt === "") loginLink = <Link to="/login">Login</Link>
	else
		loginLink = (
			<Link
				to="/logout"
				onClick={() => {
					setJwt("")
					window.localStorage.removeItem("jwt")
				}}
			>
				Logout
			</Link>
		)

	useEffect(() => {
		const token = window.localStorage.getItem("jwt")
		if (token !== null) {
			if (jwt === "") {
				setJwt(JSON.parse(token))
			}
		}
	}, [setJwt, jwt])

	return (
		<Router>
			<div className="container">
				<div className="row">
					<div className="col mt-3">
						<h1 className="mt-3">Go Watch a Movie!</h1>
					</div>
					<div className="col mt-3 text-end">{loginLink}</div>
					<hr className="mb-3" />
				</div>

				<div className="row">
					<div className="col-md-2">
						<nav>
							<ul className="list-group">
								<li className="list-group-item">
									<Link to="/">Home</Link>
								</li>

								<li className="list-group-item">
									<Link to="/movies">Movies</Link>
								</li>

								<li className="list-group-item">
									<Link to="/genres">Genres</Link>
								</li>

								{jwt !== "" && (
									<>
										<li className="list-group-item">
											<Link to="/admin/movie/0">Add movie</Link>
										</li>

										<li className="list-group-item">
											<Link to="/admin">Manage Catalog</Link>
										</li>
									</>
								)}
								<li className="list-group-item">
									<Link to="/graphql">GraphQL</Link>
								</li>
							</ul>
						</nav>
					</div>

					<div className="col-md-10">
						<Switch>
							<Route path="/movies/:id" component={Movie} />
							<Route path="/moviesgraphql/:id" component={(props) => <MovieGraphQL {...props} />} />
							<Route path="/movies">
								<Movies />
							</Route>
							<Route path="/genres/:id" component={Genre} />
							<Route exact path="/genres">
								<Genres />
							</Route>

							<Route exact path="/login" component={(props) => <Login {...props} handleJwt={(props) => setJwt(props)} />} />

							<Route path="/admin/movie/:id" component={(props) => <EditMovie {...props} jwt={jwt} handleJwt={(props) => setJwt(props)} />} />

							<Route exact path="/graphql">
								<GraphQL />
							</Route>

							<Route exact path="/admin" component={(props) => <Admin {...props} jwt={jwt} />} />
							<Route path="/">
								<Home />
							</Route>
						</Switch>
					</div>
				</div>
			</div>
		</Router>
	)
}
