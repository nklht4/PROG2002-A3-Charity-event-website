import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api';
import { Event } from '../models/event.model';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  events: Event[] = [];

  /**
   * Component constructor function
   * @param apiService Customized API service
   */
  constructor(private apiService: ApiService) { }

  /**
   * When initializing the component, the backend event data is obtained.
   */
  ngOnInit(): void {
    this.apiService.getEvents().subscribe(data => {
      this.events = data;
      console.log('Successfully retrieved event data from the backend!', this.events);
    });
  }
}
