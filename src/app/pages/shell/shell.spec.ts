import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { vi } from 'vitest';

import { Shell } from './shell';
import { AuthService } from '../../services/auth-service';

describe('Shell', () => {
  let component: Shell;
  let fixture: ComponentFixture<Shell>;

  const mockAuthService = {
    currentUser: signal(null as any),
    isLoggedIn: vi.fn().mockReturnValue(false),
    logout: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shell],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Shell);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
