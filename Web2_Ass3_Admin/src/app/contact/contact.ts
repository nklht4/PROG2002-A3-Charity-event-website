import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api';
import { ContactModel } from '../models/ContactModel.model';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.html',
  standalone: false,
  styleUrls: ['./contact.css']
})
export class Contact {

  contactForm: FormGroup;
  submitted = false;
  success = false;
  error = false;
  isLoading = false;

  email = 'calebgong06@gmail.com';

  /**
   * Contact Component constructor function
   * @param fb Used to simplify the creation of complex forms
   * @param apiService Customized API service
   */
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.contactForm = this.createForm();
  }

  /**
   * Create and return a configured FormGroup instance
   * @returns Return a FormGroup that has all the controls and validation rules configured.
   */
  private createForm(): FormGroup {
    return this.fb.group({
      UserName: ['', [Validators.required, Validators.minLength(2)]],
      ContactEmail: ['', [Validators.required, Validators.email]],
      FeedBack: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  /**
   * Handling the submission of forms
   */
  onSubmit(): void {
    this.submitted = true;

    if (this.contactForm.valid) {
      this.isLoading = true;
      const contactData: ContactModel = this.contactForm.value;

      this.apiService.submitContactForm(contactData).subscribe({
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
   * Used to simplify the access to form controls in HTML templates
   */
  get formControls() {
    return this.contactForm.controls;
  }
}