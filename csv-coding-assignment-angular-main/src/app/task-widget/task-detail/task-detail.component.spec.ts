import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TaskDetailComponent } from "./task-detail.component";
import { ActivatedRoute, Router } from "@angular/router";
import { BackendService } from "../../backend.service";
import { FormBuilder } from "@angular/forms";
import { of, throwError } from "rxjs";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { By } from "@angular/platform-browser";
import { TaskService } from "../../service/task-service.service";

describe("TaskDetailComponent", () => {
  let component: TaskDetailComponent;
  let fixture: ComponentFixture<TaskDetailComponent>;

  const routerSpy = {
    navigate: jasmine.createSpy("navigate"),
  };
  const routeSpy = {
    snapshot: {
      params: { id: 1 },
    },
  };

  const mockDate = {
    users: [
      {
        id: 1,
        title: "Task 1",
        description: "Description 1",
        completed: false,
      },
    ],
    tasks: [
      {
        id: 1,
        title: "Task 1",
        description: "Description 1",
        completed: false,
      },
    ],
  };

  const taskSerivce = {
    getTask: () => ({
      id: 1,
      description: "Test Task",
      assigneeId: 1,
      completed: false,
    }),
    getData: () => of(mockDate),
    showError: () => of({}),
    showSuccess: () => of({}),
  };

  const backendServiceSpy = {
    users: () => of([]),
    newTask: () => of([]),
    complete: () => of([]),
    assign: () => of([]),
    task: () =>
      of({
        id: 1,
        title: "Task 1",
        description: "Description 1",
        completed: false,
      }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskDetailComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ActivatedRoute, useValue: routeSpy },
        { provide: Router, useValue: routerSpy },
        { provide: TaskService, useValue: taskSerivce },
        { provide: BackendService, useValue: backendServiceSpy },
        FormBuilder,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDetailComponent);
    component = fixture.componentInstance;
    component.users = [
      { id: 1, name: "User 1" },
      { id: 2, name: "User 1" },
    ];
    component.task = {
      id: 1,
      assigneeId: 1,
      description: "Description 1",
      completed: false,
    };

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should create task error", () => {
    component.id = "";
    spyOn(taskSerivce, "showError");
    spyOn(backendServiceSpy, "newTask").and.returnValue(
      throwError(() => ({ status: 400 }))
    );
    component.addTask();
    expect(taskSerivce.showError).toHaveBeenCalled();
  });

  it("should create task success", () => {
    component.id = "";
    spyOn(taskSerivce, "showSuccess");
    spyOn(backendServiceSpy, "newTask").and.returnValue(of({}));
    component.addTask();
    expect(taskSerivce.showSuccess).toHaveBeenCalled();
  });

  it("should navigate to list", () => {
    component.id = "";
    const btnAdd = fixture.debugElement.query(By.css(".back-to-list"));
    btnAdd.triggerEventHandler("click", "");
    expect(routerSpy.navigate).toHaveBeenCalledWith([""]);
  });
});
