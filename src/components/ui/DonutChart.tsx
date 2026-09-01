import type { ReactElement, ReactNode } from "react";
import { cn } from "@/lib/cn";

/* Geometry taken from the Figma design, in a 240x240 coordinate space. */
const VIEWBOX_SIZE = 240;
const CENTER = VIEWBOX_SIZE / 2;
const OUTER_RADIUS = 120;
/** Translucent white ring that lightens the inner part of each slice. */
const OVERLAY_RADIUS = 93.75;
const OVERLAY_OPACITY = 0.25;
/** Solid white hole the center content sits in. */
const HOLE_RADIUS = 81;

const FULL_TURN_DEGREES = 360;
const HALF_TURN_DEGREES = 180;
/** SVG angles start at 3 o'clock; the design starts the first slice at 12 o'clock. */
const QUARTER_TURN_DEGREES = 90;
/** Coordinate precision — enough for a 240px chart, short enough to stay readable. */
const COORDINATE_DECIMALS = 3;

export interface DonutSegment {
  /** Stable identity for the slice, used as the React key. */
  readonly id: string;
  /** Share of the chart. Non-positive values are dropped. */
  readonly value: number;
  /** Any CSS color, e.g. a hex from the design system. */
  readonly color: string;
}

interface DonutSlice {
  readonly id: string;
  readonly color: string;
  readonly path: string;
}

export interface DonutChartProps {
  readonly segments: ReadonlyArray<DonutSegment>;
  /** Content rendered in the middle of the ring. */
  readonly children?: ReactNode;
  readonly className?: string;
}

function toPoint(
  radius: number,
  angleInDegrees: number,
): { x: string; y: string } {
  const radians = ((angleInDegrees - QUARTER_TURN_DEGREES) * Math.PI) / 180;

  return {
    x: (CENTER + radius * Math.cos(radians)).toFixed(COORDINATE_DECIMALS),
    y: (CENTER + radius * Math.sin(radians)).toFixed(COORDINATE_DECIMALS),
  };
}

/** A wedge running clockwise from `startAngle`, drawn from the center out. */
function buildSlicePath(startAngle: number, sweepAngle: number): string {
  const start = toPoint(OUTER_RADIUS, startAngle);
  const end = toPoint(OUTER_RADIUS, startAngle + sweepAngle);
  const largeArcFlag = sweepAngle > HALF_TURN_DEGREES ? 1 : 0;

  return [
    `M ${CENTER} ${CENTER}`,
    `L ${start.x} ${start.y}`,
    `A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

/** A single arc cannot close a full circle, so a lone slice is drawn as two half arcs. */
function buildFullCirclePath(): string {
  const top = toPoint(OUTER_RADIUS, 0);
  const bottom = toPoint(OUTER_RADIUS, HALF_TURN_DEGREES);

  return [
    `M ${top.x} ${top.y}`,
    `A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 1 1 ${bottom.x} ${bottom.y}`,
    `A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 1 1 ${top.x} ${top.y}`,
    "Z",
  ].join(" ");
}

function toSlices(
  segments: ReadonlyArray<DonutSegment>,
): ReadonlyArray<DonutSlice> {
  const drawable = segments.filter(
    (segment) => Number.isFinite(segment.value) && segment.value > 0,
  );
  const total = drawable.reduce((sum, segment) => sum + segment.value, 0);

  if (total <= 0) return [];

  const sweeps = drawable.map(
    (segment) => (segment.value / total) * FULL_TURN_DEGREES,
  );

  return drawable.map((segment, index) => ({
    id: segment.id,
    color: segment.color,
    path:
      drawable.length === 1
        ? buildFullCirclePath()
        : buildSlicePath(
            sweeps.slice(0, index).reduce((sum, sweep) => sum + sweep, 0),
            sweeps[index],
          ),
  }));
}

/**
 * Donut chart drawn as plain SVG — no charting library.
 *
 * Slices are laid out clockwise from 12 o'clock, then lightened toward the
 * middle by a translucent white ring, matching the design.
 */
export function DonutChart({
  segments,
  children,
  className,
}: DonutChartProps): ReactElement {
  const slices = toSlices(segments);

  return (
    <div
      className={cn(
        "relative mx-auto aspect-square w-full max-w-[240px]",
        className,
      )}
    >
      <svg
        viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
        className="size-full"
        aria-hidden="true"
        focusable="false"
      >
        {/* Base ring, also visible on its own when there is nothing to plot. */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={OUTER_RADIUS}
          fill="var(--color-grey-100)"
        />
        {slices.map((slice) => (
          <path key={slice.id} d={slice.path} fill={slice.color} />
        ))}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={OVERLAY_RADIUS}
          fill="var(--color-white)"
          opacity={OVERLAY_OPACITY}
        />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={HOLE_RADIUS}
          fill="var(--color-white)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
        {children}
      </div>
    </div>
  );
}
