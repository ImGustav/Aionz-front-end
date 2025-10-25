import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterProductModal } from './register-product-modal.component';

describe('RegisterProductModal', () => {
  let component: RegisterProductModal;
  let fixture: ComponentFixture<RegisterProductModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterProductModal],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterProductModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
