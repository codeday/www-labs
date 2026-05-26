import { useState } from 'react';
import { useToasts } from '@codeday/topo/utils';
import { useFetcher } from '../../dashboardFetch';
import { AcceptOffer } from '../../pages/dash/s/[token]/offerAccept.gql';

const EMPTY_CONTRACT = { data: {}, errors: {} };

export default function useOfferAcceptForm() {
  const fetch = useFetcher();
  const { error } = useToasts();

  const [isLoading, setIsLoading] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isConfirmed, setConfirmed] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [contracts, setContracts] = useState({
    event: EMPTY_CONTRACT,
    partner: EMPTY_CONTRACT,
  });
  const [selectedTimezone, setSelectedTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const [timeManagementPlan, setTimeManagementPlan] = useState({});
  const [timeManagementHours, setTimeManagementHours] = useState(0);

  const setContractData = (key, data) =>
    setContracts((prev) => ({ ...prev, [key]: { ...prev[key], data } }));
  const setContractErrors = (key, errors) =>
    setContracts((prev) => ({ ...prev, [key]: { ...prev[key], errors } }));
  const setTimeManagement = (hours, plan) => {
    setTimeManagementHours(hours);
    setTimeManagementPlan(plan);
  };

  const minHours = (student) => student.minHours || 30;

  const canSubmit = (student) =>
    !isLoading
    && isConfirmed
    && isSigned
    && timeManagementHours >= minHours(student)
    && Object.keys(contracts.event.errors).length === 0
    && Object.keys(contracts.partner.errors).length === 0;

  async function submit() {
    setIsLoading(true);
    try {
      await fetch(AcceptOffer, {
        timeManagementPlan,
        timezone: selectedTimezone.value || selectedTimezone,
        partnerContractData: contracts.partner.data,
        eventContractData: contracts.event.data,
      });
      setIsAccepted(true);
    } catch (ex) {
      error(ex.toString());
    }
    setIsLoading(false);
  }

  return {
    isLoading,
    isAccepted,
    isConfirmed,
    setConfirmed,
    isSigned,
    setIsSigned,
    contracts,
    setContractData,
    setContractErrors,
    selectedTimezone,
    setSelectedTimezone,
    timeManagementPlan,
    timeManagementHours,
    setTimeManagement,
    canSubmit,
    submit,
  };
}
