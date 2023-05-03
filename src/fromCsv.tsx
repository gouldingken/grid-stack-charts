import { ChartCell, ChartData, ChartRow } from "./components/GridStackChart";
import { DataSet } from './App';

export function fromCsv(dataSets: DataSet[]): ChartData {
    const rows: ChartRow[] = [];
    const mainData = dataSets[0].csvData; //ASSUME the same basic layout
    const columnTitles = [...mainData.headers.slice(1), ...dataSets.filter(d => d.includeRowTotal).map(d => d.title)];

    const rowSumsArr: { [key: string]: number; }[] = [];
    for (let r = 0; r < mainData.data.length; r++) {
        const rowData = mainData.data[r];
        const rowSums: { [key: string]: number; } = {};
        for (let i = 1; i < rowData.length; i++) {
            for (let j = 0; j < dataSets.length; j++) {
                const dataSet = dataSets[j];
                const layerData = dataSet.csvData;
                const layerRowData = layerData.data[r];
                let value = parseFloat(layerRowData[i]);
                if (isNaN(value))
                    value = 0;
                if (dataSet.includeRowTotal) {
                    if (!rowSums[dataSet.id])
                        rowSums[dataSet.id] = 0;
                    rowSums[dataSet.id] += value;
                }
            }
        }
        rowSumsArr[r] = rowSums;
    }
    const maxValues: { [key: string]: number; } = {};
    for (let rs of rowSumsArr) {
        for (let k in rs) {
            if (!maxValues[k]) {
                maxValues[k] = rs[k];
            } else {
                maxValues[k] = Math.max(rs[k], maxValues[k]);
            }
        }
    }

    for (let r = 0; r < mainData.data.length; r++) {
        const rowData = mainData.data[r];
        const row: ChartRow = { cells: [], title: rowData[0] };
        rows.push(row);
        const rowSums: { [key: string]: number; } = {};
        for (let i = 1; i < rowData.length; i++) {
            const cell: ChartCell = { values: [] };
            row.cells.push(cell);
            let sum = 0;
            for (let j = 0; j < dataSets.length; j++) {
                const dataSet = dataSets[j];
                const layerData = dataSet.csvData;
                const layerRowData = layerData.data[r];
                let value = parseFloat(layerRowData[i]);
                if (isNaN(value))
                    value = 0;
                cell.values.push({ value: value, color: dataSet.color });
                sum += value;
                if (dataSet.includeRowTotal) {
                    if (!rowSums[dataSet.id])
                        rowSums[dataSet.id] = 0;
                    rowSums[dataSet.id] += value;
                }
            }
            if (sum < 1) {
                cell.values.push({ value: 1 - sum, color: '#eed37e' });
            }
        }
        for (let d of dataSets.filter(d => d.includeRowTotal)) {
            const totalCell: ChartCell = { values: [], label: `${Math.round(rowSums[d.id] * 100) / 100}` };
            totalCell.values.push({
                color: d.color,
                value: rowSums[d.id] / maxValues[d.id],
            });
            row.cells.push(totalCell);
        }

    }
    return { rows, columnTitles };
}
