type PixelCatProps = {
  className?: string;
  coat?: "orange" | "cream" | "mint";
};

const coats = {
  orange: { main: "#f4a261", light: "#ffd79a", stripe: "#d96b45" },
  cream: { main: "#f6d6a8", light: "#fff0cf", stripe: "#c98f71" },
  mint: { main: "#7ec4a8", light: "#c7ead9", stripe: "#438b72" },
};

export function PixelCat({ className, coat = "orange" }: PixelCatProps) {
  const colors = coats[coat];

  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      role="img"
      aria-label="ドット絵の猫"
      shapeRendering="crispEdges"
    >
      <rect x="5" y="28" width="23" height="2" fill="#342b35" opacity="0.24" />
      <rect x="22" y="20" width="6" height="3" fill="#342b35" />
      <rect x="26" y="17" width="3" height="5" fill="#342b35" />
      <rect x="24" y="15" width="4" height="3" fill="#342b35" />
      <rect x="23" y="21" width="4" height="1" fill={colors.main} />
      <rect x="27" y="18" width="1" height="3" fill={colors.main} />
      <rect x="24" y="16" width="3" height="1" fill={colors.main} />

      <rect x="8" y="18" width="16" height="10" fill="#342b35" />
      <rect x="10" y="19" width="12" height="8" fill={colors.main} />
      <rect x="10" y="26" width="4" height="3" fill="#342b35" />
      <rect x="18" y="26" width="4" height="3" fill="#342b35" />
      <rect x="11" y="26" width="2" height="2" fill={colors.light} />
      <rect x="19" y="26" width="2" height="2" fill={colors.light} />
      <rect x="12" y="20" width="2" height="5" fill={colors.stripe} />
      <rect x="18" y="20" width="2" height="5" fill={colors.stripe} />

      <rect x="7" y="6" width="18" height="14" fill="#342b35" />
      <rect x="8" y="4" width="5" height="5" fill="#342b35" />
      <rect x="19" y="4" width="5" height="5" fill="#342b35" />
      <rect x="9" y="5" width="3" height="4" fill={colors.main} />
      <rect x="20" y="5" width="3" height="4" fill={colors.main} />
      <rect x="9" y="8" width="14" height="10" fill={colors.main} />
      <rect x="10" y="9" width="12" height="8" fill={colors.light} />
      <rect x="11" y="11" width="3" height="3" fill="#342b35" />
      <rect x="19" y="11" width="3" height="3" fill="#342b35" />
      <rect x="12" y="11" width="1" height="1" fill="#fffdf2" />
      <rect x="20" y="11" width="1" height="1" fill="#fffdf2" />
      <rect x="15" y="14" width="3" height="2" fill="#e85d75" />
      <rect x="14" y="16" width="2" height="1" fill="#342b35" />
      <rect x="18" y="16" width="2" height="1" fill="#342b35" />
      <rect x="5" y="14" width="7" height="1" fill="#342b35" />
      <rect x="21" y="14" width="7" height="1" fill="#342b35" />
      <rect x="4" y="16" width="8" height="1" fill="#342b35" />
      <rect x="21" y="16" width="8" height="1" fill="#342b35" />
    </svg>
  );
}
