import { TestBed, waitForAsync } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { BackendService } from "./backend.service";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { TaskService } from "./service/task-service.service";

describe("AppComponent", () => {
  const taskService = {
    loadTasks: jasmine.createSpy("loadTasks"),
    loadUsers: jasmine.createSpy("loadUsers"),
    tasks$: of([]),
    users$: of([]),
    showError: jasmine.createSpy("showError"),
    showSuccess: jasmine.createSpy("showSuccess"),
  };
  const routerSpy = {
    navigate: jasmine.createSpy("navigate"),
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: BackendService, useValue: new BackendService() },
        { provide: TaskService, useValue: taskService },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();
  }));

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
