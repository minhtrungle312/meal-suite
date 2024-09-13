import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ListTaskComponent } from "./list-task.component";
import { Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { of } from "rxjs";
import { By } from "@angular/platform-browser";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { TaskService } from "../service/task-service.service";

describe("ListTaskComponent", () => {
  let component: ListTaskComponent;
  let fixture: ComponentFixture<ListTaskComponent>;

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

  const taskServiceSpy = {
    getTasks: () =>
      Promise.resolve([
        {
          id: 1,
          title: "Task 1",
          description: "Description 1",
          completed: false,
        },
      ]),
    getUsers: () =>
      Promise.resolve([
        { id: 1, name: "User 1" },
        { id: 2, name: "User 2" },
      ]),
    getData: () => of(mockDate),
  };

  const routerSpy = {
    navigate: jasmine.createSpy("navigate"),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListTaskComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: Router, useValue: routerSpy },
        FormBuilder,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTaskComponent);
    component = fixture.componentInstance;
    component.users = [
      { id: 1, name: "User 1" },
      { id: 2, name: "User 1" },
    ];
    component.tasks = [
      {
        id: 1,
        assigneeId:1,
        description: "Description 1",
        completed: false,
      }
    ]
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call add new task", () => {
    const btnAdd = fixture.debugElement.query(By.css(".text-white"));
    btnAdd.triggerEventHandler("click", "");
    expect(routerSpy.navigate).toHaveBeenCalledWith(["/detail"]);
  });

  it("should call navigate to detail", () => {
    component.navigateToDetails("1");
    expect(routerSpy.navigate).toHaveBeenCalledWith(["/detail", "1"]);
  });
});
