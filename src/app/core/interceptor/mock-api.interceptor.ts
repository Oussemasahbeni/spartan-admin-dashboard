import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { STATIC_USERS } from '@core/mock/users.data';
import { delay, of, switchMap, tap } from 'rxjs';
import { User } from '../../shared/models/user';

let db: User[] | null = null;

const getDb$ = () => {
  if (db) return of(db);
  return of(structuredClone(STATIC_USERS)).pipe(tap((data) => (db = data)));
};

export const mockApiInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  // Only target our mock users endpoint
  if (!req.url.includes('/api/users')) {
    return next(req);
  }

  return getDb$().pipe(
    delay(200),
    switchMap((users) => {
      const url = req.url;
      const method = req.method;

      // Extract ID from URL (e.g., /api/users/uuid-123)
      const urlSegments = url.split('/');
      const lastSegment = urlSegments[urlSegments.length - 1];
      const isIdRequest = lastSegment !== 'users';
      const userId = isIdRequest ? lastSegment : null;

      // --- 1. GET (List or Single) ---
      if (method === 'GET') {
        if (userId) {
          const user = users.find((u) => u.id === userId);
          return of(new HttpResponse({ status: 200, body: user }));
        }

        const params = req.params;
        const search = params.get('search')?.toLowerCase() || '';
        const page = parseInt(params.get('page') || '0');
        const limit = parseInt(params.get('pageSize') || '10');

        const roles = params.getAll('roles');
        const statuses = params.getAll('statuses');

        const sortField = params.get('sortField') as keyof User;
        const sortOrder = params.get('sortOrder') || 'asc';

        let filtered = users.filter((u) => {
          const matchesSearch =
            u.name.toLowerCase().includes(search) ||
            u.email.toLowerCase().includes(search) ||
            u.phoneNumber.toLowerCase().includes(search);

          //  Filter by Role if any roles are selected
          let matchedRole;
          if (roles) {
            matchedRole = roles.length === 0 || roles.includes(u.role);
          }
          let matchedStatus;
          if (statuses) {
            matchedStatus = statuses.length === 0 || statuses.includes(u.status);
          }

          return matchesSearch && matchedRole && matchedStatus;
        });

        if (sortField) {
          filtered = [...filtered].sort((a, b) => {
            const aVal = a[sortField];
            const bVal = b[sortField];
            if (aVal === bVal) return 0;
            const multiplier = sortOrder === 'asc' ? 1 : -1;
            return (aVal! > bVal! ? 1 : -1) * multiplier;
          });
        }

        return of(
          new HttpResponse({
            status: 200,
            body: { content: filtered.slice(page * limit, (page + 1) * limit), total: filtered.length },
          })
        );
      }

      // --- 2. POST (Create) ---
      if (method === 'POST') {
        const body = req.body as Partial<User>;
        const newUser: User = {
          ...body,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        } as User;

        db = [newUser, ...users];
        return of(new HttpResponse({ status: 201, body: newUser }));
      }

      // --- 3. PATCH (Update) ---
      if (method === 'PATCH' && userId) {
        const body = req.body as Partial<User>;
        let updatedUser: User | undefined;

        db = users.map((u) => {
          if (u.id === userId) {
            updatedUser = { ...u, ...body };
            return updatedUser;
          }
          return u;
        });

        return of(new HttpResponse({ status: 200, body: updatedUser }));
      }

      console.log('MockApiInterceptor: Received request', { method, url, userId });
      // --- 4. DELETE (Delete) ---
      if (method === 'DELETE' && userId) {
        console.log('Deleting user with ID:', userId);
        db = users.filter((u) => u.id !== userId);
        return of(new HttpResponse({ status: 204 }));
      }

      return next(req);
    })
  );
};
