import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css';
import SiteHeader from './components/SiteHeader';
import Top from './components/Top'
import Minikuji from './components/Minikuji';
import TreasureMapping from './components/TreasureMapping';

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
          <Route path={'/treasuremapping'} element={<TreasureMapping
          />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
