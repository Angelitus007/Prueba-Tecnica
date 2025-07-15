import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  private _currentYear: number = new Date().getFullYear();
  private _webName: string = 'SUPERHERO CRUD';

  private _socialMediaLinks = [
    { name: 'Instagram', url: 'https://www.instagram.com', icon: 'assets/social-media/Instagram.svg' },
    { name: 'YouTube', url: 'https://www.youtube.com', icon: 'assets/social-media/Youtube.svg' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com', icon: 'assets/social-media/Linkedin.svg' },
    { name: 'Facebook', url: 'https://www.facebook.com', icon: 'assets/social-media/Facebook.svg' },
    { name: 'Twitter', url: 'https://www.twitter.com', icon: 'assets/social-media/Twitter.svg' }
  ];

  get currentYear(): number {
    return this._currentYear;
  }

  get webName(): string {
    return this._webName;
  }

  get socialMediaLinks(): { name: string; url: string; icon: string }[] {
    return this._socialMediaLinks;
  }
}
