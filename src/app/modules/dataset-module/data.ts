export interface DatasetListItemAPIModel {
  id: string;
  name: string;
  description: string;
  public: boolean;
  category: string;
  createdDate: Date;
  updatedDate: Date;
  owner: string;
  source: string;
  sourceUrl: string;
}
