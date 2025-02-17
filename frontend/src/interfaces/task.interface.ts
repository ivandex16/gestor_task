export interface ITask {
  _id?: string;
  title: string;
  description: string;
  status: string;
  tags: any[];
}

export type OptionalTask = Partial<ITask>;
