import { useState } from "react";
import type { RefObject } from "react";
import { Button, CircularProgress } from "@mui/material";
import { TbDownload } from "react-icons/tb";
import { toPng } from "html-to-image";
import { palette } from "../theme";

interface DownloadButtonProps {
  targetRef: RefObject<HTMLElement | null>;
  filename: string;
}

export default function DownloadButton({
  targetRef,
  filename,
}: DownloadButtonProps) {
  const [busy, setBusy] = useState(false);

  const handleDownload = async () => {
    const node = targetRef.current;
    if (!node) return;
    setBusy(true);
    try {
      // Render twice: the first pass warms fonts/layout so the exported
      // image is crisp and complete.
      await toPng(node, { pixelRatio: 3, cacheBust: true });
      const dataUrl = await toPng(node, { pixelRatio: 3, cacheBust: true });
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export card image", err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      variant="contained"
      onClick={handleDownload}
      disabled={busy}
      startIcon={
        busy ? (
          <CircularProgress size={16} sx={{ color: palette.ink }} />
        ) : (
          <TbDownload />
        )
      }
      sx={{
        bgcolor: palette.white,
        color: palette.ink,
        "&:hover": { bgcolor: "rgba(255,255,255,0.85)" },
      }}
    >
      {busy ? "Saving…" : "Download image"}
    </Button>
  );
}
