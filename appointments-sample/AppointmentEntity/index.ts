import * as DurableFunctions from "durable-functions";

import { DurableEntity, VisibilityEnum } from '../Common/DurableEntity';
import { AppointmentState, AppointmentStatusEnum } from '../ui/src/shared/AppointmentState';

// Appointment logic implementation
class AppointmentEntity extends DurableEntity<AppointmentState>
{
    // Overriding visibility. This entity should only be visible to people mentioned in this.stateMetadata.allowedUsers
    protected get visibility(): VisibilityEnum { return VisibilityEnum.ToListOfUsers; }

    // Initializes new appointment instance
    init(participants: string[]) {

        // Adding appointment creator to the list of participants
        if (!participants.includes(this.stateMetadata.owner)) {
            participants.push(this.stateMetadata.owner);
        }

        this.state.participants = participants;
        this.state.participantsAccepted = [];
        this.state.status = AppointmentStatusEnum.Pending;

        // Sharing this entity with all participants
        this.stateMetadata.allowedUsers = participants;
    }

    // Handles someone's response
    respond(isAccepted: boolean) {

        // If someone declined
        if (!isAccepted) {
            this.state.status = AppointmentStatusEnum.Declined;
            return;
        }

        // Adding calling user to the list of participants that accepted
        if (!this.state.participantsAccepted.includes(this.callingUser)) {
            this.state.participantsAccepted.push(this.callingUser);
        }

        // If everyone has accepted
        if (this.state.participants.every(u => this.state.participantsAccepted.includes(u))) {
            this.state.status = AppointmentStatusEnum.Accepted;
        }
    }

    // Deletes this entity
    delete() {
        this.destructOnExit();
    }
}

// Boilerplate to expose this class as a Durable Entity
export default DurableFunctions.entity((ctx) => new AppointmentEntity(ctx).handleSignal());