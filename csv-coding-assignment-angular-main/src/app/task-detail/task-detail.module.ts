import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgSelectModule } from "@ng-select/ng-select";
import { TaskDetailComponent } from "./task-detail.component";

@NgModule({
  declarations: [TaskDetailComponent],
  imports: [
    NgSelectModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: ":id",
        component: TaskDetailComponent,
      },
      {
        path: "",
        component: TaskDetailComponent,
      },
    ]),
  ],
})
export class TaskDetailModule {}
