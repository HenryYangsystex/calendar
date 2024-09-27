import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CalendarComponent } from './children/calendar/calendar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CalendarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'calendar';
  calendarOptions: any = {
    initialView: 'dayGridMonth',
    // plugins: [dayGridPlugin, interactionPlugin],
    // dateClick: (arg) => this.handleDateClick(arg),
    events: [
      // { title: 'event 1', date: new Date('2024-09-25') },
      // { title: 'event 2', date: new Date('2024-09-26') },
      {
        title: 'Meeting with John',
        start: '2024-09-26T10:00:00', // Start time (in ISO format)
        end: '2024-09-26T15:00:00', // End time (optional)
      },
      {
        title: 'Lunch with Sarah',
        start: '2024-09-27T12:30:00',
        end: '2024-09-27T18:30:00',
      },
      {
        title: 'Multi-day Event',
        start: '2024-09-25', // Start date of the event
        end: '2024-09-28', // End date of the event (exclusive, ends before midnight)
      },
      {
        title: 'Another Long Event',
        start: '2024-10-01',
        end: '2024-10-05',
      },
      {
        title: 'Multi-day Event with Time',
        start: '2024-09-25T14:00:00', // Starts at 2:00 PM on September 25th
        end: '2024-09-28T10:30:00', // Ends at 10:30 AM on September 28th
      },
    ],
  };
}
