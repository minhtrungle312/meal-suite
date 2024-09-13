import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from "rxjs";
import { finalize, takeUntil } from "rxjs/operators";
import { BackendService, Task, User } from "../backend.service";
import { TaskService } from "../service/task-service.service";

@Component({
  selector: "app-task-detail",
  templateUrl: "./task-detail.component.html",
})
export class TaskDetailComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  id = "";
  addMode = false;
  task!: Task;
  users: User[] = [];
  taskForm = this.formBuilder.group({
    description: ["", [Validators.required]],
    assigneeId: ["", [Validators.required]],
    completed: [false, []],
  });

  get getEnableButton(): boolean {
    return this.taskForm.invalid;
  }

  constructor(
    private route: ActivatedRoute,
    private backendService: BackendService,
    private taskServiceService: TaskService,
    private formBuilder: FormBuilder,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id = this.route?.snapshot?.paramMap?.get("id");
    if (this.id) {
      this.backendService
        .task(Number(this.id))
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => {
            this.cd.detectChanges();
          })
        )
        .subscribe({
          next: (res) => {
            this.task = res;
            this.taskForm.patchValue(this.task);
          },
          error: (err) => {
            this.handleError(err);
          },
        });
    }
    this.taskServiceService
      .getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ users }) => {
        this.users = users;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addTask(): void {
    const { description } = this.taskForm.getRawValue();
    this.backendService
      .newTask({ description })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.taskServiceService.showSuccess("Task added successfully");
          this.backToList();
        },
        error: (err) => {
          this.handleError(err);
        },
      });
  }

  completeTask(): void {
    const { completed } = this.taskForm.getRawValue();
    this.backendService
      .complete(this.task.id, completed)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.taskServiceService.showSuccess("Task completed");
          this.backToList();
        },
        error: (err) => {
          this.handleError(err);
        },
      });
  }

  assignTask(): void {
    const { assigneeId } = this.taskForm.getRawValue();
    this.backendService
      .assign(this.task.id, assigneeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.taskServiceService.showSuccess("Task assigned");
          this.backToList();
        },
        error: (err) => {
          this.handleError(err);
        },
      });
  }

  backToList(): void {
    this.router.navigate([""]);
  }

  private handleError(err: any): void {
    this.taskServiceService.showError(err);
  }
}
