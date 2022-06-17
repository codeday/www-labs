import { Checkbox, Box } from '@codeday/topo/Atom';
import { useReducer } from 'react';

const allTrue = (arr) => arr.reduce((accum, e) => accum && e, true);

export default function ConfirmAll({ toConfirm, onUpdate, ...props }) {
  const [, confirm] = useReducer((prev, [i, checked]) => {
    console.log('PREV', prev);
    const copy = [...prev];
    copy[i] = checked;
    if (allTrue(copy) !== allTrue(prev)) onUpdate(allTrue(copy));
    return copy;
  }, new Array(toConfirm.length).fill(false));

  return (
    <Box {...props}>
      {toConfirm.map((label, i) => (
        <Checkbox onChange={(e) => confirm([i, e.target.checked])}>{label}</Checkbox>
      ))}
    </Box>
  );
}
