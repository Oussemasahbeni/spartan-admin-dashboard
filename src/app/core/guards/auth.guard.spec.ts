import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { LOCAL_STORAGE } from '@core/config/tokens';
import { Mocked } from 'vitest';
import { AuthService } from '../auth/auth.service';
import { authGuard } from './auth.guard';

@Component({ template: '<h1>Protected Page</h1>' })
class Protected {}
@Component({ template: '<h1>Login Page</h1>' })
class Login {}

describe('authGuard', () => {
  let authService: Mocked<AuthService>;
  let harness: RouterTestingHarness;
  let router: Router;

  async function setup(isAuthenticated: boolean, token: string | null = null) {
    authService = {
      currentUser: vi.fn().mockReturnValue(isAuthenticated ? { id: '1' } : null),
      isAuthenticated: vi.fn().mockReturnValue(isAuthenticated),
      setUser: vi.fn(),
      logout: vi.fn(),
    } as unknown as Mocked<AuthService>;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: LOCAL_STORAGE, useValue: { getItem: vi.fn().mockReturnValue(token) } },
        provideRouter([
          { path: 'protected', component: Protected, canActivate: [authGuard] },
          { path: 'login', component: Login },
        ]),
      ],
    });
    router = TestBed.inject(Router);
    harness = await RouterTestingHarness.create();
  }

  it('allows navigation when user is authenticated', async () => {
    await setup(true);
    await harness.navigateByUrl('/protected', Protected);
    expect(harness.routeNativeElement?.textContent).toContain('Protected Page');
    expect(router.url).toBe('/protected');
  });

  it('redirects to login when user is not authenticated', async () => {
    await setup(false);
    await harness.navigateByUrl('/protected', Login);
    expect(harness.routeNativeElement?.textContent).toContain('Login Page');
    expect(router.url).toBe('/login');
  });

  it('allows navigation when no user in memory but token exists', async () => {
    await setup(false, 'valid-token');
    await harness.navigateByUrl('/protected', Protected);
    expect(harness.routeNativeElement?.textContent).toContain('Protected Page');
    expect(authService.setUser).toHaveBeenCalledOnce();
  });

  it('restores a user from token with the correct data shape', async () => {
    await setup(false, 'valid-token');
    await harness.navigateByUrl('/protected', Protected);
    expect(authService.setUser).toHaveBeenCalledWith(expect.objectContaining({ id: '1', role: 'admin', status: 'active' }));
  });
});
