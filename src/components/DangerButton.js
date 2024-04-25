import { Button } from '@codeday/topo/Atom';
import { useEffect, useState } from 'react';

export default function DangerButton({ onClick, ...props }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (!isEnabled || typeof window === 'undefined') return;
    setTimeout(() => setIsEnabled(false), 3000);
  }, [isEnabled, typeof window]);

  if (!isEnabled) return <Button {...props} onClick={() => setIsEnabled(true)} />
  else return (
    <Button
      {...props}
      isLoading={isLoading}
      colorScheme="red"
      onClick={async (e) => { setIsLoading(true); await onClick(e); setIsLoading(false); }}
    >
      Are you sure?
    </Button>
  );
}