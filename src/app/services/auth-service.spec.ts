import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth-service';
import * as supabaseModule from '@supabase/supabase-js';
import { User } from '@supabase/supabase-js';
import { vi, describe, it, expect, beforeEach } from 'vitest';


vi.mock('@supabase/supabase-js');

describe('AuthService', () => {
  let service: AuthService;
  let mockRouter: { navigate: ReturnType<typeof vi.fn> };
  let mockAuth: {
    getSession: ReturnType<typeof vi.fn>;
    onAuthStateChange: ReturnType<typeof vi.fn>;
    signInWithPassword: ReturnType<typeof vi.fn>;
    signInWithOAuth: ReturnType<typeof vi.fn>;
    signUp: ReturnType<typeof vi.fn>;
    signOut: ReturnType<typeof vi.fn>;
  };

  const mockUser = { id: 'user-123', email: 'test@test.com' } as User;

  beforeEach(() => {
    mockAuth = {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi
        .fn()
        .mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
      signInWithOAuth: vi.fn().mockResolvedValue({ error: null }),
      signUp: vi.fn().mockResolvedValue({ error: null }),
      signOut: vi.fn().mockResolvedValue({}),
    };

    vi.spyOn(supabaseModule, 'createClient').mockReturnValue({ auth: mockAuth } as any);

    mockRouter = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: mockRouter }],
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ------- Constructor -------

  describe('constructor', () => {
    it('should call getSession on init', () => {
      expect(mockAuth.getSession).toHaveBeenCalled();
    });

    it('should call onAuthStateChange on init', () => {
      expect(mockAuth.onAuthStateChange).toHaveBeenCalled();
    });

    it('should set currentUser to null when there is no session', async () => {
      await Promise.resolve();
      expect(service.currentUser()).toBeNull();
    });

    it('should set currentUser from getSession when there is an active session', async () => {
      vi.spyOn(supabaseModule, 'createClient').mockReturnValue({ auth: mockAuth } as any);
      mockAuth.getSession.mockResolvedValue({ data: { session: { user: mockUser } } });

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [{ provide: Router, useValue: mockRouter }],
      });
      const serviceWithSession = TestBed.inject(AuthService);

      await Promise.resolve();
      expect(serviceWithSession.currentUser()).toEqual(mockUser);
    });

    it('should update currentUser when onAuthStateChange fires with a session', () => {
      const callback = mockAuth.onAuthStateChange.mock.calls[0][0];
      callback('SIGNED_IN', { user: mockUser });
      expect(service.currentUser()).toEqual(mockUser);
    });

    it('should set currentUser to null when onAuthStateChange fires with no session', () => {
      const callback = mockAuth.onAuthStateChange.mock.calls[0][0];
      callback('SIGNED_IN', { user: mockUser });
      callback('SIGNED_OUT', null);
      expect(service.currentUser()).toBeNull();
    });
  });

  // ------- isLoggedIn -------

  describe('isLoggedIn()', () => {
    it('should return false when there is no user', () => {
      expect(service.isLoggedIn()).toBe(false);
    });

    it('should return true when there is a logged-in user', () => {
      const callback = mockAuth.onAuthStateChange.mock.calls[0][0];
      callback('SIGNED_IN', { user: mockUser });
      expect(service.isLoggedIn()).toBe(true);
    });
  });

  // ------- login -------

  describe('login()', () => {
    it('should call signInWithPassword with the given credentials', async () => {
      await service.login('test@test.com', '123456');
      expect(mockAuth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: '123456',
      });
    });

    it('should navigate to "/" on success', async () => {
      await service.login('test@test.com', '123456');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should throw the error when Supabase returns an error', async () => {
      const error = new Error('Invalid credentials');
      mockAuth.signInWithPassword.mockResolvedValue({ error });
      await expect(service.login('test@test.com', 'wrong')).rejects.toThrow('Invalid credentials');
    });

    it('should not navigate when login fails', async () => {
      mockAuth.signInWithPassword.mockResolvedValue({ error: new Error('fail') });
      try {
        await service.login('test@test.com', 'wrong');
      } catch {}
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  // ------- loginWithGoogle -------

  describe('loginWithGoogle()', () => {
    it('should call signInWithOAuth with google provider', async () => {
      await service.loginWithGoogle();
      expect(mockAuth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
    });

    it('should throw the error when Supabase returns an error', async () => {
      const error = new Error('OAuth error');
      mockAuth.signInWithOAuth.mockResolvedValue({ error });
      await expect(service.loginWithGoogle()).rejects.toThrow('OAuth error');
    });
  });

  // ------- register -------

  describe('register()', () => {
    it('should call signUp with the given credentials', async () => {
      await service.register('new@test.com', 'pass123');
      expect(mockAuth.signUp).toHaveBeenCalledWith({
        email: 'new@test.com',
        password: 'pass123',
      });
    });

    it('should navigate to "/" on success', async () => {
      await service.register('new@test.com', 'pass123');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should throw the error when Supabase returns an error', async () => {
      const error = new Error('Email already in use');
      mockAuth.signUp.mockResolvedValue({ error });
      await expect(service.register('new@test.com', 'pass123')).rejects.toThrow(
        'Email already in use',
      );
    });

    it('should not navigate when register fails', async () => {
      mockAuth.signUp.mockResolvedValue({ error: new Error('fail') });
      try {
        await service.register('new@test.com', 'pass123');
      } catch {}
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  // ------- logout -------

  describe('logout()', () => {
    it('should call signOut', async () => {
      await service.logout();
      expect(mockAuth.signOut).toHaveBeenCalled();
    });

    it('should navigate to "/login"', async () => {
      await service.logout();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
