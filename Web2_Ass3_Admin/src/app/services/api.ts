import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../models/event.model';
import { Category } from '../models/category.model';
import { ContactModel } from '../models/ContactModel.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // Backend API URL
  private apiUrl = 'http://localhost:3030/api';

  /**
   * ApiService constructor
   * @param http Inject the HttpClient instance of Angular to be used for sending HTTP requests
   */
  constructor(private http: HttpClient) { }


  /**
   * Obtain all the events(Client)
   * @returns Array of Event objects
   */
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/events`);
  }

  /**
   * Obtain event data for all states(Admin)
   * @returns 
   */
  getAllEvents(filters: any = {}): Observable<Event[]> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      if (value) {
        params = params.append(key, value);
      }
    });
    return this.http.get<Event[]>(`${this.apiUrl}/allEvents`, { params });
  }


  /**
   * Obtain all the varieties
   * @returns Return the array of category objects
   */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  /**
   * Obtain the information of the corresponding event based on the ID.
   * @param id Event ID
   * @returns event object
   */
  getEventById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/events/${id}`);
  }

  /**
   * Obtain a summary of the data from the database
   * @returns data summary object
   */
  getAnalyticsSummary(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/summary`);
  }

  /**
   * Create a new event
   * @param eventData Event object containing new event information
   * @returns The object that has been successfully created
   */
  createEvent(eventData: Partial<Event>): Observable<Event> {
    return this.http.post<Event>(`${this.apiUrl}/events`, eventData);
  }

  /**
   * Update an existing event
   * @param id The ID of the event that needs to be updated
   * @param eventData Updated activity data object
   * @returns 
   */
  updateEvent(id: number, eventData: Partial<Event>): Observable<any> {
    return this.http.put(`${this.apiUrl}/events/${id}`, eventData);
  }

  /**
   * Delete the specified event
   * @param id The ID of the event that needs to be deleted
   * @returns 
   */
  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/events/${id}`);
  }

  /**
   * Upload the image file to the server
   * @param formData The FormData object of the file to be uploaded
   * @returns The object representing the path of the uploaded successful file
   */
  uploadImage(formData: FormData): Observable<{ filePath: string }> {
    return this.http.post<{ filePath: string }>(`${this.apiUrl}/upload`, formData);
  }

  /**
   * Retrieve all contact messages
   * @returns An array containing all the contact messages
   */
  getContacts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/contacts`);
  }

  /**
   * Used for submitting the contact form
   * @param contactData An object that includes the user's name, email address and the content of the message.
   * @returns 
   */
  submitContactForm(contactData: ContactModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/contacts`, contactData);
  }

  /**
   * Retrieve all contact messages
   * @returns An 'Contact' array containing all the contact messages
   */
  getContactSubmissions(): Observable<ContactModel[]> {
    return this.http.get<ContactModel[]>(`${this.apiUrl}/contacts`);
  }

  /**
   * Delete the specified contact message
   * @param id The ID of the contact message that needs to be deleted
   * @returns 
   */
  deleteContact(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/contacts/${id}`);
  }
}
