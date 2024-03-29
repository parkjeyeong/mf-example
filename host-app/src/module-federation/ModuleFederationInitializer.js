import { init as mfInit } from "@module-federation/runtime/.";

export default class ModuleFederationInitializer {
  init() {
    mfInit({
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
  }
}
