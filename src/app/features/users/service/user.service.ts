import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../shared/models/user';

@Injectable({
  providedIn: 'root',
})
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
