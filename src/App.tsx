import './App.css';
import GenreAccueil from './assets/GenreAccueil';
import Header from './assets/Header';
import SlideAcceuil from './assets/SlideAcceuil';

function App() {
  return (
    <div>
  <div className="global-blur-overlay"></div>
  <Header />
        <SlideAcceuil />
        <GenreAccueil/>
    </div>
  );
}

export default App;
