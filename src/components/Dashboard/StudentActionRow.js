import { useState } from 'react';
import { Box, Button, Link } from '@codeday/topo/Atom';
import { useToasts } from '@codeday/topo/utils';
import { useFetcher } from '../../dashboardFetch';
import SelectTrack from './SelectTrack';
import {
  StudentChangeTrack,
  StudentTrackInterview,
  StudentOfferAdmission,
  StudentReject,
} from '../../pages/dash/a/[token]/admit.gql';

const nl2br = (str) => str && str
  .replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/(https?:\/\/[^\s\(\)]+)/g, (url) => `<a href="${url}" style="text-decoration: underline" target="_blank">${url}</a>`)
  .replace(/\n/g, '<br />');

export default function StudentActionRow({ student, onChange, ...rest }) {
  const fetch = useFetcher();
  const { success, error } = useToasts();
  const [track, setTrack] = useState(student.track);
  const [isLoading, setIsLoading] = useState(false);

  const runMutation = async (mutation, vars, successMessage, onSuccess) => {
    setIsLoading(true);
    try {
      await fetch(mutation, vars);
      success(successMessage);
      if (onSuccess) onSuccess();
      onChange();
    } catch (ex) {
      error(ex.toString());
    }
    setIsLoading(false);
  };

  const country = student.profile?.location?.country || student?.profile?.country;
  const ratingAvg = Math.round(student.admissionRatingAverage, 2);
  const trackSummary = student.trackRecommendation
    .map((rec) => `${Math.floor(rec.weight * 100)}% ${rec.track[0]}`).join(' / ');

  return (
    <Box as="tr" {...rest}>
      <Box as="td">
        <Link href={`mailto:${student.email}`}>{student.name}</Link><br />
        <Link href={`student/${student.id}`} target="_blank">#{student.id}</Link><br />
        {student.status}<br />
        {student.minHours} hours<br />
        {student.timezone} {country}<br />
        {student.profile?.yearsToGraduation
          ? <>{student.profile.yearsToGraduation} years to graduation<br /></>
          : ''}
        {student.partnerCode && (<><br />Partner Code: {student.partnerCode}</>)}
      </Box>
      <Box as="td">
        {ratingAvg} (of {student.admissionRatingCount || 0})<br />
        {trackSummary}
      </Box>
      <Box as="td">
        <div dangerouslySetInnerHTML={{ __html: nl2br(student.interviewNotes) }} />
      </Box>
      <Box as="td">
        <SelectTrack
          disabled={isLoading}
          track={track}
          size="sm"
          onChange={(e) => runMutation(
            StudentChangeTrack,
            { id: student.id, track: e.target.value },
            `Changed ${student.name}'s track to ${e.target.value}`,
            () => setTrack(e.target.value),
          )}
        /><br />
        <Button
          isLoading={isLoading}
          disabled={isLoading}
          colorScheme="purple"
          size="xs"
          onClick={() => runMutation(StudentTrackInterview, { id: student.id }, 'Interview request sent.')}
        >
          Interview
        </Button>{' '}
        <Button
          isLoading={isLoading}
          disabled={isLoading}
          colorScheme="green"
          size="xs"
          onClick={() => runMutation(StudentOfferAdmission, { id: student.id }, 'Offer sent.')}
        >
          Admit
        </Button>{' '}
        <Button
          isLoading={isLoading}
          disabled={isLoading}
          colorScheme="red"
          size="xs"
          onClick={() => runMutation(StudentReject, { id: student.id }, 'Rejection sent.')}
        >
          Reject
        </Button>
      </Box>
    </Box>
  );
}
