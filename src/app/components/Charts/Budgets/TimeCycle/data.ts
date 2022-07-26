export interface BudgetsTimeCycleProps {
  selectedNodeId?: string;
  vizCompData: any;
  setVizCompData: (vizCompData: any) => void;
  data: Record<string, unknown>[];
  onNodeClick: (node: string, x: number, y: number) => void;
}

export const mockdata: Record<string, unknown>[] = [
  {
    year: "2017",
    HIV: 1258028,
    HIVColor: "#70777E",
    Tuberculosis: 77,
    TuberculosisColor: "#252C34",
    Other: 720239,
    OtherColor: "#868E96",
    RSSH: 7876,
    RSSHColor: "#ADB5BD",
    amount: 1986220,
  },
  {
    year: "2018",
    Malaria: 546535407,
    MalariaColor: "#495057",
    Other: 342227244,
    OtherColor: "#868E96",
    HIV: 762036172,
    HIVColor: "#70777E",
    RSSH: 223636828,
    RSSHColor: "#ADB5BD",
    Tuberculosis: 347103179,
    TuberculosisColor: "#252C34",
    Multicomponent: 7519915,
    MulticomponentColor: "#373D43",
    amount: 2229058745,
  },
  {
    year: "2019",
    Tuberculosis: 518209923,
    TuberculosisColor: "#252C34",
    RSSH: 365898063,
    RSSHColor: "#ADB5BD",
    Malaria: 924630754,
    MalariaColor: "#495057",
    HIV: 1257182582,
    HIVColor: "#70777E",
    Other: 467574230,
    OtherColor: "#868E96",
    Multicomponent: 5095709,
    MulticomponentColor: "#373D43",
    amount: 3538591261,
  },
  {
    year: "2020",
    Tuberculosis: 720913117,
    TuberculosisColor: "#252C34",
    HIV: 1641964939,
    HIVColor: "#70777E",
    Other: 596999788,
    OtherColor: "#868E96",
    RSSH: 526883976,
    RSSHColor: "#ADB5BD",
    "Emergency Response": 603700040,
    "Emergency ResponseColor": "#98A1AA",
    Malaria: 1208382291,
    MalariaColor: "#495057",
    Multicomponent: 7339735,
    MulticomponentColor: "#373D43",
    amount: 5306183886,
  },
  {
    year: "2021",
    RSSH: 578229801,
    RSSHColor: "#ADB5BD",
    Tuberculosis: 644692923,
    TuberculosisColor: "#252C34",
    HIV: 1328124387,
    HIVColor: "#70777E",
    Other: 545528604,
    OtherColor: "#868E96",
    Malaria: 940644758,
    MalariaColor: "#495057",
    "Emergency Response": 179222871,
    "Emergency ResponseColor": "#98A1AA",
    Multicomponent: 23069140,
    MulticomponentColor: "#373D43",
    amount: 4239512484,
  },
  {
    year: "2022",
    Other: 446812544,
    OtherColor: "#868E96",
    HIV: 1610261059,
    HIVColor: "#70777E",
    Tuberculosis: 569291120,
    TuberculosisColor: "#252C34",
    Malaria: 999670617,
    MalariaColor: "#495057",
    RSSH: 465973614,
    RSSHColor: "#ADB5BD",
    Multicomponent: 100041148,
    MulticomponentColor: "#373D43",
    "Emergency Response": 767227,
    "Emergency ResponseColor": "#98A1AA",
    amount: 4192817329,
  },
  {
    year: "2023",
    Malaria: 813369940,
    MalariaColor: "#495057",
    Other: 411445579,
    OtherColor: "#868E96",
    HIV: 1399309985,
    HIVColor: "#70777E",
    RSSH: 297975789,
    RSSHColor: "#ADB5BD",
    Tuberculosis: 467677229,
    TuberculosisColor: "#252C34",
    "Emergency Response": 1503433,
    "Emergency ResponseColor": "#98A1AA",
    Multicomponent: 108391846,
    MulticomponentColor: "#373D43",
    amount: 3499673801,
  },
  {
    year: "2024",
    Other: 9823673,
    OtherColor: "#868E96",
    HIV: 22699232,
    HIVColor: "#70777E",
    RSSH: 9755523,
    RSSHColor: "#ADB5BD",
    Tuberculosis: 21617221,
    TuberculosisColor: "#252C34",
    Malaria: 15642248,
    MalariaColor: "#495057",
    Multicomponent: 104695859,
    MulticomponentColor: "#373D43",
    amount: 184233756,
  },
];
