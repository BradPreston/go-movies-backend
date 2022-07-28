import React from "react"
import Tickets from "./../images/movie_tickets.jpg"

const Home = () => {
	return (
		<div className="text-center">
			<h2>Home</h2>
			<hr />
			<img src={Tickets} alt="movie tickets" />
		</div>
	)
}

export default Home
