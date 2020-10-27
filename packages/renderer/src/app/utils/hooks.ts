import { useTranslation } from "react-i18next";

export const useTranslationAt = (path: string) => {
  const { t, ...rest } = useTranslation();

  const newT = (pathToTranslation: string) => t(`${path}.${pathToTranslation}`);

  return {
    t: newT,
    ...rest,
  };
};
