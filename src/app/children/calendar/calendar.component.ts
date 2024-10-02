import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CalendarOptions } from '../models/options.model';
import { EventDetails, EventObject } from '../models/day.model';
export interface CalendarEvent {
  title: string;
  date: Date;
  description?: string;
}
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  @Input() options!: CalendarOptions;
  lastMonthDateNumber: number = 0;
  currentDate!: Date;
  currentView: string = 'dayGridMonth'; // Default view
  monthDays: any[] = [];
  events: CalendarEvent[] = []; // Array to store calendar
  today: string = new Date().toDateString();
  weekViewTimes: string[] = [
    '12am',
    '',
    '1am',
    '',
    '2am',
    '',
    '4am',
    '',
    '5am',
    '',
    '6am',
    '',
    '7am',
    '',
    '8am',
    '',
    '9am',
    '',
    '10am',
    '',
    '11am',
    '',
    '12pm',
    '',
    '1pm',
    '',
    '2pm',
    '',
    '3pm',
    '',
    '4pm',
    '',
    '5pm',
    '',
    '6pm',
    '',
    '7pm',
    '',
    '8pm',
    '',
    '9pm',
    '',
    '10pm',
    '',
    '11pm',
    '',
  ];

  ngOnInit() {
    this.currentDate = new Date(); // Initialize current date
    this.loadMonthView();
    this.currentView = this.options.initialView;
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes['options'].currentValue);

    this.monthDays.forEach((item) => {
      item.events = [];
    });
    this.loadDateEvents();
  }

  // Month view logic
  loadMonthView() {
    this.monthDays = this.generateConsecutiveMonthDays();
    this.loadDateEvents();
  }

  // Week view logic
  loadWeekView() {
    this.monthDays = this.generateWeekDays();
    this.loadDateEvents();
  }

  // Day view logic
  loadDayView() {
    this.monthDays = [
      {
        date: this.currentDate.toDateString(),
        // events: this.options.events,
        events: [],
        isCurrent: true,
      },
    ];
    this.loadDateEvents();
  }

  generateConsecutiveMonthDays() {
    const currentMonthDays = this.generateMonthDays(true);
    switch (currentMonthDays[0].date.slice(0, 3)) {
      case 'Sun':
        this.lastMonthDateNumber = 0;
        break;
      case 'Mon':
        this.lastMonthDateNumber = 1;
        break;
      case 'Tue':
        this.lastMonthDateNumber = 2;
        break;
      case 'Wed':
        this.lastMonthDateNumber = 3;
        break;
      case 'Thu':
        this.lastMonthDateNumber = 4;
        break;
      case 'Fri':
        this.lastMonthDateNumber = 5;
        break;
      case 'Sat':
        this.lastMonthDateNumber = 6;
        break;
      default:
        break;
    }
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);

    let lastMonthDays: any[] = [];
    if (this.lastMonthDateNumber !== 0) {
      lastMonthDays = this.generateMonthDays().slice(-this.lastMonthDateNumber);
    }
    const nextMonthDateNumber =
      42 - [...currentMonthDays, ...lastMonthDays].length;
    this.currentDate.setMonth(this.currentDate.getMonth() + 2);
    const nextMonthDays = this.generateMonthDays().slice(
      0,
      nextMonthDateNumber,
    );
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);

    return [...lastMonthDays, ...currentMonthDays, ...nextMonthDays];
  }
  generateMonthDays(isCurrent = false) {
    const startOfMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      1,
    );
    const endOfMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      0,
    );

    const days = [];
    let day = startOfMonth;

    while (day <= endOfMonth) {
      // Include 'events' array for each day (empty for now)
      days.push({
        date: day.toDateString(),
        // events: this.options.events,
        events: [],
        isCurrent: isCurrent,
      });
      day = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
    }
    return days;
  }

  // Generate days for the current week
  generateWeekDays() {
    const startOfWeek = this.getStartOfWeek(this.currentDate);
    const days = [];

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      days.push({
        date: currentDay.toDateString(),
        events: [],
        isCurrent: true,
      });
    }
    return days;
  }

  // Helper method to get the start of the week (Sunday)
  getStartOfWeek(date: Date) {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);
    return startOfWeek;
  }

  // Navigate to previous period (month, week, day)
  prev() {
    if (this.currentView === 'dayGridMonth') {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.loadMonthView();
    } else if (this.currentView === 'week') {
      this.currentDate.setDate(this.currentDate.getDate() - 7);
      this.loadWeekView();
    } else if (this.currentView === 'day') {
      this.currentDate.setDate(this.currentDate.getDate() - 1);
      this.loadDayView();
    }
  }

  // Navigate to next period (month, week, day)
  next() {
    if (this.currentView === 'dayGridMonth') {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.loadMonthView();
    } else if (this.currentView === 'week') {
      this.currentDate.setDate(this.currentDate.getDate() + 7);
      this.loadWeekView();
    } else if (this.currentView === 'day') {
      this.currentDate.setDate(this.currentDate.getDate() + 1);
      this.loadDayView();
    }
  }

  // Set view mode (month, week, day)
  setView(view: string) {
    this.currentView = view;
    if (view === 'dayGridMonth') {
      this.loadMonthView();
    } else if (view === 'week') {
      this.loadWeekView();
    } else if (view === 'day') {
      this.loadDayView();
    }
  }

  // Get events for a specific day
  getEventsForDay(day: Date) {
    return this.events.filter(
      (event) => event.date.toDateString() === day.toDateString(),
    );
  }

  onClickEvent(event: EventDetails) {
    if (event.originalEvent) {
      this.options.eventClick(event.originalEvent);
    } else {
      this.options.eventClick(event);
    }
  }

  onClickDate(day: EventObject) {
    const data = new Date(day.date);
    this.options.dateClick(data);
  }

  loadDateEvents() {
    const allEvents = this.processLongEvents(this.options.events).map(
      (event: EventDetails) => {
        return {
          ...event,
          date: new Date(event.start),
          height: event.start
            ? (
                this.getDifferenceInHours(
                  new Date(event.start),
                  new Date(event.end),
                ) * 40
              ).toString()
            : '40',
          start24: event.start ? this.getStart24(event.start) * 2 : 0,
        };
      },
    );
    allEvents.forEach((event: any) => {
      let foundIndex: number;
      foundIndex = this.monthDays.findIndex(
        (item) => item.date === event.date.toDateString(),
      );
      if (foundIndex !== -1) {
        this.monthDays[foundIndex].events.push(event);
      }
    });
  }

  getDifferenceInHours(date1: Date, date2: Date): number {
    const millisecondsDifference = date2.getTime() - date1.getTime();
    const hoursDifference = millisecondsDifference / (1000 * 60 * 60); // Convert to hours
    return hoursDifference;
  }

  getStart24(data: string): number {
    if (data.slice(11, 12) === '0') {
      return Number(data.slice(12, 13));
    } else {
      return Number(data.slice(11, 13));
    }
  }

  processLongEvents(data: any): EventDetails[] {
    let allDays: EventDetails[] = [];
    let nonAllDays: EventDetails[] = [];
    data.forEach((item: EventDetails) => {
      if (
        this.getDifferenceInHours(new Date(item.start), new Date(item.end)) > 24
      ) {
        this.splitEventByHour(item).forEach((event: EventDetails) => {
          event.isAllDay = true;
          allDays.push(event);
        });
      } else {
        nonAllDays.push(item);
      }
    });
    return this.setEventsTopMargin([
      ...allDays,
      ...nonAllDays.map((event: EventDetails) => {
        return {
          ...event,
          originalEvent: event,
          isStart: true,
          isAllDay: false,
        };
      }),
    ]);
  }

  splitEventByHour(event: {
    title: string;
    start: string;
    end: string;
  }): EventDetails[] {
    const eventsPerDay = [];

    // Convert start and end to Date objects
    let currentDate = new Date(event.start);
    const endDate = new Date(event.end);
    // Loop through each day until the end date (inclusive)
    while (
      currentDate <= endDate ||
      currentDate.toString().slice(0, 15) === endDate.toString().slice(0, 15)
    ) {
      let newEvent;

      if (eventsPerDay.length === 0) {
        // First day, keep the exact start time
        newEvent = {
          title: event.title,
          start: currentDate.toString(),
          end: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            23,
            59,
            59,
          ).toString(), // End of the day (23:59:59)
          originalEvent: event,
        };
      } else if (
        currentDate.toDateString().slice(0, 15) ===
        endDate.toDateString().slice(0, 15)
      ) {
        // Last day, keep the exact end time
        newEvent = {
          title: event.title,
          start: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
          ).toString(), // Start of the day (00:00)
          end: endDate.toString(), // Exact end time
          isEnd: true,
          originalEvent: event,
        };
      } else {
        // Full day event for intermediate days
        newEvent = {
          title: event.title,
          start: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
          ).toString(), // Start of the day (00:00)
          end: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            23,
            59,
            59,
          ).toString(), // End of the day (23:59:59)
          originalEvent: event,
        };
      }

      eventsPerDay.push(newEvent);

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return this.getFirstEventOfEachWeek(eventsPerDay);
  }

  getFirstEventOfEachWeek(events: any[]): EventDetails[] {
    const seenWeeks = new Set<number>();
    const firstEvents: any[] = [];
    let currentIndex: number = -1;
    const secondEvents: any[] = [];
    events.forEach((event) => {
      const eventStartDate = new Date(event.start);

      // Calculate the week number where the week starts on Sunday
      const firstDayOfYear = new Date(eventStartDate.getFullYear(), 0, 1);
      const pastDaysOfYear =
        (eventStartDate.getTime() - firstDayOfYear.getTime()) /
        (24 * 60 * 60 * 1000);

      const weekNumber = Math.floor(
        (pastDaysOfYear + firstDayOfYear.getDay()) / 7,
      );

      // If this week hasn't been encountered yet, add the event
      if (!seenWeeks.has(weekNumber)) {
        currentIndex = currentIndex + 1;
        firstEvents.push(event);
        let copiedObject = Object.assign({}, event);
        copiedObject.title = '';
        // secondEvents.push(copiedObject);
        firstEvents[currentIndex].width = 150;
        firstEvents[currentIndex].isStart = true;
        seenWeeks.add(weekNumber);
      } else {
        event.title = '';
        secondEvents.push(event);
        firstEvents[currentIndex].width = firstEvents[currentIndex].width + 150;
      }
    });
    return [...firstEvents, ...secondEvents];
  }

  setEventsTopMargin(data: EventDetails[]) {
    let result = data.map((event: EventDetails) => {
      return {
        ...event,
        label: new Date(event.start).getDate(),
        labelMonth: new Date(event.start).getMonth(),
        topMargin: 0,
      };
    });
    result.sort((a, b) => {
      // First, compare by labelMonth
      if (a.labelMonth !== b.labelMonth) {
        return a.labelMonth - b.labelMonth; // Ascending order
      }

      // If labelMonth is the same, compare by label
      if (a.label !== b.label) {
        return a.label - b.label; // Ascending order
      }

      // If both labelMonth and label are the same, compare by originalEvent.start
      const dateA = new Date(a.originalEvent.start).getTime();
      const dateB = new Date(b.originalEvent.start).getTime();
      return dateA - dateB; // Ascending order based on start date
    });

    for (let i = 0; i < result.length; i++) {
      // Inner loop runs through all the elements before the current element
      if (result[i].title === '') {
        for (let k = i - 1; k >= 0; k--) {
          if (
            result[k].originalEvent?.title === result[i].originalEvent?.title
          ) {
            result[i].topMargin = result[k].topMargin;
            break;
          }
        }
      }
      for (let j = i - 1; j >= 0; j--) {
        if (
          result[j].label === result[i].label &&
          result[j].labelMonth === result[i].labelMonth
        ) {
          if (result[i].topMargin === 0 && result[i].title !== '') {
            result[i].topMargin = result[j].topMargin + 22;
            break;
          }
        }
      }
    }
    console.log(result);
    return result;
  }
}
