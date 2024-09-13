export const TABLE_DTO = [
  { title: "Id", field: "id" },
  { title: "Description", field: "description" },
  { title: "Assignee", field: "assignee" },
  { title: "Status", field: "completed" },
];

export const TASK_STATUS = [
  { value: true, label: "Completed" },
  { value: false, label: "To do" },
];

export enum FilterType {
  STATUS = "STATUS",
  USER = "USER",
}
