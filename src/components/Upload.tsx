import { useCallback, useRef, useState } from "react";
import { Box, Button, Stack, Typography, Alert, CircularProgress } from "@mui/material";
import { TbUpload, TbFileText } from "react-icons/tb";
import SeptaLogo from "./SeptaLogo";
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
        setError("Couldn't read that file.");
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
        setError("That file didn't load. Try again.");
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
        background: palette.ink,
      }}
    >
      <Stack spacing={3} sx={{ width: "100%", maxWidth: 520 }} alignItems="center">
        <SeptaLogo height={36} />

        <Stack spacing={1} alignItems="center" textAlign="center">
          <Typography variant="h3" sx={{ color: palette.white, fontSize: { xs: 34, sm: 44 } }}>
            SEPTA Wrapped
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.65)", maxWidth: 380, fontSize: 15 }}>
            Trip history CSV from SEPTA Key.
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
            <Typography sx={{ color: palette.white, fontWeight: 600 }}>
              Drop CSV here
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
              or click to choose a file
            </Typography>
          </Stack>
        </Box>

        <Button
          variant="text"
          startIcon={<TbFileText />}
          onClick={loadSample}
          sx={{ color: palette.yellow }}
        >
          Try sample data
        </Button>

        {error && (
          <Alert severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        )}

        <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: 12, textAlign: "center" }}>
          Nothing leaves this device.
        </Typography>
      </Stack>
    </Box>
  );
}
