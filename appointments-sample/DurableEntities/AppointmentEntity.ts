import { DurableEntity, VisibilityEnum } from '../common/DurableEntity';
import { AppointmentState, AppointmentStatusEnum } from '../ui/src/shared/AppointmentState';

// Appointment logic implementation
export class AppointmentEntity extends DurableEntity<AppointmentState>
{
    // Initializes new appointment instance
    init(participants: string[]) {

        // Adding appointment creator to the list of participants
        if (!participants.includes(this.stateMetadata.owner)) {
            participants.push(this.stateMetadata.owner);
        }

        this.state.participants = {};
        for (var name of participants) {
            this.state.participants[name] = AppointmentStatusEnum.Pending;
        }
        this.state.status = AppointmentStatusEnum.Pending;

        // Sharing this entity with all participants
        this.stateMetadata.allowedUsers = participants;
    }

    // Handles someone's response
    respond(isAccepted: boolean) {

        // Saving user's response
        this.state.participants[this.callingUser] = isAccepted ? AppointmentStatusEnum.Accepted : AppointmentStatusEnum.Declined;

        // Updating appointment's status
        if (Object.keys(this.state.participants).every(name => this.state.participants[name] === AppointmentStatusEnum.Accepted)) {
            // Everyone has accepted
            this.state.status = AppointmentStatusEnum.Accepted;
        } else if (!isAccepted) {
            // Someone has declined
            this.state.status = AppointmentStatusEnum.Declined;
        }
    }

    // Deletes this entity
    delete() {
        this.destructOnExit();
    }

    // Overriding visibility. This entity should only be visible to people mentioned in this.stateMetadata.allowedUsers
    protected get visibility(): VisibilityEnum { return VisibilityEnum.ToListOfUsers; }
}