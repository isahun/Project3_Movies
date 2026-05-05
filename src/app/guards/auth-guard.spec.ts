import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth-guard';
import { AuthService } from '../services/auth-service';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('authGuard', () => {
  let mockGetSession: ReturnType<typeof vi.fn>;
  let mockRouter: {
    navigate: ReturnType<typeof vi.fn>;
    parseUrl: ReturnType<typeof vi.fn>;
    createUrlTree: ReturnType<typeof vi.fn>;
  };

  const executeGuard: CanActivateFn = (...args) =>
    TestBed.runInInjectionContext(() => authGuard(...args));

  beforeEach(() => {
    mockGetSession = vi.fn().mockResolvedValue({ data: { session: null } });

    mockRouter = {
      navigate: vi.fn(),
      parseUrl: vi.fn().mockReturnValue('/login'),
      createUrlTree: vi.fn().mockReturnValue({}),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { supabase: { auth: { getSession: mockGetSession } } } },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow access when user has session', async () => {
    mockGetSession.mockResolvedValue({ data: { session: { user: { id: '1' } } } });

    const result = await executeGuard(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot,
    );

    expect(result).toBe(true);
  });

  it('should redirect to /login when no session', async () => {
    const result = await executeGuard(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot,
    );

    expect(result).not.toBe(true);
  });
});
