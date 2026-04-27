import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTool } from './search-tool';

describe('SearchTool', () => {
  let component: SearchTool;
  let fixture: ComponentFixture<SearchTool>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchTool],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchTool);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
