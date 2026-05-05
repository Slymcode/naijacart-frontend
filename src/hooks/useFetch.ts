import { useState, useCallback, useRef, useEffect } from "react";

interface UseFetchOptions {
  immediate?: boolean;
}

export const useFetch = <T>(
  fetchFn: () => Promise<any>,
  options: UseFetchOptions = {},
) => {
  const { immediate = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);
  const fetchFnRef = useRef(fetchFn);

  useEffect(() => {
    fetchFnRef.current = fetchFn;
  }, [fetchFn]);

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchFnRef.current();
      setData(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "An error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    data,
    isLoading,
    error,
    execute,
    reload: execute,
  };
};
