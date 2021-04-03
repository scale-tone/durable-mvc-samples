
// Tracker state
export class TrackerState
{
    name: string = '';
    url: string = '';
    query?: string;
    points: { time: string, value: any }[] = [];
    error: string = '';
}