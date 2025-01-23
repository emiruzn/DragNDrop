import { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.css';
import Login from './components/login/Login';
import MainApp from './components/main/MainApp'; // Import your main application component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      <TransitionGroup>
        <CSSTransition
          key={isLoggedIn ? 'mainApp' : 'login'}
          timeout={500}
          classNames="slide"
        >
          {isLoggedIn ? <MainApp onLogout={handleLogout} /> : <Login onLoginSuccess={handleLoginSuccess} />}
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
}

export default App;
