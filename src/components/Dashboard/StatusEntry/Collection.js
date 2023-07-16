import { Children, isValidElement } from 'react';
import { StatusEntry } from './StatusEntry';
import { Accordion } from '@chakra-ui/react';

export default function StatusEntryCollection({ onlyType, children, ...props }) {
  const sortedChildren = Children
    .toArray(children)
    .filter(c => {
      if (!isValidElement(c) || c.type !== StatusEntry) return false;
      if (onlyType === 'all') return true;
      if (onlyType === 'other' && ['mentor', 'student'].includes(c.props.type)) return true;
      return onlyType === c.props.type;
    })
    .sort((a, b) => {
      if (!a.props.date && !b.props.date) return 0;
      if (!a.props.date) return -1;
      if (!b.props.date) return 1;
      if (a.props.date > b.props.date) return 1;
      if (a.props.date < b.props.date) return -1;
      return 0;
    });

  return (
    <Accordion allowToggle>
      {sortedChildren}
    </Accordion>
  )
} 