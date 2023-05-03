import { useCallback, useRef } from "react";

function downloadBlob(blob: any, filename: string) {
    const objectUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
}

type SvgDownloadableProps = {
    fileName: string,
    children?: React.ReactNode;
};
export const SvgDownloadable = ({ fileName, children }: SvgDownloadableProps) => {
    const svgRef = useRef<HTMLDivElement>(null);

    const downloadSVG = useCallback(() => {
        const svg = svgRef.current!.innerHTML;
        const blob = new Blob([svg], { type: "image/svg+xml" });
        downloadBlob(blob, fileName);
    }, []);

    return <div className={'SvgDownloadable'}>
        <div ref={svgRef}>
            {children}
        </div>
        <button onClick={downloadSVG}>Download</button>
    </div>
};
