import { Event } from './event.model';

export interface CalendarOptions {
  initialView: string;
  eventClick: (arg: any) => void;
  dateClick: (arg: any) => void;
  events: Event[];
}
