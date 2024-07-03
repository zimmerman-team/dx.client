const fontSizeStyleMap = {
  "font-size-1": { fontSize: "1px" },
};

for (let i = 1; i <= 999; i++) {
  fontSizeStyleMap[`font-size-${i}` as keyof typeof fontSizeStyleMap] = {
    fontSize: `${i}px`,
  };
}

export default fontSizeStyleMap;
