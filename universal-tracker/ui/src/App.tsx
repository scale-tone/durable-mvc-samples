import React from 'react';
import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react';
import { AppBar, Button, Box, Grid, LinearProgress, List, ListItem, Paper, TextField, Toolbar, Typography } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { XYPlot, XAxis, YAxis, HorizontalBarSeries, DiscreteColorLegend, LineSeries } from 'react-vis';
import * as atlas from 'azure-maps-control';

import { DurableEntitySet } from './common/DurableEntitySet';
import { TrackerState } from './shared/TrackerState';
import { ITrackerParams } from './shared/ITrackerParams';
import { MapControl } from './MapControl';

// This comes from server-side config settings and is being sent to us via proxy
declare const AzureMapSubscriptionKey: string;

// Setting up DurableEntitySet
DurableEntitySet.setup({
    logger: { log: (l, msg: string) => console.log(msg) },

    fakeUserNamePromise: new Promise<string | null>((resolve) => {

        // Trying to fetch current user name from server - this should work when deployed to Azure and EasyAuth properly configured
        fetch('/.auth/me').then(r => r.json()).then(result => {

            if (!result || !result.length) {
                throw new Error('EasyAuth seems to be not configured. Falling back to a fake user name');
            }

            appState.userName = result[0].user_id;

            // By returning null here we tell DurableEntitySet to proceed with using EasyAuth
            resolve(null);

        }).catch(() => {

            // Asking the user for some fake user name. Obviously, we should never do it like that in production.
            appState.userName = prompt('Enter your name:', 'Anonymous') as string;
            resolve(appState.userName);
        });
    })
});

// App state container
const appState = makeAutoObservable({

    // Here all tracker entities will appear
    entities: new DurableEntitySet<TrackerState>('TrackerEntity'),

    userName: '',
    nameText: '',
    urlText: '',
    jsonPathText: '',
    inProgress: false,

    mapDataSources: {} as { [key: string]: atlas.source.DataSource }
});

