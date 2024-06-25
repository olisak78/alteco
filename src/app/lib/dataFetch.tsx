'use client';
import { useState, useEffect, useMemo } from 'react';

// Custom Hook for fetching the stock data from Server

const useDataFetching = (url: string) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
    };

    fetchData();
  }, [url]);

  // Memoizing the data
  const memoizedData = useMemo(() => data, [data]);

  return memoizedData;
};

export default useDataFetching;
