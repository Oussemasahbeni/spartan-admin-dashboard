import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { LOCAL_STORAGE } from '@core/config/tokens';
import { User } from '@shared/models/user';
import { AuthService } from './auth.service';

@Component({ selector: 'adm-login', template: '<h1>Login Page</h1>' })
class Login {}

const mockUser: User = {
  id: '1',
  name: 'John',
  email: 'john@example.com',
  avatar: '',
  phoneNumber: '+123456789',
  role: 'admin',
  status: 'active',
  createdAt: new Date('2023-01-01'),
};

describe('AuthService', () => {
  let service: AuthService;
  let router: Router;
  let storage: { removeItem: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    storage = {
      removeItem: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: LOCAL_STORAGE, useValue: storage },
        provideRouter([{ path: 'login', component: Login }]),
      ],
    });

    router = TestBed.inject(Router);
    service = TestBed.inject(AuthService);
  });

  describe('initial state', () => {
    it('currentUser is null', () => {
      expect(service.currentUser()).toBeNull();
    });

    it('isAuthenticated is false', () => {
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  it('setUser updates currentUser and isAuthenticated', () => {
    const user = mockUser;
    service.setUser(user);

    expect(service.currentUser()).toEqual(user);
    expect(service.isAuthenticated()).toBe(true);
  });

  it('logout clears user, removes token, and navigates to /login', async () => {
    service.setUser(mockUser);

    await service.logout();

    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
    expect(storage.removeItem).toHaveBeenCalledWith('token');
    expect(router.url).toBe('/login');
  });
});
