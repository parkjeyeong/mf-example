import React from 'react';

export default function loadRemoteApp(remotePath) {
  return React.lazy(() => import(remotePath));
}