import { AzureFunction, Context } from "@azure/functions"
import * as DurableFunctions from 'durable-functions';

const timerTrigger: AzureFunction = async function (context: Context): Promise<void> {

    const durableClient = DurableFunctions.getClient(context);
    
    const entityNameString = `@trackerentity@`;
    const allStatuses = (await durableClient.getStatusAll())
        .filter(s => (s.input as any)?.exists === true && s.instanceId.startsWith(entityNameString));

    // Just sending the 'track' signal to all existing entities
    for (const status of allStatuses) {
        const entityId = new DurableFunctions.EntityId('trackerentity', status.instanceId.substr(entityNameString.length));
        await durableClient.signalEntity(entityId, 'track');
    }
};

export default timerTrigger;
