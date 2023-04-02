import './App.css';
import SiteHeader from './components/header';
import Top from './components/top'

function App() {
  return (
    <div className="App">
      <div className='App-Header'>
        <SiteHeader />
      </div>
      <div className='App-Body'>
        <Top />
      </div>
    </div>
  );
}

export default App;
