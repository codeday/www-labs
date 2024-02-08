import { useTimezoneSelect, allTimezones } from 'react-timezone-select'
import { Select } from '@codeday/topo/Atom';

const labelStyle = 'original'

export default function TimezoneSelect({ value, onChange }) {
  const { options, parseTimezone } = useTimezoneSelect({ labelStyle, allTimezones });

  return (
    <Select onChange={e => onChange(parseTimezone(e.currentTarget.value))} value={typeof value === 'object' ? value.value : value}>
      {options.map(option => (
        <option value={option.value}>{option.label}</option>
      ))}
    </Select>
  )
}