import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.scss'
import { ChartCell, ChartData, ChartRow, GridStackChart } from "./components/GridStackChart";
import { CsvData, downloadSVG, fetchAndParseCSV } from "./functions";
import { SvgDownloadable } from "./components/SvgDownloadable";
import { fromCsv } from './fromCsv';
import { sunColor, shadowBlue, shadowPurple, shadowGreen, nightColor } from "./functions";

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
    // BASELINE COMBOS
    // orange sun + white shadow (all)
    // white sun + blue shadow (all)
    // white sun + blue bldg shadow + green new tree shade

    // PROPOSED COMBOS
    // 
    
    // baseline
    const dataCanopyBaselineSun = await fetchAndParseCSV('public/data/upper-canopy_baseline-without-trees_avgSunlightMatrix.csv');
    const dataCanopyBaselineShadow = await fetchAndParseCSV('public/data/upper-canopy_baseline-without-trees_avgShadowMatrix.csv');
    
    // N.B. repeat for planting beds 1-6
    const dataPlantingBedBaselineSun = await fetchAndParseCSV('public/data/planting-bed-4_baseline-with-trees_avgSunlightMatrix.csv');
    const dataPlantingBedBaselineAllShadow = await fetchAndParseCSV('public/data/planting-bed-4_baseline-with-trees_avgShadowMatrix.csv');
    const dataPlantingBedBaselineBldgShadow = await fetchAndParseCSV('public/data/planting-bed-4_baseline-with-trees_avgBaselineShadowMatrix.csv');
    const dataPlantingBedBaselineTreeShade= await fetchAndParseCSV('public/data/planting-bed-4_baseline-with-trees_avgNewShadowMatrix.csv');
    const dataPlantingBedBaselineBldgShadowInverse = await fetchAndParseCSV('public/data/planting-bed-4_baseline-with-trees_avgBaselineShadowMatrixInverse.csv');
    const dataPlantingBedBaselineTreeShadeInverse= await fetchAndParseCSV('public/data/planting-bed-4_baseline-with-trees_avgNewShadowMatrixInverse.csv');

    // N.B. repeat for sites 1-10
    const dataCanopyImpactShadow = await fetchAndParseCSV('public/data/planting-bed-4_baseline-with-trees_avgSunlightMatrix.csv');
    const dataCanopyImpactBldgShadow = await fetchAndParseCSV('public/data/planting-bed-4_baseline-with-trees_avgSunlightMatrix.csv');
    const dataCanopyImpactTreeShade = await fetchAndParseCSV('public/data/planting-bed-4_baseline-with-trees_avgSunlightMatrix.csv');
    const dataCanopyImpactSun = await fetchAndParseCSV('public/data/planting-bed-4_baseline-with-trees_avgSunlightMatrix.csv');

    // N.B. sun is always present (to fill out dataset) - sometimes white, sometimes orange

    // // upper canopy - baseline conditions - sunlight
    // return fromCsv([
    //     {id: 'sun', title: 'Sun', color:sunColor, csvData: dataCanopyBaselineSun, includeRowTotal: true},
    //     {id: 'shadow', title: 'Shadow', color:'#ffffff', csvData: dataCanopyBaselineShadow, includeRowTotal: false},
    // ]);

    // // upper canopy - baseline conditions - shadow
    // return fromCsv([
    //     {id: 'sun', title: 'Sun', color:'#ffffff',csvData: dataCanopyBaselineSun, includeRowTotal: false},
    //     {id: 'shadow', title: 'Shadow', color:shadowBlue, csvData: dataCanopyBaselineShadow, includeRowTotal: true},       
    // ]);
    


    // // planting bed - baseline conditions - sunlight
    // return fromCsv([
    //     {id: 'sun', title: 'Sun', color:sunColor,csvData: dataPlantingBedBaselineSun, includeRowTotal: true},
    //     {id: 'shadow', title: 'Shadow', color:'#ffffff', csvData: dataPlantingBedBaselineAllShadow, includeRowTotal: false},
    // ]);
    
    // // planting bed - baseline conditions - all shade + shadow (blue)
    // return fromCsv([
    //     {id: 'sun', title: 'Sun', color:'#ffffff',csvData: dataPlantingBedBaselineSun, includeRowTotal: false},
    //     {id: 'shadow', title: 'Shadow', color:shadowBlue, csvData: dataPlantingBedBaselineAllShadow, includeRowTotal: true},
    // ]);
    // planting bed - baseline conditions - all shade + shadow (purple + green)
    return fromCsv([
        {id: 'sun', title: 'Sun', color:'#ffffff',csvData: dataPlantingBedBaselineSun, includeRowTotal: false},
        {id: 'bldgShadow', title: 'Buildings', color:shadowPurple, csvData: dataPlantingBedBaselineBldgShadow, includeRowTotal: true},
        {id: 'treeShade', title: 'Trees', color:shadowGreen, csvData: dataPlantingBedBaselineTreeShade, includeRowTotal: true},
    ]);

    // // planting bed - baseline conditions - building shadow only - CONSIDER USING SPECIFIC SUNLIGHT DATASET (visually better)
    // return fromCsv([
    //     {id: 'bldgShadow', title: 'Buildings', color:shadowPurple, csvData: dataPlantingBedBaselineBldgShadow, includeRowTotal: true},  
    //     {id: 'nonBldgShadow', title: '', color:'#ffffff', csvData: dataPlantingBedBaselineBldgShadowInverse, includeRowTotal: false},      
    // ]);

    // planting bed - baseline conditions - tree shade only - CONSIDER USING SPECIFIC SUNLIGHT DATASET
    return fromCsv([
        {id: 'treeShade', title: 'Trees', color:shadowGreen, csvData: dataPlantingBedBaselineTreeShade, includeRowTotal: true},  
        {id: 'nonTreeShade', title: '', color:'#ffffff', csvData: dataPlantingBedBaselineTreeShadeInverse, includeRowTotal: false},       
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
