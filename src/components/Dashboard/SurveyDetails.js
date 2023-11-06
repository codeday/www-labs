import { useAccordionItemState } from "@chakra-ui/react";
import SurveyFields from "../SurveyFields";
import { useEffect, useState } from "react";
import { SurveyResponseDetails } from './SurveyDetails.gql';
import { Spinner } from "@codeday/topo/Atom";
import { apiFetch } from "@codeday/topo/utils";
import { getReflectionType } from "../../utils";

export default function SurveyDetails({ token, id }) {
  const { isOpen } = useAccordionItemState();
  const [sr, setSr] = useState(false);

  useEffect(async () => {
    if (typeof window === 'undefined' || !isOpen || sr) return;
    const result = await apiFetch(
      SurveyResponseDetails,
      { where: id },
      { 'X-Labs-Authorization': `Bearer ${token}` },
    );
    setSr(result.labs.getSurveyResponse);
  }, [typeof window, sr, isOpen]);

  if (!sr) {
    return <Spinner />;
  }

  return (
    <SurveyFields
      content={sr.response}
      displayFn={sr.surveyOccurence.survey[`${getReflectionType(sr, sr.surveyOccurence.survey)}Display`]}
    />
  );
}