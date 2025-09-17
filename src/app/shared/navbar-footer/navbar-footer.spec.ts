import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarFooter } from './navbar-footer';

describe('NavbarFooter', () => {
  let component: NavbarFooter;
  let fixture: ComponentFixture<NavbarFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarFooter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
