import { ActionPanel, Detail, useNavigation } from "@raycast/api";
import { useEffect, useState } from "react";
import formatTemplate from "./work-detail-template.md";
import { humanizeDuration } from "../duration";
import { loggerApi } from "../logger";
import { Work, WorkId, WorkDetails, RawWorkDetails, WorkDetailState } from "../types";

export default function WorkDetailsPage(props: { work: Work }) {
  const [state, setState] = useState<WorkDetailState>({
    isLoading: true,
    details: {},
  });

  const { pop } = useNavigation();

  useEffect(() => {
    if (!state.isLoading) {
      return;
    }

    getWork(props.work.id)
      .then(details => {
        setState({isLoading: false, details})
      });
  }, [state]);

  const workNotes = () => {
    return state.details.notes?.trim()?.length
      ? state.details.notes
      : 'No description';
  }

  return (
    <Detail
      navigationTitle="Work Details"
      isLoading={state.isLoading}
      markdown={formatTemplate({
        workTitle: props.work.title,
        workNotes: workNotes(),
        workTotalDuration: humanizeDuration(state.details.totalDuration || 0, props.work.isDayLogging || false),
        workTotalSum: (state.details.totalSum || 0).toLocaleString('fi', { style: 'currency', currency: 'EUR' }),
        workOwner: state.details.user?.name
      })}
      actions={<ActionPanel>
        <ActionPanel.Item title="Return" onAction={pop} shortcut={{ modifiers: ['cmd'], key: 'i' }} />
      </ActionPanel>}
    />
  );
}

export async function getWork(work: WorkId): Promise<WorkDetails> {
  const result = await loggerApi.get(`api/works/${work}`);

  const mapResult = async (work: RawWorkDetails): Promise<WorkDetails> => ({
    notes: work.notes,
    totalDuration: work.totalDuration,
    totalSum: work.totalSum,
    user: { ...work.user },
  });

  return mapResult(result.data);
}