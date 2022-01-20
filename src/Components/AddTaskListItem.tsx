import { ActionPanel, Color, Icon, List } from "@raycast/api";
import { PushToAddTaskAction, WorkProps } from "./actions";

export default function AddTaskListItem(props: WorkProps): JSX.Element {
  return (
    <List.Item icon={{ source: Icon.Plus, tintColor: Color.Green }} title="Add a Task" actions={
      <ActionPanel>
        <PushToAddTaskAction work={props.work} onAction={props.onAction} />
      </ActionPanel>
    }/>
  )
}