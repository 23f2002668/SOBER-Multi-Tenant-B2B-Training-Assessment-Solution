import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAdminDashboard } from './company-admin-dashboard';

describe('CompanyAdminDashboard', () => {
  let component: CompanyAdminDashboard;
  let fixture: ComponentFixture<CompanyAdminDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyAdminDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyAdminDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
