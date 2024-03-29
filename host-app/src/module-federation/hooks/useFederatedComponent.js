import { loadRemote } from "@module-federation/runtime/.";
import { lazy, useEffect, useState } from "react";
import useDynamicScript from "./useDynamicScript";

const componentCache = new Map();

export default function useFederatedComponent(remoteUrl, scope, module) {
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

function loadComponent(scope, module) {
  return async () => {
    const Module = await loadRemote(`${scope}/${module.slice(2)}`);
    return Module;
  }
}