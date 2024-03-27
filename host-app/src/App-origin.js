import React, { Suspense, lazy } from 'react';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import ErrorBoundary from './ErrorBoundary';

const Remote1 = lazy(() => import('remote_app1/App')
                .catch(() => { 
                  return lazy(() => import('./Default'));
                }));

const Remote2 = lazy(() => import('remote_app2/App')
                .catch(() => { 
                  return lazy(() => import('./Default'));
                }));

// const Remote1 = loadRemoteApp('remote_app1/App');
// const Remote2 = loadRemoteApp('remote_app2/App');

function App() {
  return (
    <Router basename="/">
      <div className="App">
        <div className="head-container">
          <h1>Host App</h1>
        </div>
        <div className="main-container">
          <div className="left-container">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/remote1">remote1</Link>
              </li>
              <li>
                <Link to="/remote2">remote2</Link>
              </li>
            </ul>
          </div>
          <div className="flex-container">
            <Routes>
              <Route path="/" element={
                <div><p>Home</p></div>
              } />
              
              <Route path="/remote1" element={ 
                <div className="half-container">
                  <ErrorBoundary>
                    <Suspense fallback={ <div><p>loading</p></div> }>
                      <Remote1 />
                    </Suspense>
                  </ErrorBoundary>
                </div>
              } />

              <Route path="/remote2" element={ 
                <div className="half-container">
                  <ErrorBoundary>
                    <Suspense fallback={ <div><p>loading</p></div> }>
                      <Remote2 />
                    </Suspense>
                  </ErrorBoundary>
                </div>
              } />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
