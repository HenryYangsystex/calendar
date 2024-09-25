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
    // initialView: 'dayGridMonth',
    // plugins: [dayGridPlugin, interactionPlugin],
    // dateClick: (arg) => this.handleDateClick(arg),
    events: [
      { title: 'event 1', date: new Date('2024-09-25') },
      { title: 'event 2', date: new Date('2024-09-26') },
    ],
  };
}
