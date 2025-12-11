import LanguageTutor from './LanguageTutorApp';
import ErrorBoundary from './ErrorBoundary';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <LanguageTutor />
    </ErrorBoundary>
  );
}

export default App;

