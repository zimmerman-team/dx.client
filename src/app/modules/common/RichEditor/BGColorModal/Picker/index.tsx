import { colors } from "app/modules/common/RichEditor/ColorModal/Picker/colors";

import Picker from "app/modules/common/RichEditor/BGColorModal/Picker/picker";

const styleMap = {
  "bg-000000": { background: "#000000" },
};
colors.map((c, _) => {
  styleMap[`bg-${c.replace("#", "")}` as keyof typeof styleMap] = {
    background: c,
  };
  return null;
});

const pickerObj = {
  Picker: Picker,
  bgColorStyleMap: styleMap,
};

export default pickerObj;
