import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { User } from '@shared/models/user';
import { Observable } from 'rxjs';

@Service()
export class UserService {
  private readonly _http = inject(HttpClient);
  private readonly API_URL = '/api/users';

  /**
   * CREATE: Add a new user.
   */
  createUser(user: Partial<User>): Observable<User> {
    return this._http.post<User>(this.API_URL, user);
  }

  /**
   * UPDATE: Patch an existing user.
   */
  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this._http.patch<User>(`${this.API_URL}/${id}`, user);
  }

  /**
   * DELETE: Remove a user.
   */
  deleteUser(userId: string): Observable<void> {
    return this._http.delete<void>(`${this.API_URL}/${userId}`);
  }
}
