export interface SelectOption<T extends string | number> extends React.OptionHTMLAttributes<HTMLOptionElement> {
  value: T,
  label: string
}

interface SelectFieldProps<T extends string | number> extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string
  id: string
  label: string
  options: SelectOption<T>[]
}

export const SelectField = <T extends string | number>(props: SelectFieldProps<T>) => {
  const { name, id, label, options, ...selectProps } = props

  return (
    <p>
      <label htmlFor={name}>{props.label}</label>
      <select name={name} id={id} {...selectProps}>
        {options.map((option, i) => <option key={i} value={option.value}>{option.label}</option>)}
      </select>
    </p>
  )
}
