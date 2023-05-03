import { observer } from "mobx-react-lite";
import { ChartCell } from "./GridStackChart";

const styles = {
    cell: {
        stroke: `black`,
        strokeOpacity: 0.1,
        fill: 'none'
    },
    cellVal: {
        stroke: `black`,
        strokeOpacity: 0.3,
    }
};

export type GridStackCellProps = {
    cell: ChartCell;
    xPos: number;
    rowHeight: number;
    cellWidth: number;
    cellMax: number;
};
export const GridStackCell = observer(({ cell, cellMax, xPos, cellWidth, rowHeight }: GridStackCellProps) => {

    const toX = (val: number) => {
        return cellWidth * val / cellMax;
    };
    let rx = 0;
    const nx = (w: number) => {
        let ox = rx;
        rx += w;
        return ox;
    }

    return <g transform={`translate(${xPos},0)`} className={'GridStackCell'}>
        <rect
            className={'cell'}
            height={rowHeight}
            width={cellWidth}
            style={styles.cell}
        />
        {cell.values.map((v, i) => {
            return <rect
                className={'cell-val'}
                style={styles.cellVal}
                key={i}
                x={nx(toX(v.value))}
                width={toX(v.value)}
                height={rowHeight}
                fill={v.color}/>
        })}

        {cell.label && <text x={4} y={rowHeight/2}  alignmentBaseline="middle">{cell.label}</text>}
    </g>
});
