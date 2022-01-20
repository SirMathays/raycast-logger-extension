import { ActionPanel, Color, Icon, List } from "@raycast/api";
import { humanizeDuration } from "../duration";
import { DeleteTaskAction, PushToAddTaskAction, TaskProps } from "./actions";

export default function TaskListItem(props: TaskProps): JSX.Element {
  const userName = props.task.user?.name?.split(' ')[0];
  const duration = humanizeDuration(props.task.duration, props.work.isDayLogging);

  const icon = () => {
    return props.highlight ? Icon.Star : Icon.Dot;
  }

  const iconColor = () => {
    if (props.highlight) return Color.Orange;

    return props.task.isOwner ? Color.Green : Color.SecondaryText;
  }

  return (
    <List.Item
      key={props.task.id}
      icon={{ source: icon(), tintColor: iconColor() }}
      title={props.task.description}
      subtitle={userName}
      accessoryTitle={duration}
      accessoryIcon={Icon.Clock}
      actions={props.task.isOwner && <ActionPanel>
        <ActionPanel.Section>
          <PushToAddTaskAction
            icon={Icon.Pencil}
            title="Edit Task"
            work={props.work}
            task={props.task}
            onAction={props.onAction}
          />
        </ActionPanel.Section>
        <ActionPanel.Section>
          <DeleteTaskAction
            task={props.task}
            onAction={props.onAction}
          />
        </ActionPanel.Section>
      </ActionPanel>}
    />
  )
}