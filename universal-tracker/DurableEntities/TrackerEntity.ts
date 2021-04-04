import axios from 'axios';
import * as jp from 'jsonpath';
import * as rfc6902 from 'rfc6902';

import { DurableEntity } from '../Common/DurableEntity';
import { TrackerState } from '../ui/src/shared/TrackerState';
import { ITrackerParams } from '../ui/src/shared/ITrackerParams';

// Signal handler execution should _always_ last less, than timer-trigger's period (otherwise the entity might go unresponsive).
// So need to set this timeout for the HTTP GET.
const HttpTimeoutInMs = 3000;

// Sadly need to limit the entity's state size to this
const StateSizeLimitInSymbols = 9000;

// Tracking logic implementation
export class TrackerEntity extends DurableEntity<TrackerState>
{
    // Initializes this tracker
    init(params: ITrackerParams) {
     
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
    async track() {

        // There's a chance that timer-trigger occasionaly recreates a deleted entity. 
        // In that case just killing ourselves and returning
        if (!this.state.url) {
            this.destructOnExit();
            return;
        }

        // Getting the current value and adding it to the list of points
        this.state.error = '';
        try {

            var value = (await axios.get(this.state.url, { timeout: HttpTimeoutInMs })).data;

            // Applying query, if any
            if (!!this.state.query) {
            
                if (typeof value === 'object') {

                    // Treating query as jsonPath and applying it
                    value = jp.query(value, this.state.query);

                } else if (typeof value === 'string') {

                    // Expecting query to be a regex
                    const match = new RegExp(this.state.query).exec(value);
                    if (!!match && match.length > 1) {
                        value = match[1];
                    } else {
                        throw new Error('regex produced no results');
                    }
                }                
            }
            
            // Turning a one-value array into value
            if (Array.isArray(value) && value.length === 1) {
                value = value[0];
            }

            const time = new Date().toISOString();

            if (!this.state.points.length) {

                // adding as the first point
                this.state.points.push({ time, value });
                
            } else {

                // Checking if the value has changed since last time
                const lastValue = this.state.points[this.state.points.length - 1].value;
                const diff = rfc6902.createPatch(lastValue, value);

                if (diff.length > 0) {
                    this.state.points.push({ time, value });
                }
            }

            // Dropping old points, if needed
            while (!!this.state.points.length && JSON.stringify(this.state).length > StateSizeLimitInSymbols) {
                this.state.points.splice(0, 1);
            }
            
        } catch (err) {
            this.state.error = err.message;
        }
    }
}