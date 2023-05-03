import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.scss'
import { ChartCell, ChartData, ChartRow, GridStackChart } from "./components/GridStackChart";
import { CsvData, downloadSVG, fetchAndParseCSV } from "./functions";
import { SvgDownloadable } from "./components/SvgDownloadable";

const colors = [
    '#0d56a9',
    '#2582bd',
    '#53e6f3',
];

function fromCsv(csvDataFiles:CsvData[], colors:string[]): ChartData {
    const rows: ChartRow[] = [];
    const mainData = csvDataFiles[0];//ASSUME the same basic layout
    const columnTitles = mainData.headers.slice(1);//skip the row title cell
    const rowSums: {[key:string]:number} = {};
    for (let r = 0; r < mainData.data.length; r++) {
        const rowData = mainData.data[r];
        const row: ChartRow = { cells: [], title: rowData[0] };
        rows.push(row);
        for (let i = 1; i < rowData.length; i++) {
            const cell: ChartCell = { values: [] };
            row.cells.push(cell);
            let sum = 0;
            for (let j = 0; j < csvDataFiles.length; j++) {
                const layerData = csvDataFiles[j];//ASSUME the same basic layout
                const layerRowData = layerData.data[r];
                let value = parseFloat(layerRowData[i]);
                cell.values.push({ value: value, color: colors[j] });
                sum += value;
            }
            if (sum < 1) {
                cell.values.push({ value: 1-sum, color: '#eed37e' });
            }
        }

    }
    return { rows, columnTitles };
}

function mockData(): ChartData {
    const rows: ChartRow[] = [];
    const columnTitles: string[] = [];
    for (let i = 0; i < 20; i++) {
        columnTitles.push(i + ':00');
    }
    for (let r = 0; r < 20; r++) {
        const row: ChartRow = { cells: [], title: 'ROW ' + r };
        rows.push(row);
        for (let c = 0; c < columnTitles.length; c++) {
            const cell: ChartCell = { values: [] };
            row.cells.push(cell);
            for (let v = 0; v < colors.length; v++) {
                cell.values.push({ value: Math.random(), color: colors[v] });
            }
        }
    }
    return { rows, columnTitles };
}

//TODO move this to a JSON spec file so Katya and Scott can run this
//or better yet, find a cloud based IDE
async function grabData() {
    let dark = './data/dark.csv';
    let file1 = './data/upper-canopy_all-towers-without-trees_avgBaselineShadowMatrix.csv';
    let file2 = './data/upper-canopy_all-towers-without-trees_avgNewShadowMatrix.csv';
    let file3 = './data/upper-canopy_all-towers-without-trees_avgShadowMatrix.csv';

    const csvDataDark = await fetchAndParseCSV(dark);
    const csvData1 = await fetchAndParseCSV(file1);
    const csvData2 = await fetchAndParseCSV(file2);
    // const csvData3 = await fetchAndParseCSV(file3);

    return fromCsv([
        csvDataDark,
        csvData1,
        csvData2,
    ], [
        '#4a535b',
        '#56a3d3',
        '#9060ff']);
}

function App() {
    const [data, setData] = useState<ChartData>(mockData())

    grabData().then(chartData => setData(chartData))

    return (
        <div className="App">
            <SvgDownloadable fileName={'gridChart.svg'}>
                <GridStackChart data={data} rowHeight={24} cellWidth={80} cellMax={1}/>
            </SvgDownloadable>
        </div>
    )
}

export default App
