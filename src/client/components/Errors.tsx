interface ErrorsProps {
  errors: string[] | undefined
}

export const Errors: React.FC<ErrorsProps> = ({ errors }) => {
  if (!errors || errors.length == 0) {
    return
  }

  return (
    <div className="flash danger" data-testid="error-container">
      <p>There were problems with the submission:</p>
      <ul>
        {errors.map((error, i) => <li data-testid="error-messages" key={i}>{error}</li>)}
      </ul>
    </div>
  )
}
