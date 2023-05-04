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
    let sun = 'public/data/planting-bed-4_baseline-with-trees_avgSunlightMatrix.csv';
    //let shadow = './data/planting-bed_baseline-with-trees_avgShadowMatrix.csv';
    let baselineShadow = 'public/data/planting-bed-4_baseline-with-trees_avgBaselineShadowMatrix.csv';
    let newShadowAll = 'public/data/planting-bed-4_baseline-with-trees_avgNewShadowMatrix.csv';
    //let newShadowBldg = './data/';

    const csvDataSun = await fetchAndParseCSV(sun);
    // const csvDataShadow = await fetchAndParseCSV(shadow);
    const csvDataBaselineShadow = await fetchAndParseCSV(baselineShadow);
    const csvDataNewShadowAll = await fetchAndParseCSV(newShadowAll);
    // const csvDataNewShadowBldg = await fetchAndParseCSV(newShadowBldg);
    const csvDataNewShadowTree = await fetchAndParseCSV('public/data/planting-bed-4_baseline-with-trees_avgNewShadowMatrix.csv');

    return fromCsv([
        {id: 'sun', title: 'Sun', color:'#ffffff',csvData: csvDataSun, includeRowTotal: false},
        //{id: 'shadow', title: 'Shadow', color:'#3687C0',csvData: csvDataShadow, includeRowTotal: true},
        {id: 'existing', title: 'Existing', color:'#3687C0',csvData: csvDataBaselineShadow, includeRowTotal: true},
        //{id: 'new', title: 'New', color:'#37a364',csvData: csvDataNewShadowAll, includeRowTotal: true},      
        //{id: 'newBldg', title: 'Towers', color:'#8A5DAA',csvData: csvDataNewShadowBldg, includeRowTotal: true},     
        {id: 'newTree', title: 'Trees', color:'#37a364',csvData: csvDataNewShadowTree, includeRowTotal: true},         
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
