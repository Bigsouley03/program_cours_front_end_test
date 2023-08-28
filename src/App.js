import React from 'react';
import Login from './Components/Auth/Login';
import DashboardLayout from './Components/Layouts/DashboardLayout';
import useAccessToken from './Components/Auth/UseAccessToken';


export default function App() {
  const [accessToken, setAccessToken] = useAccessToken();

  return (
    <div className="App">
      {accessToken ? (
        <DashboardLayout accessToken={accessToken} setAccessToken={setAccessToken} />
      ) : (
        <Login accessToken={accessToken} setAccessToken={setAccessToken} />
      )}
    </div>
  );
}
