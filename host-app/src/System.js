import React, { Suspense, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import './App.css';
import Default from './Default';
import useFederatedComponent from './module-federation/hooks/useFederatedComponent';

function System() {
  const [{ url, scope, module }, setSystem] = useState([]);
  const { Component: FederatedComponent, errorLoading } = useFederatedComponent(url, scope, module);

  function setRemote1() {
    setSystem({
      url: 'http://127.0.0.1:3001/remote_app1.remoteEntry.js',
      scope: 'remote_app1',
      module: './App',
    });
  }

  function setRemote2() {
    setSystem({
      url: 'http://127.0.0.1:3002/remote_app2.remoteEntry.js',
      scope: 'remote_app2',
      module: './App',
    });
  }

  return (
    <div className="App">
      <div className="head-container">
        <h1>Host App</h1>
        <Link to="/admin" target='_blank'>new window</Link>
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
          <div className="half-container">
            <Routes>
              <Route path="/" element={
                <div><p>Home</p></div>
              } />
              
              <Route path="/remote1" element={ 
                <Suspense fallback="Loading System">
                  {
                    errorLoading
                      ? <Default />
                      : FederatedComponent && <FederatedComponent />
                  }
                </Suspense>
              } />

              <Route path="/remote2" element={ 
                <Suspense fallback="Loading System">
                  {
                    errorLoading
                      ? <Default />
                      : FederatedComponent && <FederatedComponent />
                  }
                </Suspense>
              } />

              <Route path="/admin" element={ 
                <Suspense fallback="Loading System">
                  {
                    errorLoading
                      ? <Default />
                      : FederatedComponent && <FederatedComponent />
                  }
                </Suspense>
              } />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default System;