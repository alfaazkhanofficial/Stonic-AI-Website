# The `public/media/` folder (screenshots + installer)

Drop files here (in the repo). They are detected automatically at build time. Nothing else to edit.

| What                                    | File types                                     | Effect                                                                                                         |
| --------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Installer                               | `.exe .msi .dmg .pkg .zip .deb .rpm .AppImage` | Download buttons turn on. Size, SHA-256 and version (from the file name) are shown on /releases and /download. |
| Screenshots / recordings of the real UI | `.png .jpg .webp .avif .gif .mp4 .webm`        | Shown in "The actual application" on the homepage.                                                             |

Name installers with the version: `STONIC-Setup-1.0.0.exe`. It is matched to release `1.0.0` in `src/content/releases.ts`; add a new entry there for each new version.
Until an installer is present, every Download button is **greyed and disabled** (with a plain-text explanation).
