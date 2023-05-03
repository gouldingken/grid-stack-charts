export function downloadSVG(svgContent:any, fileName:string) {
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = fileName;
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);

    downloadLink.click();

    URL.revokeObjectURL(svgUrl);

    document.body.removeChild(downloadLink);
}

export type CsvData = {
    headers:string[],
    data: string[][]
}
export async function fetchAndParseCSV(url: string): Promise<CsvData> {
    const response = await fetch(url);
    const text = await response.text();

    const rows = text.split('\n').map(row => row.split(','));

    // Remove any empty rows
    const nonEmptyRows = rows.filter(row => row.length > 0);

    // Extract the headers and data
    const headers = nonEmptyRows[0];
    const data = nonEmptyRows.slice(1);

    return {headers, data}

}
