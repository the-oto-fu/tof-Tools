import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import './App.css';
import SiteHeader from './components/SiteHeader';
import Top from './components/Top'
import Minikuji from './components/Minikuji';

function App() {
  const location = useLocation();

  return (
    <div className="App">
      <div className='App-Header'>
        <SiteHeader />
      </div>
      <div className='App-Body'>
        <Routes location={location} key={location.pathname}>
          <Route path={'/'} element={<Top
          />} />
          <Route path={'/minikuji'} element={<Minikuji
          />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
