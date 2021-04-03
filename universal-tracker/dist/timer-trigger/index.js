"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const DurableFunctions = require("durable-functions");
const timerTrigger = function (context) {
    return __awaiter(this, void 0, void 0, function* () {
        const durableClient = DurableFunctions.getClient(context);
        const entityNameString = `@trackerentity@`;
        const allStatuses = (yield durableClient.getStatusAll())
            .filter(s => { var _a; return ((_a = s.input) === null || _a === void 0 ? void 0 : _a.exists) === true && s.instanceId.startsWith(entityNameString); });
        // Just sending the 'track' signal to all existing entities
        for (const status of allStatuses) {
            const entityId = new DurableFunctions.EntityId('trackerentity', status.instanceId.substr(entityNameString.length));
            yield durableClient.signalEntity(entityId, 'track');
        }
    });
};
exports.default = timerTrigger;
//# sourceMappingURL=index.js.map