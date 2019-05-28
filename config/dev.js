module.exports = {
  app: {
    workingDir: "dev/dev_workdir"
  },
  aws: {
    credentialsProfile: "default",
    region: "us-east-1",
    pollingInterval: 1,
    onCreateStackFailure: "ROLLBACK"
  }
};
