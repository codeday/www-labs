import { useState } from "react";
import { useDateTime } from "./useDateTime";
import { DateTime } from "luxon";
import { useClientEffect } from "./useClientEffect";

function isBetween(d, after, before) {
  if (after && before) return d > after && d < before;
  if (after) return d > after;
  if (before) return d < before;
  return null;
}

export function useDateBetween(after, before) {
  const [result, setResult] = useState(isBetween(DateTime.now(), after, before));
  useClientEffect(
    () => setResult(isBetween(DateTime.now(), after, before)),
    [after, before]
  );

  useDateTime(
    (d) => setResult(isBetween(d, after, before)),
    [after, before]
  );
  return result;
}