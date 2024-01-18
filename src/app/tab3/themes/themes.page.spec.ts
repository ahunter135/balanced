import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemesPage } from './themes.page';

describe('ThemesPage', () => {
  let component: ThemesPage;
  let fixture: ComponentFixture<ThemesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ThemesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
