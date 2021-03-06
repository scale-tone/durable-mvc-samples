import React from 'react';
import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react';
import { AppBar, Button, Box, Chip, Grid, LinearProgress, List, ListItem, Paper, TextField, Toolbar, Typography } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';

import { DurableEntitySet } from './common/DurableEntitySet';
import { AppointmentState, AppointmentStatusEnum } from './shared/AppointmentState';

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
    userName: '',

    participantsText: '',

    inProgress: false,

    // Here all appointment entities will appear
    appointments: new DurableEntitySet<AppointmentState>('AppointmentEntity')
});

// Rendering that entity state
export const App = observer(
    class App extends React.Component {

        private createNewAppointment() {

            const participants = appState.participantsText
                .split(',')
                .map(p => p.trim())
                .filter(p => !!p);

            // Generating unique entity key
            const newAppointmentId = 'APP-' + new Date().toISOString();

            // Creating a new entity
            appState.inProgress = true;
            appState.appointments.callEntity(newAppointmentId, 'init', participants)
                .catch(err => alert(err.message))
                .finally(() => { appState.inProgress = false; });

            appState.participantsText = '';
        }

        render(): JSX.Element { return (<>

            <AppBar position="static" color="default" className="app-bar">
                <Toolbar>

                    <TextField
                        fullWidth
                        label="Comma-separated list of participants (or empty string to create appointment with yourself)"
                        placeholder="Alice, Bob, Charlie..."
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        size="small"
                        value={appState.participantsText}
                        disabled={appState.inProgress}
                        onChange={(evt) => appState.participantsText = evt.target.value as string}
                        onKeyPress={(evt) => {
                            if (evt.key === 'Enter') {
                                evt.preventDefault();
                                this.createNewAppointment();
                            }
                        }}
                    />

                    <Box width={20} />

                    <Button variant="contained" color="default" size="large" className="new-appointment-button"
                        disabled={appState.inProgress}
                        onClick={() => this.createNewAppointment()}
                    >
                        Create new appointment
                    </Button>

                    <Box width={40} />

                    <AccountCircle />
                    <Box width={5} />
                    <Typography>{appState.userName}</Typography>

                </Toolbar>
            </AppBar>

            {appState.inProgress ? (<LinearProgress />) : (<Box height={4} />)}

            <List>

                {appState.appointments.items.length === 0 && (
                    <Typography variant="h5" className="empty-list-placeholder" >
                        No appointments created yet
                    </Typography>
                )}

                {appState.appointments.items.map(appointment => (<ListItem><Paper className="appointment-paper">

                    <Grid container spacing={2}>

                        <Grid item xs={2}>
                            {appointment.status === AppointmentStatusEnum.Pending && (
                                <Chip label="Pending" color="default" variant="outlined" className="appointment-status-chip" />
                            )}
                            {appointment.status === AppointmentStatusEnum.Accepted && (
                                <Chip label="Everybody accepted" color="primary" variant="outlined" className="appointment-status-chip" />
                            )}
                            {appointment.status === AppointmentStatusEnum.Declined && (
                                <Chip label="Someone declined" color="secondary" variant="outlined" className="appointment-status-chip" />
                            )}
                        </Grid>

                        <Grid item xs={2}>
                            <Typography className="participants-text">Participants:</Typography>
                        </Grid>

                        <Grid item xs={5} className="appointment-grid-cell">
                            {Object.keys(appointment.participants).map(name => (
                                <Chip label={name}
                                    color={appointment.participants[name] === AppointmentStatusEnum.Accepted ? 'primary' :
                                        (appointment.participants[name] === AppointmentStatusEnum.Declined ? 'secondary' : 'default')}
                                    className="participant-chip"
                                />
                            ))}
                        </Grid>

                        <Grid item xs={1}>
                            <Button fullWidth variant="contained" color="primary"
                                disabled={appState.inProgress || appointment.status !== AppointmentStatusEnum.Pending}
                                onClick={() => {
                                    appState.inProgress = true;
                                    appState.appointments.callEntity(appointment.entityKey, 'respond', true)
                                        .catch(err => alert(err.message))
                                        .finally(() => { appState.inProgress = false; });
                                }}
                            >
                                Accept
                            </Button>
                        </Grid>
                        <Grid item xs={1}>
                            <Button fullWidth variant="contained" color="secondary"
                                disabled={appState.inProgress || appointment.status !== AppointmentStatusEnum.Pending}
                                onClick={() => {
                                    appState.inProgress = true;
                                    appState.appointments.callEntity(appointment.entityKey, 'respond', false)
                                        .catch(err => alert(err.message))
                                        .finally(() => { appState.inProgress = false; });
                                }}
                            >
                                Decline
                            </Button>
                        </Grid>
                        <Grid item xs={1}>
                            <Button fullWidth variant="contained" color="default"
                                disabled={appState.inProgress || appointment.status === AppointmentStatusEnum.Pending}
                                onClick={() => {
                                    appState.inProgress = true;
                                    appState.appointments.callEntity(appointment.entityKey, 'delete')
                                        .catch(err => alert(err.message))
                                        .finally(() => { appState.inProgress = false; });
                                }}
                            >
                                Delete
                            </Button>
                        </Grid>
                    </Grid>

                </Paper></ListItem>))}
            </List>
        </>);}
    }
);