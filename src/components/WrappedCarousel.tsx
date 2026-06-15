import { useEffect, useRef, useState } from "react";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { TbChevronLeft, TbChevronRight, TbRefresh } from "react-icons/tb";
import OverviewCard from "./cards/OverviewCard";
import StationsCard from "./cards/StationsCard";
import RoutesCard from "./cards/RoutesCard";
import HabitsCard from "./cards/HabitsCard";
import DownloadButton from "./DownloadButton";
import { CARD_H, CARD_W } from "./cards/cardBase";
import { palette, radius } from "../theme";
import type { WrappedStats } from "../lib/types";

interface CardDef {
  key: string;
  filename: string;
  render: (ref: React.RefObject<HTMLDivElement>, stats: WrappedStats) => React.ReactNode;
}

const CARDS: CardDef[] = [
  {
    key: "overview",
    filename: "septa-wrapped-overview.png",
    render: (ref, stats) => <OverviewCard ref={ref} stats={stats} />,
  },
  {
    key: "stations",
    filename: "septa-wrapped-stations.png",
    render: (ref, stats) => <StationsCard ref={ref} stats={stats} />,
  },
  {
    key: "routes",
    filename: "septa-wrapped-routes.png",
    render: (ref, stats) => <RoutesCard ref={ref} stats={stats} />,
  },
  {
    key: "habits",
    filename: "septa-wrapped-habits.png",
    render: (ref, stats) => <HabitsCard ref={ref} stats={stats} />,
  },
];

interface WrappedCarouselProps {
  stats: WrappedStats;
  warnings: string[];
  onReset: () => void;
}

export default function WrappedCarousel({ stats, warnings, onReset }: WrappedCarouselProps) {
  const [index, setIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const cardRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const avail = (wrapRef.current?.clientWidth ?? CARD_W) - 8;
      setScale(Math.min(1, avail / CARD_W));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const go = (dir: number) => {
    setIndex((i) => (i + dir + CARDS.length) % CARDS.length);
  };

  const active = CARDS[index];

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        background: "radial-gradient(120% 120% at 50% 0%, #1d1d1d 0%, #0a0a0a 60%)",
        py: 4,
        px: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: "100%", maxWidth: 520, mb: 2 }}>
        <Typography sx={{ color: palette.white, fontWeight: 900, fontSize: 22 }}>
          SEPTA Wrapped
        </Typography>
        <Button
          onClick={onReset}
          startIcon={<TbRefresh />}
          sx={{ color: "rgba(255,255,255,0.8)" }}
        >
          Start over
        </Button>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ width: "100%", maxWidth: 520, justifyContent: "center" }}
      >
        <IconButton
          onClick={() => go(-1)}
          aria-label="Previous card"
          sx={{ color: palette.white, bgcolor: "rgba(255,255,255,0.08)", "&:hover": { bgcolor: "rgba(255,255,255,0.18)" } }}
        >
          <TbChevronLeft />
        </IconButton>

        <Box
          ref={wrapRef}
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: CARD_W * scale,
              height: CARD_H * scale,
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                borderRadius: radius.lg,
                overflow: "hidden",
                boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
              }}
            >
              {active.render(cardRef, stats)}
            </Box>
          </Box>
        </Box>

        <IconButton
          onClick={() => go(1)}
          aria-label="Next card"
          sx={{ color: palette.white, bgcolor: "rgba(255,255,255,0.08)", "&:hover": { bgcolor: "rgba(255,255,255,0.18)" } }}
        >
          <TbChevronRight />
        </IconButton>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        {CARDS.map((c, i) => (
          <Box
            key={c.key}
            onClick={() => setIndex(i)}
            sx={{
              width: i === index ? 26 : 9,
              height: 9,
              borderRadius: 999,
              bgcolor: i === index ? palette.yellow : "rgba(255,255,255,0.3)",
              cursor: "pointer",
              transition: "all 150ms ease",
            }}
          />
        ))}
      </Stack>

      <Box sx={{ mt: 2.5 }}>
        <DownloadButton targetRef={cardRef} filename={active.filename} />
      </Box>

      {warnings.length > 0 && (
        <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: 12, mt: 2, textAlign: "center", maxWidth: 420 }}>
          {warnings.join(" ")}
        </Typography>
      )}
    </Box>
  );
}
