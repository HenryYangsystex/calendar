import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CalendarComponent } from './children/calendar/calendar.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CalendarComponent,
    DialogModule,
    ButtonModule,
    CalendarModule,
    ReactiveFormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'calendar';
  formGroup!: FormGroup;
  visible: boolean = false;
  selectedEvent!: any;
  selectedDate!: any;
  events: any[] = [
    {
      title: 'Multi-day Event',
      start: '2024-09-20', // Start date of the event
      end: '2024-09-25', // End date of the event (exclusive, ends before midnight)
    },
    {
      title: 'Meeting with John',
      start: '2024-09-24',
      end: '2024-09-28',
    },
    {
      title: 'Lunch with Sarah',
      start: '2024-09-26T12:30:00',
      end: '2024-09-26T18:30:00',
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
  ];
  calendarOptions: any = {
    initialView: 'dayGridMonth',
    eventClick: (arg: any) => this.handleEventClick(arg),
    dateClick: (arg: any) => this.handleDateClick(arg),
    events: this.events,
  };

  ngOnInit() {
    this.formGroup = new FormGroup({
      title: new FormControl({ value: '', disabled: true }),
      start: new FormControl(''),
      end: new FormControl(''),
    });
  }

  onAddEvent() {
    console.log(this.formGroup.value.date.toDateString());
    this.visible = false;
  }

  showDialog() {
    this.formGroup.patchValue(this.selectedEvent);
    this.visible = true;
  }

  handleEventClick(arg: any) {
    console.log(arg);
    this.selectedEvent = arg;
    this.showDialog();
  }

  handleDateClick(arg: any) {
    let userInput = prompt('Please enter your input:');
    console.log(arg);
    this.selectedDate = arg;
    if (userInput !== null) {
      this.events.push({
        title: userInput,
        start: this.transferDateFormat(this.selectedDate),
      });
      this.calendarOptions = { ...this.calendarOptions, events: this.events };
    } else {
      alert('Input was canceled.');
    }
    // this.showDialog();
  }

  onDeleteEvent(): void {
    this.events = this.events.filter(
      (item: any) => item.title !== this.selectedEvent.title,
    );
    this.visible = false;
    this.calendarOptions = { ...this.calendarOptions, events: this.events };
    console.log(this.calendarOptions.events);
  }

  onEditEvent(): void {
    const index = this.events.findIndex(
      (item: any) => item.title === this.selectedEvent.title,
    );
    console.log('the index is');
    console.log(index);
    this.events[index].start = this.formGroup.value.start;
    this.events[index].end = this.formGroup.value.end;
    this.visible = false;
    this.calendarOptions = { ...this.calendarOptions, events: this.events };
  }

  transferDateFormat(date: any) {
    const data = new Date(date);
    const year = data.getFullYear();

    // Get the month (0-11, so add 1 for human-readable format)
    const month = data.getMonth() + 1;

    // Get the date (1-31)
    const day = data.getDate();
    console.log('testing');
    console.log(`${year}-${month}-${day}`);
    return `${year}-${month}-${day}`;
  }
}
