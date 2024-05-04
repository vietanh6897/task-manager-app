export interface ITask {
  id?: string;
  title: string;
  description: string;
  priority: string;
  dueDate: string;
}

export interface ITaskItem extends ITask {
  showDetails: boolean;
  isSelected: boolean;
}
