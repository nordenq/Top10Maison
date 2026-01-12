import { buildDataIndex } from "./data";

const dataIndex = buildDataIndex();

export function getDataIndex() {
  return dataIndex;
}

export { dataIndex };
