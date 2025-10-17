import { Component, Input, OnInit } from '@angular/core';
import { Event } from '../../services/event.service';

@Component({
  selector: 'app-event-card',
  standalone: false,
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements OnInit {
  @Input() event!: Event;

  ngOnInit() {
    console.group('🔍 EventCard Debug - ' + this.event.EventName);
    console.log('Event ID:', this.event.EventID);
    console.log('Original Image URL from API:', this.resolveImageUrl(this.event.EventImage));
    console.log('Fixed Image URL:', this.getFixedImageUrl(this.event.EventImage, this.event.EventID));
    console.groupEnd();
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
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      console.error('Incorrect date formatting:', error);
      return 'Date format error';
    }
  }

  /**
   * @param text - The text to truncate
   * @param maxLength - Maximum length before truncation
   * @returns {string} Original text or truncated text with ellipsis
   */
  truncate(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) return text;
    const maxLengthIndex = text.lastIndexOf(' ', maxLength);
    return text.slice(0, maxLengthIndex > 0 ? maxLengthIndex : maxLength) + '...';
  }

  /**
   * @param originalUrl - Original image URL from API/database
   * @param eventId - Event ID for fallback image selection
   * @returns {string} Corrected image URL path
   */
  getFixedImageUrl(originalUrl: string, eventId: number): string {
    console.log('🔧 EventCard.getFixedImageUrl Input:', originalUrl, 'Event ID:', eventId);

    if (originalUrl && originalUrl.includes('../img/event_img/')) {
      const fileName = originalUrl.replace('../img/event_img/', '');
      const fixedUrl = `assets/img/event_img/${fileName}`;
      console.log('🔄 Change database path:', originalUrl, '→', fixedUrl);
      return fixedUrl;
    }

    if (!originalUrl || originalUrl.trim() === '' || originalUrl === 'null' || originalUrl === 'undefined') {
      console.log('📝 Select an image using the event ID:', eventId);

      let imageNumber = eventId;
      if (imageNumber < 1) imageNumber = 1;
      if (imageNumber > 15) imageNumber = 15;

      const fixedUrl = `assets/img/event_img/${imageNumber}.jpg`;
      console.log('✅ Generated image path:', fixedUrl);
      return fixedUrl;
    }

    if (originalUrl.startsWith('assets/img/event_img/')) {
      console.log('✅ It is already the correct path:', originalUrl);
      return originalUrl;
    }

    if (!originalUrl.includes('/') && originalUrl.includes('.jpg')) {
      const fixedUrl = `assets/img/event_img/${originalUrl}`;
      console.log('📁 Add complete path:', originalUrl, '→', fixedUrl);
      return fixedUrl;
    }

    console.log('⚠️ Unknown path format, use event ID image');
    let imageNumber = eventId;
    if (imageNumber < 1) imageNumber = 1;
    if (imageNumber > 15) imageNumber = 15;
    const fixedUrl = `assets/img/event_img/${imageNumber}.jpg`;
    console.log('✅ The final generated image path:', fixedUrl);
    return fixedUrl;
  }

  /**
   * @param event - Image error event object
   * @returns {void}
   */
  handleImageError(event: any) {
    const imgElement = event.target as HTMLImageElement;

    console.group('❌ EventCard Image Load Error - ' + this.event.EventName);
    console.error('Failed URL:', imgElement.src);
    console.error('Original API URL:', this.event.EventImage);
    console.error('Event ID:', this.event.EventID);
    console.groupEnd();

    let imageNumber = this.event.EventID;
    if (imageNumber < 1) imageNumber = 1;
    if (imageNumber > 15) imageNumber = 15;
    imgElement.src = `assets/img/event_img/${imageNumber}.jpg`;
    console.log('🔄 Switch to the backup image:', imgElement.src);

    imgElement.onerror = null;
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