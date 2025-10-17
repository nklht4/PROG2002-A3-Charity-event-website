import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Event, EventService, Registration } from '../../services/event.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registration',
  standalone: false,
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  event: Event | null = null;
  loading = false;
  eventLoading = false;
  error = '';

  private validationPatterns = {
    userName: /^[A-Za-z\s]{2,50}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\+]?[0-9\s\-\(\)]{10,15}$/,
    tickets: /^[1-9][0-9]?$|^10$/
  };

  registrationData = {
    userName: '',
    contactEmail: '',
    numberOfTickets: 1,
    phone: '',
    notes: ''
  };

  fieldErrors = {
    userName: '',
    contactEmail: '',
    numberOfTickets: '',
    phone: ''
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

  /**
   * @returns {void}
   */
  ngOnInit() {
    this.loadEventFromURL();
  }

  /**
   * @returns {void}
   */
  loadEventFromURL() {
    this.eventLoading = true;
    const eventId = this.route.snapshot.params['id'];

    if (!eventId) {
      this.error = 'No event specified. Please select an event first.';
      this.eventLoading = false;
      return;
    }

    this.eventService.getEventById(+eventId).subscribe({
      next: (event) => {
        this.event = {
          ...event,
          EventImage: this.resolveImageUrl(event.EventImage)
        };
        this.eventLoading = false;
      },
      error: (error: any) => {
        console.error('Failed to load event:', error);
        this.error = 'Event not found. Please check the event ID.';
        this.eventLoading = false;
      }
    });
  }

  /**
   * @param originalUrl - Original image URL from API/database
   * @param eventId - Event ID for fallback image selection
   * @returns {string} Corrected image URL path
   */
  getFixedImageUrl(originalUrl: string, eventId: number): string {
    console.log('🔧 Registration getFixedImageUrl input:', originalUrl, 'Event ID:', eventId);

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

    console.group('❌ Registration Image Load Error');
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
      imgElement.src = 'assets/img/default-event.jpg';
      console.log('🔄 Switched to default image');
    }

    imgElement.onerror = null;
  }

  /**
   * @param fieldName - Name of the field to validate
   * @param value - Current value of the field
   * @returns {string} Error message if validation fails, empty string if valid
   */
  validateField(fieldName: string, value: string): string {
    switch (fieldName) {
      case 'userName':
        if (!value.trim()) {
          return 'Full name is required.';
        }
        if (!this.validationPatterns.userName.test(value)) {
          return 'Please enter a valid full name (2-50 letters and spaces only).';
        }
        break;

      case 'contactEmail':
        if (!value.trim()) {
          return 'Email address is required.';
        }
        if (!this.validationPatterns.email.test(value)) {
          return 'Please enter a valid email address (e.g., user@example.com).';
        }
        break;

      case 'numberOfTickets':
        const ticketsNum = parseInt(value);
        if (isNaN(ticketsNum) || ticketsNum < 1) {
          return 'Please enter a valid number of tickets.';
        }
        if (!this.validationPatterns.tickets.test(value)) {
          return 'Number of tickets must be between 1 and 10.';
        }
        break;

      case 'phone':
        if (value.trim() && !this.validationPatterns.phone.test(value)) {
          return 'Please enter a valid phone number (10-15 digits, may include +, -, spaces, parentheses).';
        }
        break;
    }
    return '';
  }

  /**
   * @param fieldName - Name of the field that changed
   * @param value - New value of the field
   * @returns {void}
   */
  onFieldChange(fieldName: keyof typeof this.fieldErrors, value: string) {
    this.fieldErrors[fieldName] = this.validateField(fieldName, value);
    this.clearGeneralError();
  }

  /**
   * @returns {void}
   */
  clearGeneralError() {
    this.error = '';
  }

  /**
   * @returns {boolean} True if form is valid, false otherwise
   */
  validateForm(): boolean {
    let isValid = true;

    const fieldsToValidate: (keyof typeof this.fieldErrors)[] = ['userName', 'contactEmail', 'numberOfTickets'];
    fieldsToValidate.forEach(field => {
      const value = field === 'numberOfTickets'
        ? this.registrationData[field].toString()
        : this.registrationData[field as keyof typeof this.registrationData] as string;

      const error = this.validateField(field, value);
      this.fieldErrors[field] = error;
      if (error) {
        isValid = false;
      }
    });

    if (this.registrationData.phone.trim()) {
      const phoneError = this.validateField('phone', this.registrationData.phone);
      this.fieldErrors.phone = phoneError;
      if (phoneError) {
        isValid = false;
      }
    }

    if (!isValid) {
      this.error = 'Please correct the errors in the form before submitting.';
      return false;
    }

    return true;
  }

  /**
   * @returns {boolean} True if any field has errors, false otherwise
   */
  hasFormErrors(): boolean {
    return Object.values(this.fieldErrors).some(error => error !== '');
  }

  /**
   * @returns {void}
   */
  onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    if (!this.event) {
      this.error = 'Event information is missing.';
      return;
    }

    const projectedTotal = this.event.CurrentAttendees + this.registrationData.numberOfTickets;
    if (projectedTotal > this.event.GoalAttendees) {
      const remainingSpots = this.event.GoalAttendees - this.event.CurrentAttendees;
      this.error = `Cannot register ${this.registrationData.numberOfTickets} tickets. Only ${remainingSpots} spots remaining.`;
      return;
    }

    this.loading = true;

    const registration: Registration = {
      EventID: this.event.EventID,
      UserName: this.registrationData.userName.trim(),
      ContactEmail: this.registrationData.contactEmail.trim(),
      NumberOfTickets: this.registrationData.numberOfTickets,
    };

    this.eventService.registerForEvent(registration).subscribe({
      next: (response: any) => {
        this.loading = false;

        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          html: `
          Thank you, <strong>${this.registrationData.userName}</strong>, for registering for "<strong>${this.event?.EventName}</strong>".<br><br>
          📧 A confirmation email has been sent to ${this.registrationData.contactEmail}.<br>
          🎫 Tickets: ${this.registrationData.numberOfTickets}<br>
          💰 Total: ${this.getTotalPrice() === 0 ? 'Free' : '$' + this.getTotalPrice()}
        `,
          confirmButtonText: 'Awesome!',
        }).then((result) => {
          if (result.isConfirmed) {
            if (this.event) {
              this.event.CurrentAttendees += this.registrationData.numberOfTickets;
            }
            this.router.navigate(['/event', this.event?.EventID]);
          }
        });
      },
      error: (error: any) => {
        console.error('Registration failed:', error);

        if (error.error && error.error.error && error.error.error.includes('spots remaining')) {
          this.error = error.error.error;
        } else {
          this.error = 'Registration failed. Please try again. If the problem persists, contact support.';
        }

        this.loading = false;
      }
    });
  }

  /**
   * @returns {void}
   */
  goBackToEvent() {
    if (this.event) {
      this.router.navigate(['/event', this.event.EventID]);
    }
  }

  /**
   * @returns {number} Total price (ticket price × number of tickets)
   */
  getTotalPrice(): number {
    if (!this.event) return 0;
    return this.event.TicketPrice * this.registrationData.numberOfTickets;
  }

  /**
   * @param dateString - The date string to format
   * @returns {string} Formatted date string
   */
  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

  /**
   * @returns {string} "Free" if ticket price is 0, otherwise formatted price with dollar sign
   */
  getTicketPriceDisplay(): string {
    if (!this.event) return '$0';
    return this.event.TicketPrice === 0 ? 'Free' : `$${this.event.TicketPrice}`;
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