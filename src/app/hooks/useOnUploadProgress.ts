import { useState } from "react";

export const useOnUploadProgress = () => {
  const [loadedProgress, setLoadedProgress] = useState("0B");
  const [percentageLoadedProgress, setPercentageLoadedProgress] = useState(0);
  const [estUploadTime, setEstUploadTime] = useState(0);

  const onUploadProgress = (progressEvent: any) => {
    const { loaded, total } = progressEvent;

    /**
     ATPB: Average Time per Byte, FS: File Size
     ATPB (FS < 1 KB): 0.00020274914089347078 seconds/byte
     ATPB (FS >= 1 KB and < 1 MB): 7.006672447772506e-06 seconds/byte
     ATPB (FS >= 1 MB and < 10 MB): 2.8944496268656717e-06 seconds/byte
     ATPB (FS >= 10 MB): 2.2532963802805073e-06 seconds/byte
     lets floor that to 10 decimal places, and calculate the time per byte in
     seconds for the different sizes, as they are all different due to overhead
     */
    const timePerByteIfBytes = 0.0002027491;
    const timePerByteIfKiloBytes = 0.0000070067;
    const timePerByteIfMegaBytes = 0.0000028944;
    const timePerByteIfLargest = 0.0000022533;

    const KB = 1024;
    const MB = 1048576;
    const MB10 = 10485760;
    let timePerByte = timePerByteIfBytes;
    if (total >= KB && total < MB) timePerByte = timePerByteIfKiloBytes;
    if (total >= MB && total < MB10) timePerByte = timePerByteIfMegaBytes;
    if (total >= MB10) timePerByte = timePerByteIfLargest;
    const timeEstimate = timePerByte * total;

    let loadedProgressValue = `${loaded}B`;
    if (loaded > KB && loaded < MB)
      loadedProgressValue = `${(loaded / KB).toFixed(2)}KB`;
    if (loaded > MB) loadedProgressValue = `${(loaded / MB).toFixed(2)}MB`;
    setLoadedProgress(loadedProgressValue);
    setPercentageLoadedProgress(Math.floor((loaded * 100) / total));

    setEstUploadTime(timeEstimate);
  };
  return {
    loadedProgress,
    percentageLoadedProgress,
    setPercentageLoadedProgress,
    estUploadTime,
    onUploadProgress,
    setEstUploadTime,
  };
};
