import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  protected currentYear: number = new Date().getFullYear();
  protected webName: string = 'SUPERHERO CRUD';

  protected socialMediaLinks = [
    { name: 'Instagram', url: 'https://www.instagram.com', icon: 'assets/social-media/Instagram.svg' },
    { name: 'YouTube', url: 'https://www.youtube.com', icon: 'assets/social-media/Youtube.svg' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com', icon: 'assets/social-media/Linkedin.svg' },
    { name: 'Facebook', url: 'https://www.facebook.com', icon: 'assets/social-media/Facebook.svg' },
    { name: 'Twitter', url: 'https://www.twitter.com', icon: 'assets/social-media/Twitter.svg' }
  ];
}
