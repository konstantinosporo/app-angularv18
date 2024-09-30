export default import('../dist/app-angularv18/server/server.mjs').then(module => {
  console.log("Server function initialized");
  return module.app();
});
