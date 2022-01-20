import { useState, useEffect } from 'react'
import dayjs from "dayjs";
import { loggerApi } from "./logger";
import { Work, RawWork, WorkListState, Ids } from "./types";
import WorkList from "./Components/WorkList";

export default function Main(): JSX.Element {
  const [state, setState] = useState<WorkListState>({
    isLoading: true,
    works: []
  });

  useEffect(() => {
    if (!state.isLoading) {
      return;
    }

    searchWorks({ status: 'ACTIVE', limit: 50 })
      .then(works => {
        setState((oldState) => ({ ...oldState, isLoading: false, works }))
      })
  }, [state]);

  return (
    <WorkList
      isLoading={state.isLoading}
      works={state.works}
      onAction={(ids?: Ids) => setState((oldState) => {
        return { ...oldState, isLoading: true, updated: ids }
      })}
    />
  );
}

export async function searchWorks(params: { status: string, limit: number }): Promise<Work[]> {
  const result = await loggerApi('api/works', { params });

  const mapResult = async (work: RawWork): Promise<Work> => ({
    title: work.name,
    id: work.id,
    isDayLogging: work.isDayLogging,
    rate: work.rate,
    updatedAt: dayjs(work.updatedAt),
  });

  return result.data && result.data.length > 0 ? Promise.all(result.data.map(mapResult)) : [];
}
