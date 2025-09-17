import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewContact } from './overview-contact';

describe('OverviewContact', () => {
  let component: OverviewContact;
  let fixture: ComponentFixture<OverviewContact>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewContact]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverviewContact);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
