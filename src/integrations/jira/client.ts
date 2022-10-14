import JiraApi from "jira-client";

/** Creates client for Jira API */
export function createClient(): JiraApi {
  var client = new JiraApi({
    protocol: "https",
    host: "jira.somehost.com",
    username: "username",
    password: "password",
    apiVersion: "2",
    strictSSL: true,
  });
  return client;
}
