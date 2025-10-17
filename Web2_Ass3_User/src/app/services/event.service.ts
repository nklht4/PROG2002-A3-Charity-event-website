import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistrationRecord } from '../components/event-detail/event-detail.component';
import { tap, map } from 'rxjs/operators';

export interface Event {
  EventID: number;
  EventName: string;
  EventImage: string;
  EventDate: string;
  Location: string;
  Description: string;
  TicketPrice: number;
  CurrentAttendees: number;
  GoalAttendees: number;
  CategoryName: string;
}

export interface Category {
  CategoryID: number;
  CategoryName: string;
}

export interface Registration {
  EventID: number;
  UserName: string;
  ContactEmail: string;
  NumberOfTickets: number;
  RegistrationDate?: string;
}

export interface Contact {
  ContactID?: number;
  UserName: string;
  ContactEmail: string;
  FeedBack: string;
  SubmissionDate?: string;
}

export interface EventApiResponse {
  eventDetails: Event;
  registrations: RegistrationRecord[];
}

export interface DatabaseRegistration {
  EventID: number;
  UserID: number;
  RegistrationDate: string;
  Username: string;
  Email: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:3030/api';

  /**
   * @param http - HttpClient for making HTTP requests
   */
  constructor(private http: HttpClient) { }

  /**
   * @param params - Optional query parameters for filtering events
   * @returns {Observable<Event[]>} Observable of events array
   */
  getEvents(params?: any): Observable<Event[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key]) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<Event[]>(`${this.apiUrl}/events`, { params: httpParams });
  }

  /**
   * @param id - Event ID to retrieve
   * @returns {Observable<Event>} Observable of single event details
   */
  getEventById(id: number): Observable<Event> {
    return this.http.get<EventApiResponse>(`${this.apiUrl}/events/${id}`).pipe(
      map(response => response.eventDetails),
      tap(event => {
        console.log('=== Complete event data returned from API ===');
        console.log('Event object:', event);
        console.log('All fields:');
        Object.keys(event).forEach(key => {
          console.log(`${key}:`, event[key as keyof Event]);
        });
        console.log('========================');
      })
    );
  }

  /**
   * @returns {Observable<Category[]>} Observable of categories array
   */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  /**
   * @param registrationData - Registration information
   * @returns {Observable<any>} Observable of registration response
   */
  registerForEvent(registrationData: Registration): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrations`, registrationData).pipe(
      tap(response => {
        console.log('✅ Registration successful, attendee count updated:', response);
      })
    );
  }

  /**
   * @param eventId - Event ID to get registrations for
   * @returns {Observable<RegistrationRecord[]>} Observable of registration records array
   */
  getEventRegistrations(eventId: number): Observable<RegistrationRecord[]> {
    return this.http.get<DatabaseRegistration[]>(`${this.apiUrl}/events/${eventId}/registrations`).pipe(
      map(dbRegistrations => this.transformDatabaseRegistrations(dbRegistrations))
    );
  }

  /**
   * @param dbRegistrations - Database registration records
   * @returns {RegistrationRecord[]} Transformed registration records
   */
  private transformDatabaseRegistrations(dbRegistrations: DatabaseRegistration[]): RegistrationRecord[] {
    return dbRegistrations.map(reg => ({
      RegistrationId: reg.UserID,
      EventId: reg.EventID,
      UserName: reg.Username || 'Anonymous User',
      ContactEmail: reg.Email || 'No email provided',
      NumberOfTickets: 1,
      RegistrationDate: reg.RegistrationDate
    }));
  }

  /**
   * @param id - Event ID to get complete details for
   * @returns {Observable<EventApiResponse>} Observable of event with registrations
   */
  getEventWithRegistrations(id: number): Observable<EventApiResponse> {
    return this.http.get<EventApiResponse>(`${this.apiUrl}/events/${id}`);
  }

  /**
   * @param contactData - Contact form data
   * @returns {Observable<any>} Observable of contact submission response
   */
  submitContactForm(contactData: Contact): Observable<any> {
    return this.http.post(`${this.apiUrl}/contacts`, contactData);
  }

  /**
   * @returns {Observable<Contact[]>} Observable of contact submissions array
   */
  getContactSubmissions(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/contacts`);
  }
}