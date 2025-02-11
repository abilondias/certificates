interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  name: string
}

export const InputField: React.FC<InputFieldProps> = (props) => {
  const { label, name, ...inputProps } = props

  return (
    <p>
      <label htmlFor={name}>{label}</label>
      <input name={name} {...inputProps} />
    </p>
  )
}
