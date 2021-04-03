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
exports.TrackerEntity = void 0;
const axios_1 = require("axios");
const jp = require("jsonpath");
const rfc6902 = require("rfc6902");
const DurableEntity_1 = require("../Common/DurableEntity");
// Tracking logic implementation
class TrackerEntity extends DurableEntity_1.DurableEntity {
    // Initializes this tracker
    init(params) {
        // Need to initialize _all_ state properties, otherwise client will fail to mark them as observables
        this.state.points = [];
        this.state.name = params.name;
        this.state.url = params.url;
        this.state.query = params.query;
        this.state.error = '';
    }
    // Deletes this tracker
    delete() {
        this.destructOnExit();
    }
    // Resets the timeline
    reset() {
        this.state.error = '';
        this.state.points = [];
    }
    // Does the actual tracking
    track() {
        return __awaiter(this, void 0, void 0, function* () {
            // There's a chance that timer-trigger occasionaly recreates a deleted entity. 
            // In that case just killing ourselves and returning
            if (!this.state.url) {
                this.destructOnExit();
                return;
            }
            // Getting the current value and adding it to the list of points
            this.state.error = '';
            try {
                var value = (yield axios_1.default.get(this.state.url, { timeout: 3000 })).data;
                // Applying query, if any
                if (!!this.state.query) {
                    if (typeof value === 'object') {
                        // Treating query as jsonPath and applying it
                        value = jp.query(value, this.state.query);
                    }
                    else if (typeof value === 'string') {
                        // Expecting query to be a regex
                        const match = new RegExp(this.state.query).exec(value);
                        if (!!match && match.length > 1) {
                            value = match[1];
                        }
                        else {
                            throw new Error('regex produced no results');
                        }
                    }
                }
                // Turning a one-value array into value
                if (Array.isArray(value) && value.length === 1) {
                    value = value[0];
                }
                const now = new Date();
                const time = new Date(now.getTime() + now.getTimezoneOffset() * 60000).toISOString();
                if (!this.state.points.length) {
                    // adding as the first point
                    this.state.points.push({ time, value });
                }
                else {
                    // Checking if the value has changed since last time
                    const lastValue = this.state.points[this.state.points.length - 1].value;
                    const diff = rfc6902.createPatch(lastValue, value);
                    if (diff.length > 0) {
                        this.state.points.push({ time, value });
                    }
                }
            }
            catch (err) {
                this.state.error = err.message;
            }
        });
    }
}
exports.TrackerEntity = TrackerEntity;
//# sourceMappingURL=TrackerEntity.js.map