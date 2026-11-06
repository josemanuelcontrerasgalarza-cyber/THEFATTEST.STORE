"use client";

import { useEffect, useState } from "react";

/** True after hydration — use before rendering values that come from localStorage. */
export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}
