![logo](https://raw.githubusercontent.com/scale-tone/durable-mvc-samples/main/universal-tracker/screenshot1.png)
# universal-tracker

This sample web app can track virtually anything reachable via HTTP GET and visualize tracked values in form of a timeline graph or a map route (if the value represents geo coordinates).

The app is built with [durable-mvc-starter](https://github.com/scale-tone/durable-mvc-starter) and demonstrates the way you can define your [Durable Entities](https://docs.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-entities?tabs=javascript) with class-based syntax and then render an [observable collection](https://mobx.js.org/observable-state.html) of those entities on the client.

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
          "AzureSignalRHubName": "UniversalTrackerHub",
          "PollingIntervalCronExp": "*/5 * * * * *",
          "AzureMapSubscriptionKey": "<azure-maps-subscription-key>",
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

You will first need to 'login' with some user name (this is only needed for testing purposes when running locally on your devbox, when deployed to Azure and EasyAuth properly configured your real user name should be picked up automatically). Then specify some URL to track and (optionally) a [JSONPath](https://www.npmjs.com/package/jsonpath) or a Regular Expression to be applied to the response - and the backend will periodically poll that URL, while the client side will automatically infer the value type and visualize it accordingly. Numbers are shown as a graph, geo coordinates (JSON array of two numbers) are displayed on a map, everything else is visualized as a multi-color horizontal bar. For a map to be shown, you need to have your own [Azure Maps account](https://docs.microsoft.com/en-us/azure/azure-maps/how-to-manage-authentication#manage-and-rotate-shared-keys) and specify its subscription key via config settings.

# How to deploy to Azure

You can deploy the contents of this same repo with this
[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fscale-tone%2Fdurable-mvc-samples%2Fmain%2Funiversal-tracker%2Farm-template.json) button. It will create a Function App instance, an underlying Storage account and an Azure SignalR service instance. *Don't forget to remove those resources once done.*

Once you cloned this repo and added some code to your copy, you then deploy it [in the same way as you would normally deploy an Azure Functions Node.js project](https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-node?tabs=v2#deploying-with-dependencies).

