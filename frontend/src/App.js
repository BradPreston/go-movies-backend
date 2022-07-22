import React from "react"
import { BrowserRouter as Router, Switch, Route, Link, useParams, useRouteMatch } from "react-router-dom"
import Home from "./components/Home"
import Admin from "./components/Admin"
import Movies from "./components/Movies"
import Genres from "./components/Genres"
import Movie from "./components/Movie"

export default function App() {
	return (
		<Router>
			<div className="container">
				<div className="row">
					<h1 className="mt-3">Go Watch a Movie!</h1>
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

								<li className="list-group-item">
									<Link to="/admin">Manage Catalog</Link>
								</li>
							</ul>
						</nav>
					</div>

					<div className="col-md-10">
						<Switch>
							<Route path="/movies/:id" component={Movie} />
							<Route path="/movies">
								<Movies />
							</Route>
							<Route exact path="/genres">
								<Genres />
							</Route>

							<Route exact path="/genres/drama/" render={(props) => <Genres {...props} title={`Drama`} />} />
							<Route exact path="/genres/comedy/" render={(props) => <Genres {...props} title={`Comedy`} />} />
							<Route exact path="/genres/action/" render={(props) => <Genres {...props} title={`Action`} />} />

							<Route path="/admin">
								<Admin />
							</Route>
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

// function genres() {
// 	const { path, url } = useRouteMatch()

// 	return (
// 		<div>
// 			<h2>Genres</h2>

// 			<ul>
// 				<li>
// 					<Link to={`${path}/drama`}>Drama</Link>
// 				</li>
// 				<li>
// 					<Link to={`${path}/comedy`}>Comedy</Link>
// 				</li>
// 				<li>
// 					<Link to={`${path}/action`}>Action</Link>
// 				</li>
// 			</ul>
// 		</div>
// 	)
// }
