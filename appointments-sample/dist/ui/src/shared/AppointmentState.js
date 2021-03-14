"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentStatusEnum = exports.AppointmentState = void 0;
// Appointment state
class AppointmentState {
    constructor() {
        this.participants = [];
        this.participantsAccepted = [];
        this.status = AppointmentStatusEnum.Pending;
    }
}
exports.AppointmentState = AppointmentState;
var AppointmentStatusEnum;
(function (AppointmentStatusEnum) {
    AppointmentStatusEnum[AppointmentStatusEnum["Pending"] = 0] = "Pending";
    AppointmentStatusEnum[AppointmentStatusEnum["Accepted"] = 1] = "Accepted";
    AppointmentStatusEnum[AppointmentStatusEnum["Declined"] = 2] = "Declined";
})(AppointmentStatusEnum = exports.AppointmentStatusEnum || (exports.AppointmentStatusEnum = {}));
//# sourceMappingURL=AppointmentState.js.map