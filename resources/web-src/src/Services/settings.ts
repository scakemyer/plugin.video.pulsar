const refreshRateSettingName = 'refreshRate';
const defaultRefreshRate = 5000;

export const saveRefreshRate = (refreshRate: number): void => {
  const refreshRateInMs = refreshRate;
  window.localStorage.setItem(refreshRateSettingName, refreshRateInMs.toString());
};

export const getRefreshRate = (): number => {
  const refreshRate = window.localStorage.getItem(refreshRateSettingName);
  return Number(refreshRate ?? defaultRefreshRate);
};
