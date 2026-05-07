import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { LOCAL_STORAGE } from '@core/config/tokens';
import { Mocked } from 'vitest';
import { AuthService } from '../auth/auth.service';
import { noAuthGuard } from './no-auth.guard';

@Component({ template: '<h1>Home Page</h1>' })
class Home {}
@Component({ template: '<h1>Login Page</h1>' })
class Login {}

describe('noAuthGuard', () => {
  let authService: Mocked<AuthService>;
  let harness: RouterTestingHarness;
  let router: Router;

  async function setup(user: object | null = null, token: string | null = null) {
    authService = {
      currentUser: vi.fn().mockReturnValue(user),
      isAuthenticated: vi.fn().mockReturnValue(!!user),
      setUser: vi.fn(),
      logout: vi.fn(),
    } as unknown as Mocked<AuthService>;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: LOCAL_STORAGE, useValue: { getItem: vi.fn().mockReturnValue(token) } },
        provideRouter([
          { path: '', component: Home },
          { path: 'login', component: Login, canActivate: [noAuthGuard] },
        ]),
      ],
    });

    router = TestBed.inject(Router);
    harness = await RouterTestingHarness.create();
  }

  describe('when user is authenticated', () => {
    it('redirects away from login when user is in memory', async () => {
      await setup({ id: '1' });
      await harness.navigateByUrl('/login', Home);
      expect(harness.routeNativeElement?.textContent).toContain('Home Page');
      expect(router.url).toBe('/');
    });

    it('redirects specifically to /', async () => {
      await setup({ id: '1' });
      await harness.navigateByUrl('/login', Home);
      expect(router.url).toBe('/');
    });
  });

  describe('when no user in memory but token exists', () => {
    it('redirects away from login when token is in localStorage', async () => {
      await setup(null, 'valid-token');
      await harness.navigateByUrl('/login', Home);
      expect(harness.routeNativeElement?.textContent).toContain('Home Page');
    });

    it('redirects specifically to /', async () => {
      await setup(null, 'valid-token');
      await harness.navigateByUrl('/login', Home);
      expect(router.url).toBe('/');
    });
  });

  describe('when user is not authenticated', () => {
    it('allows navigation to login when no user and no token', async () => {
      await setup();
      await harness.navigateByUrl('/login', Login);
      expect(harness.routeNativeElement?.textContent).toContain('Login Page');
    });
  });
});
