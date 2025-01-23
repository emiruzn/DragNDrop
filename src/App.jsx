import { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.css';
import Login from './components/login/Login';
import MainApp from './components/main/MainApp'; // Import your main application component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      {isLoading ? (
        <div className="loading-screen">
          <div className="loading-bar"></div>
        </div>
      ) : (
        <TransitionGroup>
          <CSSTransition
            key={isLoggedIn ? 'mainApp' : 'login'}
            timeout={500}
            classNames="slide"
          >
            {isLoggedIn ? <MainApp onLogout={handleLogout} /> : <Login onLoginSuccess={handleLoginSuccess} />}
          </CSSTransition>
        </TransitionGroup>
      )}
    </div>
  );
}

export default App;
