import JiraApi from "jira-client";

import { JiraConfig } from "../../config";

let CLIENT: JiraApi;

/** Creates client for Jira API */
function createClient(options: JiraConfig): JiraApi {
  const client = new JiraApi({
    protocol: "https",
    host: options.url,
    username: options.username,
    password: options.accessToken,
    apiVersion: "2",
    strictSSL: true,
  });
  return client;
}

/** Initializes Jira client */
export function initializeClient(options: JiraConfig): void {
  CLIENT = createClient(options);
}

/** Gets issue by Id from Jira */
export async function getIssue(issueId: string): Promise<unknown> {
  const issue = await CLIENT.getIssue(issueId);
  return issue;
}
