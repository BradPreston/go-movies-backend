export default function Textarea(props) {
	return (
		<div className="mb-3">
			<label htmlFor={props.name} className="form-label">
				{props.title}
			</label>
			<textarea id={props.name} name={props.name} className={`form-control ${props.className}`} value={props.value} rows={props.rows} onChange={props.setValue} />
			<div className={props.errorDiv}>{props.errorMsg}</div>
		</div>
	)
}
