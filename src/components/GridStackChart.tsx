import { observer } from "mobx-react-lite";
import { GridStackCell } from "./GridStackCell";

export type ChartData = {
    columnTitles: string[],
    rows: ChartRow[]
}
export type ChartRow = {
    title?: string,
    cells: ChartCell[]

}
export type ChartCell = {
    values: ChartValue[]

}
export type ChartValue = {
    value: number
    color: string
}

type GridStackRowProps = {
    row: ChartRow;
    yPos: number;
    rowHeight: number;
    cellMax: number;
    cellWidth: number;
};
export const GridStackRow = observer(({ row, yPos, cellWidth, rowHeight, cellMax }: GridStackRowProps) => {
    return <g transform={`translate(0,${yPos})`} className={'GridStackRow'}>
        {row.cells.map(((c, i) => <GridStackCell
            rowHeight={rowHeight} cellWidth={cellWidth} cellMax={cellMax}
            xPos={i * cellWidth}
            cell={c} key={i}
        />))}

    </g>
});

type GridStackChartProps = {
    data: ChartData;
    rowHeight: number;
    cellWidth: number;
    cellMax: number;
};
export const GridStackChart = observer(({ data, rowHeight, cellWidth, cellMax }: GridStackChartProps) => {
    const height = data.rows.length * rowHeight;
    const maxCells = Math.max(...data.rows.map((r) => r.cells.length));
    const width = maxCells * cellWidth;

    const paddingLeft = 120;
    const paddingTop = 30;


    return <svg width={width + paddingLeft} height={height + paddingTop} className={'GridStackChart'}>
        <g transform={`translate(0,${paddingTop})`}>
            {data.rows.map(((r, i) =>
                <text y={(i + 0.5) * rowHeight} alignmentBaseline="middle"
                      key={i}>{r.title}</text>))
            }
        </g>
        <g transform={`translate(${paddingLeft},${paddingTop - 10})`}>
            {data.columnTitles.map(((title, i) =>
                <text x={(i + 0.5) * cellWidth} alignmentBaseline="baseline" textAnchor="middle"
                      key={i}>{title}</text>))
            }
        </g>
        <g transform={`translate(${paddingLeft},${paddingTop})`}>
            {data.rows.map(((r, i) => <GridStackRow
                cellWidth={cellWidth}
                cellMax={cellMax}
                rowHeight={rowHeight}
                yPos={i * rowHeight} row={r}
                key={i}
            />))}
        </g>

    </svg>
});
