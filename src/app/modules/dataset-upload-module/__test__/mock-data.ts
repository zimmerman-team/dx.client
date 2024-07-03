export const mockFileRejections = [
  {
    file: {
      name: "example.jpg",
      size: 1024,
      lastModified: 0,
      webkitRelativePath: "",
      type: "",
      arrayBuffer: () => new Promise(() => {}) as any,
      slice: () => new Blob(),
      stream: () => new ReadableStream() as any,

      text: () => new Promise(() => {}) as any,
    },
    errors: [{ code: "file_size", message: "File size exceeds the limit" }],
  },
];

export const mockFormDetails = {
  name: "Moc Dataset",
  source: "Mock source",
  category: "Education",
  public: false,
  sourceUrl: "https://example.com/mock-source",
  description: "description of the mock dataset",
};
