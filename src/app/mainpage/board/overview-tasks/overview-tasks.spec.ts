import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewTasks } from './overview-tasks';

describe('OverviewTasks', () => {
  let component: OverviewTasks;
  let fixture: ComponentFixture<OverviewTasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewTasks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverviewTasks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
