import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { DirectorDetail } from './director-detail';
import { TmdbService } from '../../services/tmdb-service';

describe('DirectorDetail', () => {
  let component: DirectorDetail;
  let fixture: ComponentFixture<DirectorDetail>;

  const mockTmdb = {
    getPersonById: vi.fn().mockReturnValue(of({ id: 1, name: 'Test Director' })),
    getPersonMovieCredits: vi.fn().mockReturnValue(of({ cast: [], crew: [] })),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectorDetail],
      providers: [
        provideRouter([]),
        { provide: TmdbService, useValue: mockTmdb },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DirectorDetail);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('directorId', '1');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
