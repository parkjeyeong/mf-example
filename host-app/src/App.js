import { init, loadRemote } from '@module-federation/runtime';
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Default from './Default';

init({
  name: 'host_app',
  remotes: [
    {
      name: 'remote_app1',
      entry: 'http://127.0.0.1:3001/remoteEntry.js'
    },
    {
      name: 'remote_app2',
      entry: 'http://127.0.0.1:3002/remoteEntry.js'
    },
  ]
});

function loadComponent(scope, module) {
  return async () => {
    const Module = await loadRemote(`${scope}/${module.slice(2)}`);
    return Module;
  }
}

const urlCache = new Set();
const useDynamicScript = url => {
  const [ready, setReady] = useState(false);
  const [errorLoading, setErrorLoading] = useState(false);

  useEffect(() => {
    if (!url) return;

    if (urlCache.has(url)) {
      setReady(true);
      setErrorLoading(false);
      return;
    }

    setReady(false);
    setErrorLoading(false);

    const element = document.createElement('script');

    element.src = url;
    element.type = 'text/javascript';
    element.async = true;

    element.onload = () => {
      urlCache.add(url);
      setReady(true);
    }

    element.onerror = () => {
      setReady(false);
      setErrorLoading(true);
    }

    document.head.appendChild(element);

    return () => {
      urlCache.delete(url);
      document.head.removeChild(element);
    }
  }, [url]);

  return {
    errorLoading,
    ready,
  }
}

const componentCache = new Map();

export const useFederatedComponent = (remoteUrl, scope, module) => {
  const key = `${remoteUrl}-${scope}-${module}`;
  const [Component, setComponent] = useState(null);

  const { ready, errorLoading } = useDynamicScript(remoteUrl);

  useEffect(() => {
    if (Component) setComponent(null);

    // eslint-disable-next-line
  }, [key]);

  useEffect(() => {
    if (ready && !Component) {
      const Comp = lazy(loadComponent(scope, module));
      componentCache.set(key, Comp);
      setComponent(Comp);
    }

    // eslint-disable-next-line
  }, [Component, ready, key]);

  return { errorLoading, Component }
}

function App() {
  const [{ module, scope, url }, setSystem] = useState([]);

  function setRemote1() {
    setSystem({
      url: 'http://127.0.0.1:3001/remote_app1.remoteEntry.js',
      scope: 'remote_app1',
      module: './App'
    });
  }

  function setRemote2() {
    setSystem({
      url: 'http://127.0.0.1:3002/remote_app2.remoteEntry.js',
      scope: 'remote_app2',
      module: './App'
    });
  }

  const { Component: FederatedComponent, errorLoading } = useFederatedComponent(url, scope, module);

  // clean-up 함수 예제
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    }
  }, []);

  return (
    <Router basename="/">
      <div className="App">
        <div className="head-container">
          <h1>Host App</h1>
          <p>{ time }</p>
        </div>
        <div className="main-container">
          <div className="left-container">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/remote1" onClick={ setRemote1 }>remote1</Link>
              </li>
              <li>
                <Link to="/remote2" onClick={ setRemote2 }>remote2</Link>
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
                  <Suspense fallback="Loading System">
                    {
                      errorLoading
                        ? <Default />
                        : FederatedComponent && <FederatedComponent />
                    }
                  </Suspense>
                </div>
              } />

              <Route path="/remote2" element={ 
                <div className="half-container">
                  <Suspense fallback="Loading System">
                    {
                      errorLoading
                        ? <Default />
                        : FederatedComponent && <FederatedComponent />
                    }
                  </Suspense>
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
