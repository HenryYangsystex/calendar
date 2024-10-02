export interface EventDetails {
  title: string;
  start: string;
  end: string;
  originalEvent: OriginalEvent;
  isAllDay: boolean;
  label: number;
  labelMonth: number;
  topMargin: number;
  date: string;
  height: string;
  start24: number;
  width?: number;
  isStart?: boolean;
}

export interface OriginalEvent {
  title: string;
  start: string;
  end: string;
}

export interface EventObject {
  date: string;
  events: EventDetails[];
  isCurrent: boolean;
}
