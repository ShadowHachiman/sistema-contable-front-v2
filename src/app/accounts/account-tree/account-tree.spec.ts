import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTree } from './account-tree';

describe('AccountTree', () => {
  let component: AccountTree;
  let fixture: ComponentFixture<AccountTree>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountTree]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountTree);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
