import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { BackendService, Task, User } from "../backend.service";
import { BehaviorSubject, forkJoin, Observable, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { DataDto } from "../models";

@Injectable({ providedIn: "root" })
export class TaskService {
  constructor(private toastr: ToastrService, private backend: BackendService) {}

  tasks$ = new BehaviorSubject<Task[]>(null);
  users$ = new BehaviorSubject<User[]>(null);
  data$ = new BehaviorSubject<DataDto>(null);

  initializeApp() {
    return forkJoin([this.loadTasks(), this.loadUsers()]).toPromise();
  }

  showError(message: string): void {
    this.toastr.error(message);
  }

  showSuccess(message: string): void {
    this.toastr.success(message);
  }

  showInfo(message: string): void {
    this.toastr.warning(message);
  }

  loadTasks(): Observable<Task[]> {
    console.log("loadTasks start");
    return this.backend.tasks().pipe(
      tap({
        next: (tasks) => {
          console.log("loadTasks success");
          if (tasks.length > 0) {
            this.tasks$.next(tasks);
          }
        },
      }),
      catchError(() => {
        this.showError("Failed to load tasks");
        return of(null);
      })
    );
  }

  loadUsers(): Observable<User[]> {
    console.log("loadUsers start");
    return this.backend.users().pipe(
      tap({
        next: (users) => {
          console.log("loadUsers success");
          if (users.length > 0) {
            this.users$.next(users);
          }
        },
      }),
      catchError(() => {
        this.showError("Failed to load users");
        return of(null);
      })
    );
  }

  loadData(): Observable<DataDto> {
    return forkJoin({
      users: this.backend.users(),
      tasks: this.backend.tasks(),
    }).pipe(
      tap({
        next: ({ users, tasks }) => {
          if (users && tasks) {
            this.data$.next({ users, tasks });
          }
        },
      }),
      catchError(() => {
        this.showError("Failed to load data");
        return of(null);
      })
    );
  }

  getData(): Observable<DataDto> {
    return this.data$.asObservable();
  }

  getTasks(): Observable<Task[] | []> {
    return this.tasks$.asObservable();
  }

  getUsers(): Observable<User[] | []> {
    return this.users$.asObservable();
  }
}
