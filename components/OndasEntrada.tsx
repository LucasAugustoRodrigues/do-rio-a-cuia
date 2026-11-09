export function OndasEntrada() {
  const d = "M0 426 C40 400 100 452 150 446 C200 440 250 392 300 392 C340 392 370 400 390 410";

  return (
    <svg
      viewBox="0 384 390 158"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="block h-[158px] w-full"
    >
      <path fill="none" strokeWidth={15} vectorEffect="non-scaling-stroke" d={d} stroke="var(--color-onda-1)" />
      <path fill="none" strokeWidth={15} vectorEffect="non-scaling-stroke" d={d} stroke="var(--color-onda-2)" transform="translate(0 50)" />
      <path fill="none" strokeWidth={15} vectorEffect="non-scaling-stroke" d={d} stroke="var(--color-onda-3)" transform="translate(0 94)" />
    </svg>
  );
}
