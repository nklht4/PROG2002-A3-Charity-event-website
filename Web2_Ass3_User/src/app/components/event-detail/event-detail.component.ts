import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Event, EventService, EventApiResponse } from '../../services/event.service';

export interface RegistrationRecord {
  RegistrationId: number;
  EventId: number;
  UserName: string;
  ContactEmail: string;
  NumberOfTickets: number;
  RegistrationDate: string;
}

@Component({
  selector: 'app-event-detail',
  standalone: false,
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  event: Event | null = null;
  registrations: RegistrationRecord[] = [];
  loading = false;
  error = false;
  showRegistrationModal = false;

  registration = {
    userName: '',
    contactEmail: '',
    numberOfTickets: 1
  };

  /**
   * @param eventService - Service for event data operations
   * @param route - Service for accessing route parameters
   * @param router - Service for navigation
   */
  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const eventId = params['id'];
      if (eventId) {
        this.loadEventWithRegistrations(+eventId);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  /**
   * @param id - Event ID to load details and registrations for
   * @returns {void}
   */
  loadEventWithRegistrations(id: number) {
    this.loading = true;
    this.error = false;

    this.eventService.getEventWithRegistrations(id).subscribe({
      next: (response: EventApiResponse) => {
        console.log('✅ Successfully retrieved event data and registration records:', response);

        const event = response.eventDetails;
        this.event = {
          ...event,
          EventImage: this.resolveImageUrl(event.EventImage),
          CurrentAttendees: event.CurrentAttendees || 0,
          GoalAttendees: event.GoalAttendees || 100,
          TicketPrice: event.TicketPrice || 0,
          Location: event.Location || 'Location not specified',
          Description: event.Description || 'No description available',
          EventDate: event.EventDate || new Date().toISOString()
        };

        this.registrations = response.registrations || [];
        this.loading = false;
        document.title = `${event.EventName} - Hope Charity`;

        console.group('🔍 EventDetail Debug - ' + this.event.EventName);
        console.log('Complete event object:', this.event);
        console.log('Number of registration records:', this.registrations.length);
        console.log('Event date:', this.event.EventDate);
        console.log('Formatted date:', this.formatDate(this.event.EventDate));
        console.log('Attendees:', this.event.CurrentAttendees, '/', this.event.GoalAttendees);
        console.log('Ticket price:', this.event.TicketPrice);
        console.log('Location:', this.event.Location);
        console.groupEnd();
      },
      error: (error) => {
        console.error('❌ Failed to load event details:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  /**
   * @param originalUrl - Original image URL from API
   * @param eventId - Event ID for fallback image
   * @returns {string} Corrected image URL path
   */
  getFixedImageUrl(originalUrl: string, eventId: number): string {
    console.log('🔧 getFixedImageUrl input:', originalUrl, 'Event ID:', eventId);

    if (originalUrl && originalUrl.includes('../img/event_img/')) {
      const fileName = originalUrl.replace('../img/event_img/', '');
      const fixedUrl = `assets/img/event_img/${fileName}`;
      console.log('🔄 Converted database path:', originalUrl, '→', fixedUrl);
      return fixedUrl;
    }

    if (!originalUrl || originalUrl.trim() === '' || originalUrl === 'null' || originalUrl === 'undefined') {
      console.log('📝 Using event ID to select image:', eventId);

      let imageNumber = eventId;
      if (imageNumber < 1) imageNumber = 1;
      if (imageNumber > 15) imageNumber = 15;

      const fixedUrl = `assets/img/event_img/${imageNumber}.jpg`;
      console.log('✅ Generated image path:', fixedUrl);
      return fixedUrl;
    }

    if (originalUrl.startsWith('assets/img/event_img/')) {
      console.log('✅ Already correct path:', originalUrl);
      return originalUrl;
    }

    if (!originalUrl.includes('/') && originalUrl.includes('.jpg')) {
      const fixedUrl = `assets/img/event_img/${originalUrl}`;
      console.log('📁 Added full path:', originalUrl, '→', fixedUrl);
      return fixedUrl;
    }

    console.log('⚠️ Unknown path format, using event ID image');
    let imageNumber = eventId;
    if (imageNumber < 1) imageNumber = 1;
    if (imageNumber > 15) imageNumber = 15;
    const fixedUrl = `assets/img/event_img/${imageNumber}.jpg`;
    console.log('✅ Final generated image path:', fixedUrl);
    return fixedUrl;
  }

  /**
   * @param event - Image error event object
   * @returns {void}
   */
  handleImageError(event: any) {
    const imgElement = event.target as HTMLImageElement;

    console.group('❌ EventDetail Image Load Error');
    console.error('Failed URL:', imgElement.src);
    console.error('Original API URL:', this.event?.EventImage);
    console.error('Event ID:', this.event?.EventID);
    console.groupEnd();

    if (this.event) {
      let imageNumber = this.event.EventID;
      if (imageNumber < 1) imageNumber = 1;
      if (imageNumber > 15) imageNumber = 15;
      imgElement.src = `assets/img/event_img/${imageNumber}.jpg`;
      console.log('🔄 Switched to fallback image:', imgElement.src);
    } else {
      imgElement.src = 'assets/img/default.jpg';
      console.log('🔄 Switched to default image');
    }

    imgElement.onerror = null;
  }

  /**
   * @param dateString - The date string to format
   * @returns {string} Formatted date string or error message
   */
  formatDate(dateString: string): string {
    if (!dateString) return 'Date not specified';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }

      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Date format error';
    }
  }

  /**
   * @param currentAttendees - Current number of attendees
   * @param goalAttendees - Target number of attendees
   * @returns {number} Progress percentage (0-100)
   */
  calculateProgress(currentAttendees: number, goalAttendees: number): number {
    if (!goalAttendees || goalAttendees <= 0) return 0;
    const percentage = (currentAttendees / goalAttendees) * 100;
    return Math.min(100, Math.round(percentage * 100) / 100);
  }

  /**
   * @param ticketPrice - Ticket price value
   * @returns {string} Formatted ticket price display
   */
  getTicketPrice(ticketPrice: number): string {
    const price = parseFloat(ticketPrice?.toString() || '0');
    return price === 0 ? 'Free' : `$${price.toFixed(2)}`;
  }

  /**
   * @returns {void}
   */
  openRegistration() {
    this.showRegistrationModal = true;
  }

  /**
   * @returns {void}
   */
  closeRegistration() {
    this.showRegistrationModal = false;
    this.registration = { userName: '', contactEmail: '', numberOfTickets: 1 };
  }

  /**
   * @returns {void}
   */
  submitRegistration() {
    if (!this.registration.userName || !this.registration.contactEmail) {
      alert('Please fill in all required fields.');
      return;
    }

    console.log('Registration data:', {
      eventId: this.event?.EventID,
      ...this.registration
    });

    alert(`Thank you ${this.registration.userName}! You have registered for ${this.registration.numberOfTickets} ticket(s) for ${this.event?.EventName}. A confirmation email will be sent to ${this.registration.contactEmail}`);

    this.closeRegistration();
  }

  /**
   * @param imagePath - Image path from database or assets
   * @returns {string} Complete URL for image display
   */
  resolveImageUrl(imagePath: string | undefined): string {
    const backendUrl = 'http://localhost:3030';

    if (!imagePath) {
      return '';
    }
    if (imagePath.startsWith('assets/')) {
      return imagePath;
    } else {
      return backendUrl + imagePath;
    }
  }
}