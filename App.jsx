import React from 'react';
import ResumeForm from './components/ResumeForm';
import './App.css'; // Assuming you have some global styles

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* You can add a header or navigation here if needed */}
      </header>
      <main>
        <ResumeForm />
        {/* Later, we will add logic to display selected templates here */}
      </main>
      <footer>
        {/* Footer content */}
      </footer>
    </div>
  );
}

export default App;

