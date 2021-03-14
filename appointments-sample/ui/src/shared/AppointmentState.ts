
// Appointment state
export class AppointmentState
{
    participants: string[] = [];
    participantsAccepted: string[] = [];
    status: AppointmentStatusEnum = AppointmentStatusEnum.Pending;
}

export enum AppointmentStatusEnum {
    Pending = 0,
    Accepted,
    Declined
}