// Rendering that entity state
export const App = observer(
    class App extends React.Component {

        render(): JSX.Element {

            const startTimes = appState.entities.items
                .filter(i => !!i.points.length)
                .map(i => new Date(i.points[0].time).getTime());
            const minTime = Math.min(...startTimes);
            
            return (<>

                <AppBar position="static" color="default" className="app-bar">
                    <Toolbar>

                        <TextField
                            className="name-text"
                            label="Name"
                            placeholder="e.g. 'Temperature in Oslo'"
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                            size="small"
                            value={appState.nameText}
                            disabled={appState.inProgress}
                            onChange={(evt) => appState.nameText = evt.target.value as string}
                        />

                        <Box width={30} />

                        <TextField
                            fullWidth
                            label="URL to track"
                            placeholder="e.g. 'https://api.openweathermap.org/data/2.5/weather?q=Oslo&appid={api-key}'"
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                            size="small"
                            value={appState.urlText}
                            disabled={appState.inProgress}
                            onChange={(evt) => appState.urlText = evt.target.value as string}
                        />

                        <Box width={30} />

                        <TextField
                            className="json-query-text"
                            label="(optional) JSON Query or Regular Expression"
                            placeholder="e.g. '$.main.temp'"
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                            size="small"
                            value={appState.jsonPathText}
                            disabled={appState.inProgress}
                            onChange={(evt) => appState.jsonPathText = evt.target.value as string}
                        />

                        <Box width={30} />

                        <Button variant="contained" color="default" size="large" className="new-entity-button"
                            disabled={!appState.nameText || !appState.urlText || appState.inProgress}
                            onClick={() => this.createNewEntity()}
                        >
                            Track
                        </Button>

                        <Box width={40} />

                        <AccountCircle />
                        <Box width={5} />
                        <Typography>{appState.userName}</Typography>

                    </Toolbar>
                </AppBar>

                {appState.inProgress ? (<LinearProgress />) : (<Box height={4} />)}

                <List>

                    {appState.entities.items.length === 0 && (
                        <Typography variant="h5" className="empty-list-placeholder" >
                            Nothing is tracked yet
                        </Typography>
                    )}

                    {appState.entities.items.map(entity => {

                        return (<ListItem key={entity.entityKey}><Paper className="entity-paper">

                            <Grid container spacing={2}>

                                <Grid item xs={2}>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12}><Typography variant="h6">{entity.name}</Typography></Grid>

                                        {!!entity.error ? (<>
                                            <Grid item xs={12}><Typography color="secondary" variant="caption">Error: {entity.error}</Typography></Grid>
                                        </>) : (<>
                                        </>)}

                                        <Grid item xs={6}>
                                            <Button className="item-btn" variant="contained" color="default" size="small" disabled={appState.inProgress}
                                                onClick={() => {
                                                    appState.inProgress = true;
                                                    appState.entities.callEntity(entity.entityKey, 'reset')
                                                        .catch(err => alert(err.message))
                                                        .finally(() => { appState.inProgress = false; });
                                                }}
                                            >
                                                Reset
                                        </Button>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button className="item-btn" variant="contained" color="default" size="small" disabled={appState.inProgress}
                                                onClick={() => {
                                                    appState.inProgress = true;
                                                    appState.entities.callEntity(entity.entityKey, 'delete')
                                                        .catch(err => alert(err.message))
                                                        .finally(() => { appState.inProgress = false; });
                                                }}
                                            >
                                                Delete
                                        </Button>
                                        </Grid>
                                    </Grid>
                                
                                </Grid>

                                <Grid item xs={10}>

                                    {this.renderGraph(entity.entityKey, entity, minTime)}

                                </Grid>
                            </Grid>

                        </Paper></ListItem>); })
                    }
                </List>
            </>);
        }

        private createNewEntity() {

            // Deriving entityId from url + jsonPath
            const entityId = (appState.nameText + '-' + appState.urlText + '-' + appState.jsonPathText)
                .replaceAll('"', '-')
                .replaceAll('\'', '-')
                .replaceAll('/', '-')
                .replaceAll('\\', '-')
                .replaceAll('#', '-')
                .replaceAll('?', '-');

            const params: ITrackerParams = {
                name: appState.nameText,
                url: appState.urlText,
                query: appState.jsonPathText
            }

            // Creating a new entity by calling its 'init' method 
            appState.inProgress = true;
            appState.entities.callEntity(entityId, 'init', params)
                .catch(err => alert(err.message))
                .finally(() => { appState.inProgress = false; });

            appState.nameText = '';
            appState.urlText = '';
            appState.jsonPathText = '';
        }

        private renderGraph(entityKey: string, entity: TrackerState, minTime: number): JSX.Element {

            const firstValue = !!entity.points.length ? entity.points[0].value : undefined;

            // If values look like numbers, rendering as a line graph
            if (!isNaN(firstValue)) {
                return this.renderLineGraph(entity, minTime);
            }

            // If it is an array of two numbers, then treating them as coordinates and rendering on a map
            if (!!AzureMapSubscriptionKey && Array.isArray(firstValue) && (firstValue.length === 2) && (!isNaN(firstValue[0])) && (!isNaN(firstValue[1]))) {
                return this.renderMap(entityKey, entity);
            }

            // Rendering as horizontal bars
            return this.renderHorizontalBars(entity, minTime);
        }

        private renderLineGraph(entity: TrackerState, minTime: number): JSX.Element {

            const data = entity.points.map(p => { return { x: new Date(p.time).getTime(), y: Number(p.value) } });

            const now = new Date();
            const utcNow = now.getTime() + now.getTimezoneOffset() * 60000;

            // Adding last point to the end, to make the graph look continuous
            if (entity.points.length > 0) {
                data.push({ x: utcNow, y: Number(entity.points[entity.points.length - 1].value) });
            }

            return (<XYPlot width={window.innerWidth - 300} height={200} stackBy="y" xType="time" xDomain={[minTime, utcNow]} margin={{ left: 80 }}>

                <XAxis tickTotal={7} />
                <YAxis />
                <LineSeries data={data} color={this.stringToColorCode(entity.name)} />

            </XYPlot>);
        }

        private renderHorizontalBars(entity: TrackerState, minTime: number): JSX.Element {

            const firstTime = !!entity.points.length ? new Date(entity.points[0].time).getTime() : minTime;

            const now = new Date();
            const utcNow = now.getTime() + now.getTimezoneOffset() * 60000;

            const points = entity.points.map((p, i) => {
                const curTime = new Date(p.time).getTime();
                const nextTime = (i < (entity.points.length - 1)) ? new Date(entity.points[i + 1].time).getTime() : utcNow;

                return { stringValue: this.valueToString(p.value), timeDiff: nextTime - curTime };
            });

            return (<>
                <XYPlot width={window.innerWidth - 300} height={100} stackBy="x" xType="time" xDomain={[minTime, utcNow]} margin={{ left: 80, top: 30 }}>

                    <XAxis tickTotal={7} />

                    <HorizontalBarSeries opacity={0} barWidth={1} data={[{ y: 0, x: firstTime }]} />

                    {points.map(p => {
                        return (<HorizontalBarSeries key={p.stringValue} color={this.stringToColorCode(p.stringValue)}
                            barWidth={1} data={[{ y: 0, x: p.timeDiff }]}
                        />);
                    })}

                </XYPlot>

                <DiscreteColorLegend className="histogram-legend"
                    items={points.map(p => {
                        return {
                            title: p.stringValue.substr(0, 100),
                            color: this.stringToColorCode(p.stringValue)
                        };
                    })}
                    orientation="horizontal"
                />

            </>);
        }

        private renderMap(entityKey: string, entity: TrackerState): JSX.Element {

            const points = entity.points.map(p => p.value);

            if (!appState.mapDataSources[entityKey]) {
                appState.mapDataSources[entityKey] = new atlas.source.DataSource();
            }

            appState.mapDataSources[entityKey].clear();
            appState.mapDataSources[entityKey].add(new atlas.data.Feature(new atlas.data.LineString(points)));

            const bounds = atlas.data.BoundingBox.fromPositions(points);

            return (<MapControl entityKey={entityKey} dataSource={appState.mapDataSources[entityKey]} bounds={bounds} azureMapSubscriptionKey={AzureMapSubscriptionKey} />);
        }

        private valueToString(val: any): string {

            if (typeof val === 'string') {
                return val;
            }

            if (!val) {
                return 'null';
            }

            return JSON.stringify(val);
        }

        private stringToColorCode(str: string): string {

            // Taking hash out of input string (reversed, to make names like 'func1', 'func2' etc. look different)
            var hashCode = 0;
            for (var i = str.length - 1; i >= 0; i--) {
                hashCode = ((hashCode << 5) - hashCode) + str.charCodeAt(i);
                // Convert to positive 32-bit integer
                hashCode &= 0x7FFFFFFF;
            }

            // min 6 hex digits
            hashCode |= 0x100000;

            // Not too white
            hashCode &= 0xFFFFEF;

            return '#' + hashCode.toString(16);
        }
    }
);