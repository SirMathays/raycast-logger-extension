import { ActionPanelItem, Icon, PushAction, Toast, ToastStyle } from "@raycast/api"
import AddTask from "./TaskForm"
import TaskIndex from "./TaskIndex"
import { StateController, Task, TaskId, Work } from "../types"
import WorkDetailsPage from "./WorkDetailsPage"
import { loggerApi } from "../logger"

export type WorkProps = { work: Work, onAction: StateController };
export type TaskProps = WorkProps & { task: Task, highlight: boolean };
export type TaskFormProps = WorkProps & { task?: Task };

export const PushToTaskIndexAction = (props: WorkProps) => {
  return <PushAction
    icon={Icon.List}
    title="List Tasks"
    target={<TaskIndex
      work={props.work}
      onAction={props.onAction}
    />}
  />
}

export const PushToAddTaskAction = (props: TaskFormProps & { icon?: Icon, title?: string }) => {
  return <PushAction
    icon={props.icon || Icon.Plus}
    title={props.title || "Add a Task"}
    target={<AddTask
      navigationTitle={props.title}
      work={props.work}
      task={props.task}
      onAction={props.onAction}
    />}
  />
}

export const PushToShowDetailsAction = (props: WorkProps) => {
  return <PushAction
    icon={Icon.QuestionMark}
    title="Show Work Details"
    target={<WorkDetailsPage work={props.work} />}
    shortcut={{ modifiers: ['cmd'], key: 'i' }}
  />
}

export const DeleteTaskAction = (props: {task: Task, onAction: StateController}) => {
  return <ActionPanelItem
    icon={Icon.Trash}
    title="Delete Task"
    shortcut={{ modifiers: ["cmd", "shift"], key: "d" }}
    onAction={() => {
      deleteTask(props.task.id).then(() => props.onAction());
    }}
  />

  async function deleteTask(task: TaskId) {
    const toast = new Toast({ title: 'Delete Task', style: ToastStyle.Animated });
    toast.show();
    const result = await loggerApi.delete(`api/tasks/${task}`);

    toast.style = ToastStyle.Success;
    toast.message = result.data.message;

    return task;
  }
}