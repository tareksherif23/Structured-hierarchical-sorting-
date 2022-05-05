/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';

export const loadDataFromFile = (fileName: string, delimiter: string) => {
  const rows: string[][] = [];
  const objArray = [];

  const data: string = fs.readFileSync(fileName, 'utf8').toString();
  const dataRows: string[] = data.split('\r\n');
  dataRows.map(row => rows.push(row.split(delimiter)));

  const headers: string[] = rows[0];
  const m_idx: number = headers
    .map(h => h.startsWith('property'))
    .indexOf(false);
  objArray.push(headers);
  for (let i = 1; i < rows.length; i++) {
    const data: string[] = rows[i];
    const obj: any = {path: rows[i].slice(0, m_idx), metrics: {}};
    for (let j = m_idx; j < data.length; j++) {
      obj.metrics[headers[j]] = data[j];
    }
    objArray.push(obj);
  }
  return objArray;
};
