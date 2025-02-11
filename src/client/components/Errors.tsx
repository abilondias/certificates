interface ErrorsProps {
  errors: string[] | undefined
}

export const Errors: React.FC<ErrorsProps> = ({ errors }) => {
  if (!errors || errors.length == 0) {
    return
  }

  return (
    <div className="flash danger">
      <p>There were problems with the submission:</p>
      <ul>
        {errors.map((error, i) => <li key={i}>{error}</li>)}
      </ul>
    </div>
  )
}
