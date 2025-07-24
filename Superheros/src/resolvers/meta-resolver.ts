import { inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { MetaService } from '../app/services/meta.service';

@Injectable({
  providedIn: 'root',
})
export class MetaResolver implements Resolve<void> {

  private readonly _metaService = inject(MetaService)

  public resolve(route: ActivatedRouteSnapshot): void {
    const { description, robots, ogTitle, ogDescription, ogImage, ogUrl } = route.data;
    this._metaService.setMetaTags(description, robots, ogTitle, ogDescription, ogImage, ogUrl);
  }
}
