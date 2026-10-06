export default function Toast({ message, actionLabel = 'Undo', onAction }) {
  return (
    <div className="toast" role="status">
      <span>{message}</span>
      {onAction && (
        <button type="button" className="btn-link" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}
