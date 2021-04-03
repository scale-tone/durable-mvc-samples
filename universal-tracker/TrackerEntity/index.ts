
import * as DurableFunctions from "durable-functions"
import { TrackerEntity } from '../DurableEntities/TrackerEntity';
export default DurableFunctions.entity((ctx) => new TrackerEntity(ctx).handleSignal());
        