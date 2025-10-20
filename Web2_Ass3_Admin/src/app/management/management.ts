import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api';
import { Event } from '../models/event.model';
import { Category } from '../models/category.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-management',
  templateUrl: './management.html',
  standalone: false,
  styleUrls: ['./management.css']
})
export class Management implements OnInit {

  // initial view
  currentView: string = 'dashboard';

  // data storage
  events: Event[] = [];
  categories: Category[] = [];
  isLoadingEvents: boolean = true;

  searchForm: FormGroup;
  searchResults: Event[] = [];
  isSearching: boolean = false;
  searchPerformed: boolean = false;

  // analyze page properties
  analyticsSummary: any = null;
  maxCategoryCount: number = 1;

  // Create/Edit Form Properties
  eventForm: FormGroup;
  currentEventId: number | null = null;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  registrations: any[] = [];

  contactMessages: any[] = [];
  isLoadingMessages: boolean = true;

  /**
   * Initialize the responsive form
   * @param fb Used to simplify the creation of complex forms
   * @param apiService Customized API service
   * @param router The routing service of Angular is used for navigating between different pages of the application.
   */
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    // Initialize the form used for creating/editing events
    this.eventForm = this.fb.group({
      EventName: ['', Validators.required],
      EventDate: ['', Validators.required],
      Location: ['', Validators.required],
      Description: [''],
      TicketPrice: [0, Validators.min(0)],
      GoalAttendees: [1, [Validators.required, Validators.min(1)]],
      CategoryID: ['', Validators.required],
      EventImage: [''],
      CurrentStatus: [1, Validators.required]
    });

    this.searchForm = this.fb.group({
      q: [''],
      category: [''],
      date: [''],
      location: ['']
    });
  }

  /**
   * This is called when the component is initialized. 
   * It loads the initial data required for the management interface.
   */
  ngOnInit(): void {
    this.loadAnalytics();
    this.loadEvents();
    this.loadCategories();
    this.loadContactMessages();
  }

  /**
   * Obtain the statistical data from the backend database 
   * and use it for data visualization in the management interface.
   */
  loadAnalytics(): void {
    this.apiService.getAnalyticsSummary().subscribe(data => {
      this.analyticsSummary = data;
      if (data && data.eventsByCategory && data.eventsByCategory.length > 0) {
        this.maxCategoryCount = Math.max(...data.eventsByCategory.map((cat: any) => cat.eventCount));
      }
    });
  }

  /**
   * To obtain all the events in all states and store them in the "events" array
   */
  loadEvents(): void {
    this.isLoadingEvents = true;
    this.apiService.getAllEvents().subscribe(data => {
      this.events = data;
      this.isLoadingEvents = false;
    });
  }

  /**
   * Used to obtain the category of the event and store it in the "categories" array
   */
  loadCategories(): void {
    this.apiService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  /**
   * Switch the view of the management interface
   * @param view The view that needs to be switched to
   * @param event The events displayed when switching to the 'form' view
   */
  setView(view: string, event: Event | null = null): void {
    // Update the view and reset the form
    this.currentView = view;
    this.imagePreview = null;
    this.selectedFile = null;
    this.registrations = [];

    // Search View
    if (view === 'search') {
      this.searchResults = this.events;
      this.searchPerformed = false;
    }
    // Form view
    if (view === 'form') {
      // Edit mode
      if (event && event.EventID) {
        this.currentEventId = event.EventID;
        this.apiService.getEventById(event.EventID).subscribe(data => {
          this.eventForm.patchValue(data.eventDetails);
          this.registrations = data.registrations;
          this.imagePreview = this.resolveImageUrl(event.EventImage);
        })
      } else {
        // Create Mode
        this.currentEventId = null;
        this.eventForm.reset({ TicketPrice: 0, GoalAttendees: 1, CurrentStatus: 1 });
      }
    }
  }

  /**
   * Process the uploaded images
   * @param event Including the file information selected by the user
   */
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Use the FileReader API to generate local preview images of the picture
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  /**
   * Handles the submission of the create/edit event form.
   * @returns 
   */
  onFormSubmit(): void {
    if (this.eventForm.invalid) {
      // Use SweetAlert2 to enhance the appearance of Alerts
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill all required fields!',
      });
      return;
    }
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('eventImage', this.selectedFile);
      this.apiService.uploadImage(formData).subscribe(uploadResponse => {
        this.eventForm.patchValue({ EventImage: uploadResponse.filePath });
        this.saveEventData();
      });
    } else {
      this.saveEventData();
    }
  }

  /**
   * Save the event data to the backend database
   */
  saveEventData(): void {
    const eventData = this.eventForm.value;
    // Based on whether an activity ID exists, determine whether it is an update or a creation.
    const isUpdating = !!this.currentEventId;
    const action = isUpdating
      ? this.apiService.updateEvent(this.currentEventId!, eventData)
      : this.apiService.createEvent(eventData);

    // Use SweetAlert2 to enhance the appearance of Alerts
    action.subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `Event ${isUpdating ? 'updated' : 'created'} successfully!`,
        timer: 2000,
        showConfirmButton: false
      });
      this.loadEvents();
      this.setView('list');
    });
  }

  /**
   * Used for handling the deletion of specified events
   * @param eventId The ID of the event that needs to be deleted
   */
  onDelete(eventId: number): void {
    // Use SweetAlert2 to enhance the appearance of Alerts
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f86c54',
      cancelButtonColor: 'rgba(176, 175, 175, 1)',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteEvent(eventId).subscribe({
          next: () => {
            Swal.fire(
              'Deleted!',
              'The event has been deleted.',
              'success'
            );
            this.loadEvents();
          },
          error: (err) => {
            Swal.fire(
              'Deletion Failed!',
              err.error.error || 'Could not delete the event.',
              'error'
            );
          }
        });
      }
    })
  }

  /**
   * Handling the submission of the search options on the management page
   */
  onSearchSubmit(): void {
    // Prevent duplicate submissions
    this.isSearching = true;
    this.searchPerformed = true;
    this.apiService.getAllEvents(this.searchForm.value).subscribe(data => {
      this.searchResults = data;
      this.isSearching = false;
    });
  }

  /**
   * Reset search filters
   */
  clearSearchFilters(): void {
    this.searchForm.reset({ q: '', category: '', date: '', location: '' });
    this.searchResults = this.events;
    this.searchPerformed = false;
  }

  /**
   * Retrieve all contact messages and store them in the corresponding array.
   */
  loadContactMessages(): void {
    this.isLoadingMessages = true;
    this.apiService.getContacts().subscribe(data => {
      this.contactMessages = data;
      this.isLoadingMessages = false;
    });
  }

  /**
   * Delete contact message
   * @param contactId The ID of the contact message that needs to be deleted
   */
  onDeleteContact(contactId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this message!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f86c54',
      cancelButtonColor: 'rgba(176, 175, 175, 1)',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteContact(contactId).subscribe({
          next: () => {
            Swal.fire(
              'Deleted!',
              'The message has been deleted.',
              'success'
            );
            this.contactMessages = this.contactMessages.filter(msg => msg.ContactID !== contactId);
          },
          error: (err) => {
            Swal.fire(
              'Deletion Failed!',
              err.error.error || 'Could not delete the message.',
              'error'
            );
          }
        });
      }
    });
  }

  /**
   * Because the default activity images are stored on the front end, while the updated images are standardizedly stored on the back end, 
   * thus two search methods are required.
   * @param imagePath The image paths stored in the database
   * @returns The final image path
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
