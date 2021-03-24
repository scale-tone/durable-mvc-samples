
import * as DurableFunctions from "durable-functions"
import { AppointmentEntity } from '../DurableEntities/AppointmentEntity';
export default DurableFunctions.entity((ctx) => new AppointmentEntity(ctx).handleSignal());
        