
export enum AppointmentStatusEnum {
    Pending = 0,
    Accepted,
    Declined
}

// Appointment state
export class AppointmentState
{
    participants: { [name: string]: AppointmentStatusEnum } = {};
    status: AppointmentStatusEnum = AppointmentStatusEnum.Pending;
}