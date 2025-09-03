import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';

function App() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default App;