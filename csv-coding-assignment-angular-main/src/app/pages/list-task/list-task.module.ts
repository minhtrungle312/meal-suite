import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { NgSelectModule } from "@ng-select/ng-select";
import { ListTaskComponent } from "./list-task.component";

const routes: Routes = [{ path: "", component: ListTaskComponent }];
@NgModule({
  declarations: [ListTaskComponent],
  imports: [
    RouterModule.forChild(routes),
    NgSelectModule,
    NgSelectModule,
    FormsModule,
    CommonModule,
  ],
  providers: [],
})
export class ListTaskModule {}
