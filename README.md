# aws-nodejs-membership-api
An AWS serverless Nodejs-based REST API (Using  AWS API Gateway, Lambda and DynamoDB) for the adminstration of 
an Organization with annually repeating: events, members and memberships.

The application consists of three parts:
1.) this Membership-App with API Gateway, Lambda DynamodB CRUD functionality)
2.) an authorization service (a Lambda authorizer connecting with auth0 
for JWT validation)
3.) An email Lambda Service  with an SQS Queue as an Event Source
 
Each part is established as an independent serverless project with
a distinct serverless.yml IaaC configuration file and a distinct
package.json file.

Workflow is as follows When a new User logs in, he connects against auth0 to
receieve a JSON WEb Token. This token is passed to the API Gateway
where a Lambda Authorizer validates the token against auth0. In case the token is valid, the user will be 
forwarded to the Lambda proxy function.
