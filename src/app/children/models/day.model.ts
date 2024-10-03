export interface EventDetails {
  title: string;
  start: string;
  end: string;
  originalEvent: OriginalEvent;
  isAllDay: boolean;
  label: number;
  labelMonth: number;
  topMargin: number;
  date: Date;
  height: string;
  start24: number;
  width: number;
  isStart?: boolean;
}

export interface SimpleEvent {
  title: string;
  start: string;
  end: string;
  originalEvent: OriginalEvent;
}

export interface OriginalEvent {
  title: string;
  start: string;
  end: string;
}

export interface Day {
  date: string;
  events: EventDetails[];
  isCurrent: boolean;
}
