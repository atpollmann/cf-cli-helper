module.exports = {
  env: "prod",
  aws: {
    credentialsProfile: "default",
    region: "us-east-1",
    pollingInterval: 1,
    onCreateStackFailure: "ROLLBACK",
    template: "main.yml",
    capabilities: ["CAPABILITY_IAM"]
  }
};
