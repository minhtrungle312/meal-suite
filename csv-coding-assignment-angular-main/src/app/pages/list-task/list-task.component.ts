import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Task, User } from "../../backend.service";
import { FilterType, TABLE_DTO, TASK_STATUS, TaskDto } from "../../models";
import { TaskService } from "../../service/task-service.service";

@Component({
  selector: "app-list-task",
  templateUrl: "./list-task.component.html",
})
export class ListTaskComponent implements OnInit, OnDestroy {
  readonly TableTto = TABLE_DTO;
  readonly taskStatus = TASK_STATUS;
  destroy$ = new Subject<void>();
  tasks: TaskDto[] = [];
  tasksCopy: TaskDto[] = [];
  users: User[] = [];
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

  clearSearch(): void {
    this.tasks = this.tasksCopy;
    this.cd.detectChanges();
  }
}
