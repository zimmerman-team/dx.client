import react, { useEffect } from "react";
import { RecoilState, useRecoilValue } from "recoil";

type Props = {
  node: RecoilState<any>;
  onChange: (value: any) => void;
};
export const RecoilObserver = ({ node, onChange }: Props) => {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
};
