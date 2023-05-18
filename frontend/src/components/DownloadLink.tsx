import {ReactNode} from "react";

interface DownloadButtonProps {
  blob: Blob;
  filename?: string;
  children?: ReactNode
}

export default ({blob, filename, children}: DownloadButtonProps) => {
  const downloadUrl = URL.createObjectURL(blob);

  return <a download={filename ?? true} href={downloadUrl} className="rounded-lg">{children} </a>;
}