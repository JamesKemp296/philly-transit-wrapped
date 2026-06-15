import { forwardRef } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { TbCalendarStats, TbClockHour9, TbCalendarMonth, TbSun } from "react-icons/tb";
import CardCanvas, { StatBlock } from "./cardBase";
import { palette, pad, radius } from "../../theme";
import type { WrappedStats } from "../../lib/types";

const HabitsCard = forwardRef<HTMLDivElement, { stats: WrappedStats }>(
  ({ stats }, ref) => {
    const total = stats.weekdayTrips + stats.weekendTrips || 1;
    const weekdayPct = Math.round((stats.weekdayTrips / total) * 100);
    const maxDow = Math.max(...stats.dayOfWeekBreakdown.map((d) => d.count), 1);

    return (
      <CardCanvas ref={ref} background={palette.ink}>
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            opacity: 0.6,
            mb: 1,
          }}
        >
          Your riding rhythm
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.25, mb: 1.5 }}>
          <StatBlock
            label="Busiest Day"
            value={stats.busiestDayOfWeek ? stats.busiestDayOfWeek.label.slice(0, 3) : "—"}
            bg={palette.blue}
            fg={palette.white}
            icon={<TbCalendarStats size={20} />}
          />
          <StatBlock
            label="Peak Hour"
            value={stats.peakHourLabel}
            bg={palette.orange}
            fg={palette.white}
            icon={<TbClockHour9 size={20} />}
          />
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.25, mb: 1.5 }}>
          <Box sx={{ bgcolor: palette.green, color: palette.white, borderRadius: radius.md, p: pad.tile }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Busiest Month
              </Typography>
              <TbCalendarMonth size={20} />
            </Stack>
            <Typography sx={{ fontWeight: 900, fontSize: 20, lineHeight: 1.05, mt: 1 }}>
              {stats.busiestMonth ? stats.busiestMonth.label.split(" ")[0] : "—"}
            </Typography>
          </Box>
          <StatBlock
            label="Weekday Riding"
            value={`${weekdayPct}%`}
            bg={palette.yellow}
            fg={palette.ink}
            icon={<TbSun size={20} />}
          />
        </Box>

        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 900,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            opacity: 0.85,
            mb: 1,
          }}
        >
          Trips by day of week
        </Typography>

        <Stack direction="row" alignItems="flex-end" spacing={0.75} sx={{ flex: 1, minHeight: 0 }}>
          {stats.dayOfWeekBreakdown.map((d) => {
            const h = Math.round((d.count / maxDow) * 100);
            return (
              <Stack key={d.label} alignItems="center" spacing={0.5} sx={{ flex: 1, height: "100%", justifyContent: "flex-end" }}>
                <Typography sx={{ fontWeight: 800, fontSize: 11, opacity: 0.8 }}>
                  {d.count}
                </Typography>
                <Box
                  sx={{
                    width: "100%",
                    height: `${Math.max(h, 4)}%`,
                    bgcolor: palette.blue,
                    borderRadius: radius.sm,
                    minHeight: 6,
                  }}
                />
                <Typography sx={{ fontWeight: 800, fontSize: 11, opacity: 0.7 }}>
                  {d.label.slice(0, 1)}
                </Typography>
              </Stack>
            );
          })}
        </Stack>

        {stats.mostActiveDay && (
          <Typography sx={{ fontWeight: 800, fontSize: 12, opacity: 0.7, mt: 1, textAlign: "center" }}>
            Most in one day: {stats.mostActiveDay.count} trips on{" "}
            {stats.mostActiveDay.label}
          </Typography>
        )}
      </CardCanvas>
    );
  },
);

HabitsCard.displayName = "HabitsCard";
export default HabitsCard;
