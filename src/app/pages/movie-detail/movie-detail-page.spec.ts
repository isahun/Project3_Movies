import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieDetailPage } from './movie-detail-page';

describe('MovieDetail', () => {
  let component: MovieDetailPage;
  let fixture: ComponentFixture<MovieDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieDetailPage],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieDetailPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
