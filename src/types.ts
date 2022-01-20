import { Dayjs } from "dayjs"

export type StateController = (ids?: Ids) => void;
export type WorkListState = { isLoading: boolean, works: Work[], updated?: Ids };
export type TaskListState = { isLoading: boolean, tasks: Task[], updated?: Ids };
export type WorkDetailState = { isLoading: boolean, details: WorkDetails };

export type WorkId = number;
export type TaskId = number;
export type Ids = { taskId: TaskId, workId: WorkId };

export type User = {
  id?: number,
  name?: string,
};

export type Work = {
  id: WorkId,
  title: string,
  isDayLogging: boolean,
  rate: number,
  updatedAt: Dayjs
};

export type WorkDetails = {
  notes?: string,
  totalDuration?: number,
  totalSum?: number,
  user?: User
}

export type Task = {
  description: string,
  duration: number,
  id: TaskId,
  isOwner: boolean,
  rate: number,
  timestamp: Dayjs,
  user?: User,
};

/**
 * Raw types
 */

export type RawTask = {
  description: string,
  duration: number,
  id: TaskId,
  isOwner: boolean
  rate: number,
  sum: number,
  timestamp: string,
  user: User,
  workId: WorkId,
};

export type RawWork = {
  id: WorkId,
  isDayLogging: boolean,
  name: string,
  rate: number,
  budget: number,
  updatedAt: string,
  notes?: string,
  totalDuration?: number,
  totalSum?: number,
  user?: User
};

export type RawWorkDetails = {
  id: WorkId,
  isDayLogging: boolean,
  name: string,
  rate: number,
  budget: number,
  updatedAt: string,
  notes: string,
  totalDuration: number,
  totalSum: number,
  user: User
}