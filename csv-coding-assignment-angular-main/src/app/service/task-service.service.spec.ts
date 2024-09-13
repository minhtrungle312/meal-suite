import { TestBed } from "@angular/core/testing";

import { ToastrService } from "ngx-toastr";
import { of } from "rxjs";
import { BackendService } from "../backend.service";
import { TaskService } from "./task-service.service";

describe("TaskServiceService", () => {
  let service: TaskService;

  const backendServiceSpy = {
    storedTasks: [],
    storedUsers: [],
    lastId: 0,
    tasks() {
      return of([]);
    },
    task() {
      return of(null);
    },
    users() {
      return of([]);
    },
    user() {
      return of(null);
    },
    newTask() {},
    assign() {},
    complete() {},
    update() {},
  };

  const toastrServiceSpy = {
    error: () => {},
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: BackendService, useValue: backendServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
      ],
    });
    service = TestBed.inject(TaskService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
