import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService, Contact } from '../../services/event.service';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm: FormGroup;
  submitted = false;
  success = false;
  error = false;
  isLoading = false;
  email = 'contact@charityevents.org';

  /**
   * @param fb - FormBuilder service for creating reactive forms
   * @param eventService - Service for handling contact form submissions
   */
  constructor(
    private fb: FormBuilder,
    private eventService: EventService
  ) {
    this.contactForm = this.createForm();
  }

  /**
   * @returns {FormGroup} Configured form group with validation rules
   */
  private createForm(): FormGroup {
    return this.fb.group({
      UserName: ['', [Validators.required, Validators.minLength(2)]],
      ContactEmail: ['', [Validators.required, Validators.email]],
      FeedBack: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  /**
   * @returns {void}
   */
  onSubmit(): void {
    this.submitted = true;

    if (this.contactForm.valid) {
      this.isLoading = true;
      const contactData: Contact = this.contactForm.value;

      this.eventService.submitContactForm(contactData).subscribe({
        next: (response) => {
          console.log('Contact form submitted successfully:', response);
          this.success = true;
          this.error = false;
          this.contactForm.reset();
          this.submitted = false;
          this.isLoading = false;

          setTimeout(() => {
            this.success = false;
          }, 5000);
        },
        error: (error) => {
          console.error('Error submitting contact form:', error);
          this.success = false;
          this.error = true;
          this.isLoading = false;

          setTimeout(() => {
            this.error = false;
          }, 5000);
        }
      });
    }
  }

  /**
   * @returns {any} Object containing all form controls for template access
   */
  get formControls() {
    return this.contactForm.controls;
  }
}