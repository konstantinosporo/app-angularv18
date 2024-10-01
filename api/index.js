export default import('../dist/app-angularv18/server/server.mjs')
  .then(module => {
    console.log("Hello from server");
    return module.app();
  });
