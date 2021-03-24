"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DurableFunctions = require("durable-functions");
const AppointmentEntity_1 = require("../DurableEntities/AppointmentEntity");
exports.default = DurableFunctions.entity((ctx) => new AppointmentEntity_1.AppointmentEntity(ctx).handleSignal());
//# sourceMappingURL=index.js.map