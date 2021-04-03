"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DurableFunctions = require("durable-functions");
const TrackerEntity_1 = require("../DurableEntities/TrackerEntity");
exports.default = DurableFunctions.entity((ctx) => new TrackerEntity_1.TrackerEntity(ctx).handleSignal());
//# sourceMappingURL=index.js.map