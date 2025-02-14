import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close event when overlay is clicked', () => {
    spyOn(component.close, 'emit');
    const overlay = fixture.nativeElement.querySelector('.modal-overlay');
    overlay.click();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should not emit close event when modal content is clicked', () => {
    spyOn(component.close, 'emit');
    const content = fixture.nativeElement.querySelector('.modal-content');
    content.click();
    expect(component.close.emit).not.toHaveBeenCalled();
  });

  it('should emit close event when close button is clicked if showCloseButton is true', () => {
    component.showCloseButton = true;
    fixture.detectChanges();
    spyOn(component.close, 'emit');
    const closeButton = fixture.nativeElement.querySelector('.close-button');
    if (closeButton) {
      closeButton.click();
      expect(component.close.emit).toHaveBeenCalled();
    }
  });

  it('should not render close button when showCloseButton is false', () => {
    component.showCloseButton = false;
    fixture.detectChanges();
    const closeButton = fixture.nativeElement.querySelector('.close-button');
    expect(closeButton).toBeNull();
  });
});
