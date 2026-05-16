import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Breadcrumb } from '@shared/components/breadcrumbs-header/breadcrumb';
import { filter, map } from 'rxjs';

/**
 * Service that builds dynamic breadcrumbs based on the current route.
 *
 * Add `data: { breadcrumb: 'translationKey' }` to your route configuration
 * to define breadcrumb labels for each route.
 *
 * @example
 * ```typescript
 *  In routes configuration:
 * {
 *   path: 'dashboard',
 *   data: { breadcrumb: 'navigation.dashboard' },
 *   children: [
 *     {
 *       path: 'overview',
 *       data: { breadcrumb: 'navigation.overview' },
 *       component: OverviewComponent
 *     }
 *   ]
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);

  /**
   * Signal containing the current breadcrumb trail.
   * Updates automatically on navigation.
   */
  public readonly breadcrumbs = toSignal(
    this._router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this._buildBreadcrumbs())
    ),
    { initialValue: []}
  );

  /**
   * Builds breadcrumbs by traversing the route path from root to current route.
   * Uses ActivatedRoute.pathFromRoot for a clean linear traversal.
   */
  private _buildBreadcrumbs(): Breadcrumb[] {
    // Get the deepest activated child route
    let route = this._activatedRoute.root;
    while (route.firstChild) {
      route = route.firstChild;
    }

    // Get all routes from root to current
    const routePath = route.pathFromRoot;

    const breadcrumbs: Breadcrumb[] = [];
    let url = '';

    for (const segment of routePath) {
      // Build URL from this segment
      const segmentUrl = segment.snapshot.url.map((s) => s.path).join('/');
      if (segmentUrl) {
        url += `/${segmentUrl}`;
      }

      // Get breadcrumb label from route data
      const label = segment.snapshot.data['breadcrumb'];
      if (!label) {
        continue;
      }

      const resolvedLabel = this._resolveLabel(label, segment);

      // Skip duplicates (same label as previous breadcrumb)
      const lastLabel = breadcrumbs[breadcrumbs.length - 1]?.label;
      if (resolvedLabel === lastLabel) {
        continue;
      }

      breadcrumbs.push({
        label: resolvedLabel,
        url: url || '/',
      });
    }

    return breadcrumbs;
  }

  /**
   * Resolves dynamic labels that reference route parameters.
   * If the label starts with ':', it's treated as a route parameter reference.
   */
  private _resolveLabel(label: string, route: ActivatedRoute): string {
    if (label.startsWith(':')) {
      const paramName = label.substring(1);
      return route.snapshot.params[paramName] ?? label;
    }
    return label;
  }
}
