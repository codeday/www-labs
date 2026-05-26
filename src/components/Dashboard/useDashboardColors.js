import { useColorModeValue } from '@codeday/topo/Theme';

export default function useDashboardColors() {
  return {
    bg: useColorModeValue(50, 900),
    borderColor: useColorModeValue(700, 600),
    color: useColorModeValue(900, 50),
  };
}
