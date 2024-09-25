import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
export interface CalendarEvent {
  title: string;
  date: Date;
  description?: string;
}
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    CalendarModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  @Input() options!: any;
  lastMonthDateNumber: number = 0;
  currentDate!: Date;
  currentView: string = 'month'; // Default view
  monthDays: any[] = [];
  weekDays: any[] = [];
  selectedDay!: Date;
  events: CalendarEvent[] = []; // Array to store calendar events
  newEvent: CalendarEvent = {
    title: 'testing',
    date: new Date(),
    description: 'testing',
  };
  formGroup!: FormGroup;
  visible: boolean = false;

  ngOnInit() {
    this.currentDate = new Date(); // Initialize current date
    this.loadMonthView();
    // this.addEvent();
    this.loadDateEvents();
    this.formGroup = new FormGroup({
      date: new FormControl(''),
      data: new FormControl(''),
    });
  }

  // Month view logic
  loadMonthView() {
    this.monthDays = this.generateConsecutiveMonthDays();
  }

  // Week view logic
  loadWeekView() {
    this.weekDays = this.generateWeekDays();
    this.loadDateEvents();
  }

  // Day view logic
  loadDayView() {
    this.selectedDay = this.currentDate;
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
    this.currentDate = new Date();
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    const nextMonthDays = this.generateMonthDays().slice(
      0,
      nextMonthDateNumber,
    );
    this.currentDate = new Date();
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
      days.push({ date: currentDay.toDateString() });
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
    if (this.currentView === 'month') {
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
    if (this.currentView === 'month') {
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
    if (view === 'month') {
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

  // Add a new event
  addEvent() {
    if (this.newEvent.title && this.newEvent.date) {
      this.events.push({ ...this.newEvent });
      this.loadMonthView(); // Reload the month view to include the new event
      this.newEvent = { title: '', date: new Date(), description: '' }; // Reset the form
    }
  }

  onClickEvent(event: any) {
    console.log(event);
  }

  onAddEvent() {
    console.log(this.formGroup.value.date.toDateString());
    const foundIndex = this.monthDays.findIndex(
      (item) => item.date === this.formGroup.value.date.toDateString(),
    );
    this.monthDays[foundIndex].events.push({
      title: 'testingadd',
      date: this.formGroup.value.date.toDateString(),
      description: 'testingadd',
    });

    this.visible = false;
  }

  showDialog() {
    this.visible = true;
  }

  loadDateEvents() {
    const allEvents = this.options.events.map((event: any) => {
      return {
        ...event,
        date: new Date(event.date),
      };
    });
    allEvents.forEach((event: any) => {
      const foundIndex = this.monthDays.findIndex(
        (item) => item.date === event.date.toDateString(),
      );
      this.monthDays[foundIndex].events.push(event);
    });
  }
}
