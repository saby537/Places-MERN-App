import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const activeHttpRequests = useRef([]);
  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);
      try {
        const res = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });
        const responseData = await res.json();
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqctrl) => reqctrl !== httpAbortCtrl
        );
        if (!res.ok) {
          throw new Error(responseData.message);
        }
        setIsLoading(false);
        return responseData;
      } catch (err) {
        setError(
          err.message || "An Unknown Error has occurred. Please try again"
        );
        setIsLoading(false);
        throw err;
      }
    },
    []
  );
  const clearError = () => {
    setError(null);
  };
  useEffect(() => {
    activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
