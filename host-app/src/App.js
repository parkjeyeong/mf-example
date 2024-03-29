import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import System from "./System";
import ModuleFederationInitializer from "./module-federation/ModuleFederationInitializer";
import useFederatedComponent from "./module-federation/hooks/useFederatedComponent";

/**
 * Module Federation Init
 */
const moduleFederationInitializer = new ModuleFederationInitializer();
moduleFederationInitializer.init();

function App() {
  const [{ url, scope, module }, setSystem] = useState([]);
  const { Component: FederatedComponent, errorLoading } = useFederatedComponent(url, scope, module);

  function setAdmin() {
    setSystem({
      url: 'http://127.0.0.1:3002/remote_app2.remoteEntry.js',
      scope: 'remote_app2',
      module: './App',
    });
  }

  return (
    <Router basename="/">
      <Routes>
        <Route path="*" element={ <System /> } />
        <Route path="/admin" />
      </Routes>
    </Router>
  )
}

export default App;
