# appointments-sample

This sample is built with [durable-mvc-starter](https://github.com/scale-tone/durable-mvc-starter) and demonstrates the way you can define your [Durable Entities](https://docs.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-entities?tabs=javascript) with class-based syntax and then render an [observable collection](https://mobx.js.org/observable-state.html) of those entities on the client. It also illustrates how to specify a different visibility level - `VisibilityEnum.ToListOfUsers` for your entity.

# Prerequisites
* [Azure Functions Core Tools](https://www.npmjs.com/package/azure-functions-core-tools) **globally** installed on your devbox.
* An instance of Azure SignalR Service [configured in Serverless mode](https://docs.microsoft.com/en-us/azure/azure-signalr/concept-service-mode#serverless-mode).

# How to run locally

* Clone this repo.
* In the main project's root folder (the one that contains host.json) create a **local.settings.json** file, which should look like this:
  ```
  {
      "IsEncrypted": false,
      "Values": {
          "AzureWebJobsStorage": "<connection-string-to-your-azure-storage-account>",
          "AzureSignalRConnectionString": "<connection-string-to-your-azure-signalr-service-instance>",
          "AzureSignalRHubName": "DurableMvcTestHub",
          "FUNCTIONS_WORKER_RUNTIME": "node"
      }
  }
  ```
* In that same root folder run:
  ```
  npm install
  npm run build
  func start
  ```
* Navigate to `http://localhost:7071` with your browser.

You will first need to 'login' with some user name (this is only needed for testing purposes when running locally on your devbox, when deployed to Azure and EasyAuth properly configured your real user name should be picked up automatically). Then you can type a comma-separated list of participants (e.g. first try typing your own user name) and create a new appointment. The list of appointments is shown below, and it only contains the appointments you've been invited to. An appointment can be accepted or declined. Once accepted by everyone, the appointment changes its status to `Accepted`. Once anybody declines an appointment, it turns into `Declined`. You can also remove an appointment.
Try opening the page in multiple browser tabs, login with different user names and share appointments between them.

# How to deploy to Azure

You can deploy the contents of this same repo with this
[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fscale-tone%2Fdurable-mvc-samples%2Fmain%2appointments-sample%2FFarm-template.json) button. It will create a Function App instance, an underlying Storage account and an Azure SignalR service instance. *Don't forget to remove those resources once done.*

Once you cloned this repo and added some code to your copy, you then deploy it [in the same way as you would normally deploy an Azure Functions Node.js project](https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-node?tabs=v2#deploying-with-dependencies).

