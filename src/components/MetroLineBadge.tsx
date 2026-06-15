import { Box } from "@mui/material";
import type { MetroLineInfo } from "../lib/septa";

interface MetroLineBadgeProps {
  line: MetroLineInfo;
  size?: "sm" | "md" | "lg";
}

const SIZES = { sm: 32, md: 44, lg: 64 } as const;

export default function MetroLineBadge({ line, size = "md" }: MetroLineBadgeProps) {
  const dim = SIZES[size];
  return (
    <Box
      sx={{
        width: dim,
        height: dim,
        bgcolor: line.color,
        color: line.textColor,
        display: "grid",
        placeItems: "center",
        fontWeight: 900,
        fontSize: dim * 0.55,
        lineHeight: 1,
        flexShrink: 0,
      }}
    >
      {line.letter}
    </Box>
  );
}
