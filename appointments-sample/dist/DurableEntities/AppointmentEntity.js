"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentEntity = void 0;
const DurableEntity_1 = require("../common/DurableEntity");
const AppointmentState_1 = require("../ui/src/shared/AppointmentState");
// Appointment logic implementation
class AppointmentEntity extends DurableEntity_1.DurableEntity {
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
    // Overriding visibility. This entity should only be visible to people mentioned in this.stateMetadata.allowedUsers
    get visibility() { return DurableEntity_1.VisibilityEnum.ToListOfUsers; }
}
exports.AppointmentEntity = AppointmentEntity;
//# sourceMappingURL=AppointmentEntity.js.map