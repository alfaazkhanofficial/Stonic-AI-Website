import { CopyButton } from "./copy-button";
import { formatBytes, type Installer } from "@/lib/media-scan";

/** Real link when an installer exists; otherwise a greyed, disabled button plus a plain-text reason. */
export function DownloadButton({
  file,
  platform = "Windows",
  size,
}: {
  file?: Installer;
  platform?: string;
  size?: "sm";
}) {
  const cls = `btn primary${size === "sm" ? " sm" : ""}`;
  if (file) {
    return (
      <a
        className={cls}
        href={file.url}
        download={file.external ? undefined : file.name}
        rel="noopener noreferrer"
      >
        Download for {file.platform}
      </a>
    );
  }
  return (
    <button type="button" className={cls} disabled aria-disabled="true">
      Download for {platform}
    </button>
  );
}

export function NotUploadedHint() {
  return (
    <p className="hint-text" role="status">
      The installer isn&apos;t available yet. This button turns on automatically as soon as it is
      published.
    </p>
  );
}

export function InstallerCard({ file }: { file: Installer }) {
  return (
    <div className="card installer">
      <div className="installer-top">
        <div>
          <span className="badge">{file.platform}</span>
          <h3 className="h3" style={{ marginTop: "0.9rem", wordBreak: "break-word" }}>
            {file.name}
          </h3>
          {!file.external && <p className="muted">{formatBytes(file.size)}</p>}
        </div>
        <DownloadButton file={file} />
      </div>
      {file.sha256 && (
        <div className="hash">
          <span className="eyebrow">SHA-256</span>
          <code>{file.sha256}</code>
          <CopyButton text={file.sha256} label="Copy checksum" />
        </div>
      )}
    </div>
  );
}

export function VerifyHelp() {
  return (
    <details className="verify">
      <summary>How to verify your download</summary>
      <p>
        Compare the SHA-256 checksum of the file you downloaded with the value shown above. They
        must match exactly.
      </p>
      <p className="eyebrow" style={{ marginTop: "1rem" }}>
        Windows (PowerShell)
      </p>
      <pre>
        <code>Get-FileHash .\FILE-NAME -Algorithm SHA256</code>
      </pre>
      <p className="eyebrow">macOS / Linux</p>
      <pre>
        <code>shasum -a 256 FILE-NAME</code>
      </pre>
      <p>
        If the values differ, delete the file, download it again from this site and contact support.
      </p>
    </details>
  );
}
