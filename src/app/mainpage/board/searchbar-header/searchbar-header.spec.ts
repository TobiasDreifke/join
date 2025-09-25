import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchbarHeader } from './searchbar-header';

describe('SearchbarHeader', () => {
  let component: SearchbarHeader;
  let fixture: ComponentFixture<SearchbarHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchbarHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchbarHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
