import { forwardRef } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { TbArrowsExchange, TbTrain, TbBus, TbBuildingBridge } from "react-icons/tb";
import CardCanvas, { StatBlock } from "./cardBase";
import { palette, pad, radius } from "../../theme";
import type { WrappedStats } from "../../lib/types";

function dateRangeLabel(stats: WrappedStats): string {
  if (!stats.firstTrip || !stats.lastTrip) return "Summary";
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  const a = fmt(stats.firstTrip);
  const b = fmt(stats.lastTrip);
  return a === b ? a : `${a} – ${b}`;
}

const OverviewCard = forwardRef<HTMLDivElement, { stats: WrappedStats }>(
  ({ stats }, ref) => {
    return (
      <CardCanvas ref={ref} background={palette.ink}>
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 700,
            opacity: 0.55,
            mb: 1,
          }}
        >
          {dateRangeLabel(stats)}
        </Typography>

        <Box
          sx={{
            bgcolor: palette.orange,
            color: palette.white,
            borderRadius: radius.md,
            p: pad.tileLg,
            mb: 1.5,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Trips
            </Typography>
            <TbArrowsExchange size={22} />
          </Stack>
          <Typography sx={{ fontWeight: 900, fontSize: 78, lineHeight: 0.95 }}>
            {stats.totalTrips.toLocaleString()}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1.25,
          }}
        >
          <StatBlock
            label="Rail Trips"
            value={stats.railTrips.toLocaleString()}
            bg={palette.blue}
            fg={palette.white}
            icon={<TbTrain size={20} />}
          />
          <StatBlock
            label="Bus Trips"
            value={stats.busTrips.toLocaleString()}
            bg={palette.red}
            fg={palette.white}
            icon={<TbBus size={20} />}
          />
          <StatBlock
            label="Stops"
            value={stats.uniqueStops.toLocaleString()}
            bg={palette.green}
            fg={palette.white}
            icon={<TbBuildingBridge size={20} />}
          />
          <StatBlock
            label="Transfers"
            value={stats.transfers.toLocaleString()}
            bg={palette.yellow}
            fg={palette.ink}
            icon={<TbArrowsExchange size={20} />}
          />
        </Box>

        {stats.trolleyTrips > 0 && (
          <Box sx={{ mt: 1.25 }}>
            <StatBlock
              label="Trolley Trips"
              value={stats.trolleyTrips.toLocaleString()}
              bg={palette.green}
              fg={palette.white}
              icon={<TbTrain size={20} />}
            />
          </Box>
        )}
      </CardCanvas>
    );
  },
);

OverviewCard.displayName = "OverviewCard";
export default OverviewCard;
