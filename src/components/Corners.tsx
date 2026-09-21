/** Четыре регистрационные метки «+» рамки .blueprint. */
export function Corners({ color }: { color?: string }) {
  const style = color ? { color } : undefined;
  return (
    <>
      <i className="corner tl" style={style} />
      <i className="corner tr" style={style} />
      <i className="corner bl" style={style} />
      <i className="corner br" style={style} />
    </>
  );
}
