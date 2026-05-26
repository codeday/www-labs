import { useEffect, useState } from 'react';
import { useToasts } from '@codeday/topo/utils';
import { useFetcher } from '../../dashboardFetch';
import {
  StudentNeedingRating,
  StudentNeedingRatingInTrack,
  SubmitRating,
} from '../../pages/dash/r/[token]/index.gql';

export default function useReviewQueue({ token }) {
  const fetch = useFetcher();
  const { success, error } = useToasts();
  const [studentResp, setStudentResp] = useState();
  const [recommendedTrack, setRecommendedTrack] = useState();
  const [track, setTrack] = useState(null);
  const [rating, setRating] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const next = async () => {
    if (track) return fetch(StudentNeedingRatingInTrack, { track });
    return fetch(StudentNeedingRating);
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !token) return;
    next().then(setStudentResp).catch((ex) => error(ex.toString()));
  }, [token, track]);

  useEffect(() => {
    if (studentResp) {
      setRecommendedTrack(studentResp?.labs?.nextStudentNeedingRating?.track);
      setRating(null);
    }
  }, [studentResp]);

  const skip = async () => {
    setIsLoading(true);
    setStudentResp(await next());
    setIsLoading(false);
  };

  const submit = async (student) => {
    setIsLoading(true);
    try {
      await fetch(SubmitRating, { id: student.id, rating: rating * 2, track: recommendedTrack });
      setStudentResp(await next());
      success('Submitted rating!');
    } catch (ex) {
      error(ex.toString());
    }
    setIsLoading(false);
  };

  return {
    student: studentResp?.labs?.nextStudentNeedingRating,
    track,
    setTrack,
    recommendedTrack,
    setRecommendedTrack,
    rating,
    setRating,
    isLoading,
    skip,
    submit,
  };
}
