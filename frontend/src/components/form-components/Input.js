export default function Input(props) {
	return (
		<div className="mb-3">
			<label htmlFor={props.name} className="form-label">
				{props.title}
			</label>
			<input id={props.name} name={props.name} type={props.type} className={`form-control ${props.className}`} value={props.value} onChange={props.setValue} placeholder={props.placeholder} />
			<div className={props.errorDiv}>{props.errorMsg}</div>
		</div>
	)
}
