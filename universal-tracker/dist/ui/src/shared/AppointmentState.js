"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentState = exports.AppointmentStatusEnum = void 0;
var AppointmentStatusEnum;
(function (AppointmentStatusEnum) {
    AppointmentStatusEnum[AppointmentStatusEnum["Pending"] = 0] = "Pending";
    AppointmentStatusEnum[AppointmentStatusEnum["Accepted"] = 1] = "Accepted";
    AppointmentStatusEnum[AppointmentStatusEnum["Declined"] = 2] = "Declined";
})(AppointmentStatusEnum = exports.AppointmentStatusEnum || (exports.AppointmentStatusEnum = {}));
// Appointment state
class AppointmentState {
    constructor() {
        this.participants = {};
        this.status = AppointmentStatusEnum.Pending;
    }
}
exports.AppointmentState = AppointmentState;
//# sourceMappingURL=AppointmentState.js.map