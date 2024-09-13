import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Task, User } from "../backend.service";
import { TaskService } from "../service/task-service.service";
import { TABLE_DTO, FilterType, TASK_STATUS, TaskDto } from "../models";

@Component({
  selector: "app-list-task",
  templateUrl: "./list-task.component.html",
})
export class ListTaskComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  tasks: TaskDto[] = [];
  tasksCopy: TaskDto[] = [];
  users: User[] = [];
  TableTto = TABLE_DTO;
  taskStatus = TASK_STATUS;
  FilterType: FilterType;

  constructor(
    private router: Router,
    private taskService: TaskService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.taskService
      .getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.tasks = this.tasksCopy =
            data?.tasks?.map((element: Task) => ({
              ...element,
              assignee: data?.users?.find(
                (user) => user?.id === element.assigneeId
              )?.name,
            })) || [];
          this.users = data?.users || [];
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  add(): void {
    this.router.navigate(["/detail"]);
  }

  navigateToDetails(id: string): void {
    this.router.navigate(["/detail", id]);
  }

  filterByUserId(userId: number): void {
    this.tasks = this.tasksCopy.filter((task) => task.assigneeId === userId);
    this.cd.detectChanges();
  }

  filterByStatus(status = false): void {
    this.tasks = this.tasksCopy.filter((task) => task.completed === status);
    this.cd.detectChanges();
  }

  clearSearch():void {
    this.tasks = this.tasksCopy;
    this.cd.detectChanges();
  }
}
