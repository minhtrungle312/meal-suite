import { Task, User } from "../backend.service";

export interface TaskDto extends Task {
  assigneeName?: string;
}

export interface DataDto {
  tasks: Task[];
  users: User[];
}
