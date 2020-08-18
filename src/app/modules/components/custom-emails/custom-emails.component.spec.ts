import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomEmailsComponent } from './custom-emails.component';

describe('CustomEmailsComponent', () => {
  let component: CustomEmailsComponent;
  let fixture: ComponentFixture<CustomEmailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomEmailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomEmailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
