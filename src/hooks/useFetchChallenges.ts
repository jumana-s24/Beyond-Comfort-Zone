import { getChallengesService } from "../services/globalChallengeService";
import { useInfiniteQuery } from "react-query";

export const useFetchChallenges = (selectedDifficulty: string | null) => {
  return useInfiniteQuery(
    ["challenges", selectedDifficulty],
    ({ pageParam = null }) =>
      getChallengesService(selectedDifficulty, pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.nextPageCursor || undefined,
    }
  );
};
