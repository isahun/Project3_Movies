import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { ActorDetail } from './actor-detail';
import { TmdbService } from '../../services/tmdb-service';

describe('ActorDetail', () => {
  let component: ActorDetail;
  let fixture: ComponentFixture<ActorDetail>;

  const mockTmdb = {
    getPersonById: vi.fn().mockReturnValue(of({ id: 1, name: 'Test Actor' })),
    getPersonMovieCredits: vi.fn().mockReturnValue(of({ cast: [], crew: [] })),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActorDetail],
      providers: [
        provideRouter([]),
        { provide: TmdbService, useValue: mockTmdb },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ActorDetail);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('actorId', '1');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
