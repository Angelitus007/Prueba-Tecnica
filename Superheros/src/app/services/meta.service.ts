import { inject, Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MetaService {

  private readonly meta = inject(Meta)

  public setMetaTags(description: string, robots: string, ogTitle?: string, ogDescription?: string, ogImage?: string, ogUrl?: string): void {
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: robots });

    const ogTags = {
      'og:title': ogTitle,
      'og:description': ogDescription,
      'og:image': ogImage,
      'og:url': ogUrl
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      if (content) {
        this.meta.updateTag({ property, content });
      }
    });
  }

  public getMetaTags(): Meta {
    return this.meta;
  }
}
