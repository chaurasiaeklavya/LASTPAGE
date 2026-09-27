/**
 * The brand burst [K2, D3, D14]: three concentric eleven-point stars.
 * Polygon points are taken directly from the deck's vector clip paths and
 * normalised to a 100-unit box — geometry is not redrawn by eye.
 * True rotation centre of the 11-gon is (50, 51.02).
 */
const OUTER =
  "50,0.51 61.38,12.25 77.31,8.53 80.54,24.57 95.95,30.04 90,45.28 100,58.22 86.76,67.82 88.18,84.1 71.85,85.02 64.24,99.49 50,91.44 35.76,99.49 28.15,85.02 11.82,84.1 13.23,67.82 0,58.22 10,45.28 4.05,30.04 19.46,24.57 22.69,8.53 38.61,12.25";
const MID =
  "50,13.65 58.43,22.33 70.21,19.58 72.6,31.44 84,35.5 79.6,46.77 87,56.35 77.2,63.45 78.25,75.5 66.17,76.18 60.53,86.89 50,80.93 39.47,86.89 33.83,76.18 21.75,75.5 22.8,63.45 13,56.35 20.4,46.77 16,35.5 27.4,31.44 29.79,19.58 41.57,22.33";
const INNER =
  "50,25.77 55.69,31.64 63.65,29.78 65.27,37.8 72.97,40.53 70,48.15 75,54.62 68.38,59.42 69.09,67.56 60.92,68.02 57.11,75.26 50,71.23 42.88,75.26 39.07,68.02 30.91,67.56 31.62,59.42 25,54.62 30,48.15 27.02,40.53 34.73,37.8 36.34,29.78 44.3,31.64";

type Layer = "white" | "violet" | "lime" | "ink" | "none";

const fills: Record<Layer, string> = {
  white: "#FFFFFF",
  violet: "#5200FF",
  lime: "#D0FF00",
  ink: "#1D1D1D",
  none: "transparent",
};

type BurstProps = {
  className?: string;
  /** outer / middle / inner fill. Defaults to the kit's white · violet · lime. */
  layers?: [Layer, Layer, Layer];
  /** A single solid star (outer outline only). */
  solid?: Layer;
  label?: string;
};

export function Burst({ className, layers = ["white", "violet", "lime"], solid, label }: BurstProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{ transformOrigin: "50% 51.02%" }}
    >
      {solid ? (
        <polygon points={OUTER} fill={fills[solid]} />
      ) : (
        <>
          <polygon points={OUTER} fill={fills[layers[0]]} />
          <polygon points={MID} fill={fills[layers[1]]} />
          <polygon points={INNER} fill={fills[layers[2]]} />
        </>
      )}
    </svg>
  );
}

export const BURST_OUTER_POINTS = OUTER;
