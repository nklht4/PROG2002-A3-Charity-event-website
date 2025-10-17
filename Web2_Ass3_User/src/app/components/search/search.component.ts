import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Event, EventService, Category } from '../../services/event.service';

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  categories: Category[] = [];
  events: Event[] = [];
  loading = false;
  error = false;
  
  filters = {
    category: '',
    date: '',
    location: '',
    keyword: ''
  };

  /**
   * @param eventService - Service for event data operations
   * @param route - Service for accessing query parameters
   * @param router - Service for navigation
   */
  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * @returns {void}
   */
  ngOnInit() {
    this.loadCategories();
    
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.filters.keyword = params['q'];
      }
      this.applyFilters();
    });
  }

  /**
   * @returns {void}
   */
  loadCategories() {
    this.eventService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (error) => console.error('Failed to load categories:', error)
    });
  }

  /**
   * @returns {void}
   */
  applyFilters() {
    this.loading = true;
    this.error = false;
    
    const params = this.buildQueryParams();
    
    this.eventService.getEvents(params).subscribe({
      next: (data) => {
        this.events = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to fetch events:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  /**
   * @returns {void}
   */
  clearFilters() {
    this.filters = {
      category: '',
      date: '',
      location: '',
      keyword: ''
    };
    this.applyFilters();
  }

  /**
   * @returns {void}
   */
  onSearch() {
    this.applyFilters();
  }

  /**
   * @returns {any} Query parameters object for API request
   */
  private buildQueryParams(): any {
    const params: any = {};
    if (this.filters.category) params.category = this.filters.category;
    if (this.filters.date) params.date = this.filters.date;
    if (this.filters.location) params.location = this.filters.location;
    if (this.filters.keyword) params.q = this.filters.keyword;
    return params;
  }
}