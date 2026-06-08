import { Service, signal } from '@angular/core';
import { STATIC_USERS } from '@core/mock/users.data';
import { PaginatedResponse } from '@shared/models/page';
import { User, UserRole, UserStatus } from '@shared/models/user';
import { delay, Observable, of } from 'rxjs';

/**
 * Query shape consumed by {@link UserService.getUsers}.
 * Mirrors the params the table builds from pagination, sorting and filters.
 */
export interface UserQuery {
  page: number;
  pageSize: number;
  search: string;
  sortField: keyof User | '';
  sortOrder: 'asc' | 'desc';
  roles: UserRole[];
  statuses: UserStatus[];
}

@Service()
export class UserService {
  private readonly _db = signal<User[]>(structuredClone(STATIC_USERS));

  private readonly _latency = 200;

  getUsers(query: UserQuery): Observable<PaginatedResponse<User>> {
    const { page, pageSize, search, sortField, sortOrder, roles, statuses } = query;
    const term = search.toLowerCase();

    let filtered = this._db().filter((user) => {
      const matchesSearch =
        !term ||
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.phoneNumber.toLowerCase().includes(term);
      const matchesRole = roles.length === 0 || roles.includes(user.role);
      const matchesStatus = statuses.length === 0 || statuses.includes(user.status);
      return matchesSearch && matchesRole && matchesStatus;
    });

    if (sortField) {
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (aVal === bVal) return 0;
        return (aVal! > bVal! ? 1 : -1) * multiplier;
      });
    }

    const content = filtered.slice(page * pageSize, (page + 1) * pageSize);
    return of({ content, total: filtered.length }).pipe(delay(this._latency));
  }

  createUser(user: Partial<User>): Observable<User> {
    const newUser: User = {
      ...user,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    } as User;

    this._db.update((users) => [newUser, ...users]);
    return of(newUser).pipe(delay(this._latency));
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    let updatedUser: User | undefined;

    this._db.update((users) =>
      users.map((current) => {
        if (current.id !== id) return current;
        updatedUser = { ...current, ...user };
        return updatedUser;
      })
    );

    return of(updatedUser!).pipe(delay(this._latency));
  }

  deleteUser(id: string): Observable<void> {
    this._db.update((users) => users.filter((user) => user.id !== id));
    return of(void 0).pipe(delay(this._latency));
  }
}
