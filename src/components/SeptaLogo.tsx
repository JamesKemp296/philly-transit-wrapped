import { Box } from "@mui/material";

interface SeptaLogoProps {
  height?: number;
}

/** SEPTA logo (public domain, from Wikimedia Commons). */
export default function SeptaLogo({ height = 22 }: SeptaLogoProps) {
  return (
    <Box
      component="img"
      src="/septa-logo.svg"
      alt="SEPTA"
      sx={{
        height,
        width: "auto",
        display: "block",
      }}
    />
  );
}
