"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DurableFunctions = require("durable-functions");
const DurableEntity_1 = require("../Common/DurableEntity");
const AppointmentState_1 = require("../ui/src/shared/AppointmentState");
// Appointment logic implementation
class AppointmentEntity extends DurableEntity_1.DurableEntity {
    // Overriding visibility. This entity should only be visible to people mentioned in this.stateMetadata.allowedUsers
    get visibility() { return DurableEntity_1.VisibilityEnum.ToListOfUsers; }
    // Initializes new appointment instance
    init(participants) {
        // Adding appointment creator to the list of participants
        if (!participants.includes(this.stateMetadata.owner)) {
            participants.push(this.stateMetadata.owner);
        }
        this.state.participants = {};
        for (var name of participants) {
            this.state.participants[name] = AppointmentState_1.AppointmentStatusEnum.Pending;
        }
        this.state.status = AppointmentState_1.AppointmentStatusEnum.Pending;
        // Sharing this entity with all participants
        this.stateMetadata.allowedUsers = participants;
    }
    // Handles someone's response
    respond(isAccepted) {
        // Saving user's response
        this.state.participants[this.callingUser] = isAccepted ? AppointmentState_1.AppointmentStatusEnum.Accepted : AppointmentState_1.AppointmentStatusEnum.Declined;
        // Updating appointment's status
        if (Object.keys(this.state.participants).every(name => this.state.participants[name] === AppointmentState_1.AppointmentStatusEnum.Accepted)) {
            // Everyone has accepted
            this.state.status = AppointmentState_1.AppointmentStatusEnum.Accepted;
        }
        else if (!isAccepted) {
            // Someone has declined
            this.state.status = AppointmentState_1.AppointmentStatusEnum.Declined;
        }
    }
    // Deletes this entity
    delete() {
        this.destructOnExit();
    }
}
// Boilerplate to expose this class as a Durable Entity
exports.default = DurableFunctions.entity((ctx) => new AppointmentEntity(ctx).handleSignal());
//# sourceMappingURL=index.js.map