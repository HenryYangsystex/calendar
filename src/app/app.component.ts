import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CalendarComponent } from './children/calendar/calendar.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Event } from './children/models/event.model';
import { CalendarOptions } from './children/models/options.model';
import { Day, EventDetails } from './children/models/day.model';

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
  selectedEvent!: EventDetails;
  selectedDate!: any;
  events: Event[] = [
    {
      title: 'Multi-day Event',
      start: '2024-10-20', // Start date of the event
      end: '2024-10-25', // End date of the event (exclusive, ends before midnight)
    },
    {
      title: 'Meeting with John',
      start: '2024-10-23',
      end: '2024-10-27',
    },
    {
      title: 'Lunch with Sarah',
      start: '2024-10-26T12:30:00',
      end: '2024-10-26T18:30:00',
    },
    {
      title: 'Lunch with Henry',
      start: '2024-10-16T12:30:00',
      end: '2024-10-16T18:30:00',
    },
    {
      title: 'Another Long Event',
      start: '2024-10-01',
      end: '2024-10-05',
    },
    {
      title: 'Multi-day Event with Time',
      start: '2024-10-25T14:00:00', // Starts at 2:00 PM on September 25th
      end: '2024-10-28T10:30:00', // Ends at 10:30 AM on September 28th
    },
  ];

  // calendar設定
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    eventClick: (arg: EventDetails) => this.handleEventClick(arg),
    dateClick: (arg: Day) => this.handleDateClick(arg),
    events: this.events,
  };

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      title: new FormControl({ value: '', disabled: true }),
      start: new FormControl(''),
      end: new FormControl(''),
    });
  }

  // 跳出dialog
  showDialog(): void {
    this.formGroup.reset();
    this.formGroup.patchValue(this.selectedEvent);
    this.visible = true;
  }

  // 點擊行程
  handleEventClick(arg: EventDetails): void {
    console.log(arg);
    this.selectedEvent = arg;
    this.showDialog();
  }

  // 點擊日期
  handleDateClick(arg: Day): void {
    let userInput = prompt('Please enter your title:');
    console.log(arg);
    this.selectedDate = arg;
    if (userInput !== null) {
      this.events.push({
        title: userInput,
        start: this.transferDateFormat(this.selectedDate),
        end: '',
      });
      this.calendarOptions = { ...this.calendarOptions, events: this.events };
    } else {
      alert('Input was canceled.');
    }
  }

  // 刪除行程
  onDeleteEvent(): void {
    this.events = this.events.filter(
      (item: Event) => item.title !== this.selectedEvent.title,
    );
    this.visible = false;
    this.calendarOptions = { ...this.calendarOptions, events: this.events };
  }

  // 編輯行程
  onEditEvent(): void {
    const index = this.events.findIndex(
      (item: Event) => item.title === this.selectedEvent.title,
    );
    this.events[index].start = this.formGroup.value.start;
    this.events[index].end = this.formGroup.value.end;
    this.visible = false;
    this.calendarOptions = { ...this.calendarOptions, events: this.events };
  }

  // 轉換日期格式
  transferDateFormat(date: string): string {
    const data = new Date(date);
    const year = data.getFullYear();

    // Get the month (0-11, so add 1 for human-readable format)
    const month = data.getMonth() + 1;

    // Get the date (1-31)
    const day = data.getDate();
    return `${year}-${month}-${day}`;
  }
}
