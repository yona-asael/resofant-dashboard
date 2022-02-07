import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeAutoComponent } from './type-auto.component';

describe('TypeAutoComponent', () => {
  let component: TypeAutoComponent;
  let fixture: ComponentFixture<TypeAutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeAutoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeAutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
