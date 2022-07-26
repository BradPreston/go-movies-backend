export default function Alert(props) {
    return (
        <div className={`alert ${props.type}`} role="alert">
            {props.message}
        </div>
    )
}