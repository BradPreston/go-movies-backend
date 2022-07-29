import React, { useState } from "react"
import Input from "./form-components/Input"
import Alert from "./ui/Alert"

export default function Login(props) {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	// const [error, setError] = useState(null)
	const [errors, setErrors] = useState([])
	const [alert, setAlert] = useState({ type: "d-none", message: "" })

	async function handleSubmit(e) {
		e.preventDefault()
		const errors = []
		if (email === "") errors.push("email")
		if (password === "") errors.push("password")
		if (errors.length > 0) {
			setErrors(errors)
			return false
		}

		const data = new FormData(e.target)
		const payload = Object.fromEntries(data.entries())

		const options = {
			method: "POST",
			body: JSON.stringify(payload),
		}

		const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/login`, options)
		const json = await res.json()
		if (json.error) setAlert({ type: "alert-danger", message: json.error.message })
		else {
			props.handleJwt(json.response)
			window.localStorage.setItem("jwt", JSON.stringify(Object.values(json)[0]))
			props.history.push({ pathname: "/admin" })
		}
	}

	function hasError(key) {
		return errors.indexOf(key) !== -1
	}

	return (
		<>
			<h2>Login</h2>
			<hr />
			<Alert type={alert.type} message={alert.message} />

			<form className="pt-3" onSubmit={handleSubmit}>
				<Input
					title="Email"
					type="email"
					name="email"
					value={email}
					setValue={(e) => setEmail(e.target.value)}
					className={hasError("email") ? "is-invalid" : ""}
					errorDiv={hasError("email") ? "text-danger" : "d-none"}
					errorMsg={"Please enter a valid email address"}
					placeholder="email"
				/>
				<Input
					title="Password"
					type="password"
					name="password"
					value={password}
					setValue={(e) => setPassword(e.target.value)}
					className={hasError("password") ? "is-invalid" : ""}
					errorDiv={hasError("password") ? "text-danger" : "d-none"}
					errorMsg={"Please enter a password"}
					placeholder="password"
				/>
				<hr />
				<button className="btn btn-primary">Login</button>
			</form>
		</>
	)
}
