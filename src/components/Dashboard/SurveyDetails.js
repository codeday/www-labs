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

  useEffect(() => {
    if (typeof window === 'undefined' || !isOpen || sr) return;
    apiFetch(
      SurveyResponseDetails,
      { where: id },
      { 'X-Labs-Authorization': `Bearer ${token}` },
    )
    .then(r => setSr(r.labs.getSurveyResponse));
  }, [typeof window, sr, isOpen]);

  if (!sr) {
    return <Spinner />;
  }

  if (!sr.response || Object.keys(sr.response).length === 0) {
    return <>No information was shared with you.</>
  }

  return (
    <SurveyFields
      content={sr.response}
      displayFn={sr.surveyOccurence.survey[`${getReflectionType(sr, sr.surveyOccurence.survey)}Display`]}
    />
  );
}