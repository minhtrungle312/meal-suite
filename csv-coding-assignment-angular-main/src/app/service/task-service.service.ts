import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { BackendService, Task, User } from "../backend.service";
import { BehaviorSubject, forkJoin, Observable, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { DataDto } from "../models";

@Injectable({ providedIn: "root" })
export class TaskService {
  constructor(private toastr: ToastrService, private backend: BackendService) {}

  data$ = new BehaviorSubject<DataDto>(null);

  showError(message: string): void {
    this.toastr.error(message);
  }

  showSuccess(message: string): void {
    this.toastr.success(message);
  }

  showInfo(message: string): void {
    this.toastr.warning(message);
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
}
