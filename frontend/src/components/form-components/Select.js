export default function Select(props) {
	return (
		<div className="mb-3">
			<label htmlFor={props.name} className="form-label">
				{props.title}
			</label>
			<select className={`form-control ${props.className}`} id={props.name} name={props.name} value={props.value} onChange={props.setValue}>
				<option className="form-select" value="">
					{props.placeholder}
				</option>
				{props.options.map((rating) => (
					<option className="form-select" key={rating.id} value={rating.id} label={rating.value}>
						{rating.value}
					</option>
				))}
			</select>
			<div className={props.errorDiv}>{props.errorMsg}</div>
		</div>
	)
}
