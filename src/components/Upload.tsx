import { useCallback, useRef, useState } from "react";
import { Box, Button, Stack, Typography, Alert, CircularProgress } from "@mui/material";
import { TbUpload, TbFileText } from "react-icons/tb";
import { METRO_LINES } from "../lib/septa";
import { palette, radius } from "../theme";
import { parseTripsCsv } from "../lib/parseCsv";
import type { Trip } from "../lib/types";

interface UploadProps {
  onTrips: (trips: Trip[], warnings: string[]) => void;
}

export default function Upload({ onTrips }: UploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleText = useCallback(
    (text: string) => {
      const { trips, errors } = parseTripsCsv(text);
      if (trips.length === 0) {
        setError(errors[0] ?? "Could not read this file.");
        return;
      }
      setError(null);
      onTrips(trips, errors);
    },
    [onTrips],
  );

  const handleFile = useCallback(
    (file: File) => {
      if (!file.name.toLowerCase().endsWith(".csv")) {
        setError("Please upload a .csv file exported from SEPTA Key.");
        return;
      }
      setLoading(true);
      const reader = new FileReader();
      reader.onload = () => {
        setLoading(false);
        handleText(String(reader.result ?? ""));
      };
      reader.onerror = () => {
        setLoading(false);
        setError("Something went wrong reading that file. Try again.");
      };
      reader.readAsText(file);
    },
    [handleText],
  );

  const loadSample = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/sample-trips.csv");
      if (!res.ok) throw new Error("not ok");
      const text = await res.text();
      setLoading(false);
      handleText(text);
    } catch {
      setLoading(false);
      setError("Couldn't load the sample file.");
    }
  }, [handleText]);

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        background:
          "radial-gradient(120% 120% at 50% 0%, #1d1d1d 0%, #0a0a0a 60%)",
      }}
    >
      <Stack spacing={3} sx={{ width: "100%", maxWidth: 520 }} alignItems="center">
        <Stack spacing={1.5} alignItems="center">
          <Stack direction="row" spacing={0.5} sx={{ borderRadius: 1, overflow: "hidden" }}>
            {Object.values(METRO_LINES).map((line) => (
              <Box
                key={line.id}
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: line.color,
                  color: line.textColor,
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 900,
                  fontSize: 20,
                }}
              >
                {line.letter}
              </Box>
            ))}
          </Stack>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.55)",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            SEPTA Metro
          </Typography>
        </Stack>

        <Stack spacing={1} alignItems="center" textAlign="center">
          <Typography variant="h3" sx={{ color: palette.white, fontSize: { xs: 34, sm: 44 } }}>
            SEPTA Wrapped
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.7)", maxWidth: 420 }}>
            Upload your SEPTA Key trip history and get a shareable recap of your
            year of riding. Everything stays in your browser.
          </Typography>
        </Stack>

        <Box
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
          }}
          onClick={() => inputRef.current?.click()}
          sx={{
            width: "100%",
            border: "2px dashed",
            borderColor: dragging ? palette.yellow : "rgba(255,255,255,0.25)",
            bgcolor: dragging ? "rgba(245,197,24,0.08)" : "rgba(255,255,255,0.03)",
            borderRadius: radius.lg,
            p: 5.5,
            textAlign: "center",
            cursor: "pointer",
            transition: "all 120ms ease",
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
          <Stack spacing={1.5} alignItems="center">
            {loading ? (
              <CircularProgress size={32} sx={{ color: palette.yellow }} />
            ) : (
              <TbUpload size={36} color={palette.white} />
            )}
            <Typography sx={{ color: palette.white, fontWeight: 700 }}>
              Drag &amp; drop your CSV here
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: 14 }}>
              or click to browse
            </Typography>
          </Stack>
        </Box>

        <Button
          variant="text"
          startIcon={<TbFileText />}
          onClick={loadSample}
          sx={{ color: palette.yellow }}
        >
          Try it with sample data
        </Button>

        {error && (
          <Alert severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        )}

        <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: 12, textAlign: "center" }}>
          No account, no upload to any server. Your file is read locally and
          cached only in your browser.
        </Typography>
      </Stack>
    </Box>
  );
}
