import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleTaskPopup } from './single-task-popup';

describe('SingleTaskPopup', () => {
  let component: SingleTaskPopup;
  let fixture: ComponentFixture<SingleTaskPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleTaskPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleTaskPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
