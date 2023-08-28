import { useState, useEffect } from 'react';

const useAccessToken = () => {
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setAccessToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    } else {
      localStorage.removeItem('accessToken');
    }
  }, [accessToken]);

  return [accessToken, setAccessToken];
};

export default useAccessToken;
