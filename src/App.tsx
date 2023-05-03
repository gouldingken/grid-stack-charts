import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.scss'
import { ChartCell, ChartData, ChartRow, GridStackChart } from "./components/GridStackChart";
import { CsvData, downloadSVG, fetchAndParseCSV } from "./functions";
import { SvgDownloadable } from "./components/SvgDownloadable";
import { fromCsv } from './fromCsv';

const colors = [
    '#0d56a9',
    '#2582bd',
    '#53e6f3',
];

export type DataSet = {
    id: string,
    title: string,
    csvData: CsvData;
    color: string;
    includeRowTotal: boolean
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
        {id: 'dark', title: '', color:'#4a535b',csvData: csvDataDark, includeRowTotal: false},
        {id: 'existing', title: 'Existing', color:'#56a3d3',csvData: csvData1, includeRowTotal: true},
        {id: 'new', title: 'New', color:'#9060ff',csvData: csvData2, includeRowTotal: true},         
    ]);
}

function App() {
    const [data, setData] = useState<ChartData>(mockData())

    useEffect(()=> {
        grabData().then(chartData => setData(chartData))
    }, [])    

    return (
        <div className="App">
            <SvgDownloadable fileName={'gridChart.svg'}>
                <GridStackChart data={data} rowHeight={24} cellWidth={60} cellMax={1}/>
            </SvgDownloadable>
        </div>
    )
}

export default App
