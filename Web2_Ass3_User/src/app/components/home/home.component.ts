import { Component, OnInit, OnDestroy } from '@angular/core';
import { Event, EventService } from '../../services/event.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  events: Event[] = [];
  loading = false;
  error = false;
  currentIntroImage = 'assets/img/intro/1.jpg';
  private imageIndex = 1;
  private imageInterval: any;

  /**
   * @param eventService - Service for fetching event data
   */
  constructor(private eventService: EventService) {}

  /**
   * @returns {void}
   */
  ngOnInit() {
    this.loadEvents();
    this.startImageRotation();
  }

  /**
   * @returns {void}
   */
  ngOnDestroy() {
    if (this.imageInterval) {
      clearInterval(this.imageInterval);
    }
  }

  /**
   * @returns {void}
   */
  loadEvents() {
    this.loading = true;
    this.error = false;
    
    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load events:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  /**
   * @returns {void}
   */
  startImageRotation() {
    this.imageInterval = setInterval(() => {
      this.imageIndex++;
      if (this.imageIndex > 3) this.imageIndex = 1;
      this.currentIntroImage = `assets/img/intro/${this.imageIndex}.jpg`;
    }, 3000);
  }
}