import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostEmailsComponent } from './post-emails.component';

describe('PostEmailsComponent', () => {
  let component: PostEmailsComponent;
  let fixture: ComponentFixture<PostEmailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostEmailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostEmailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
