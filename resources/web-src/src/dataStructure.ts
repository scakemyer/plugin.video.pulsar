export enum StatusCode {
  StatusQueued = 0,
  StatusChecking,
  StatusFinding,
  StatusDownloading,
  StatusFinished,
  StatusSeeding,
  StatusAllocating,
  StatusStalled,
  StatusPaused,
  StatusBuffering,
  StatusPlaying,
}

export interface ITorrent {
  status: string;
  status_code: StatusCode;
  progress: number;
  name: string;
  download_rate: number;
  id: string;
  added_time: number;
  peers: number;
  peers_total: number;
  ratio: number;
  seed_time: number;
  seed_time_limit: number;
  seeders: number;
  seeders_total: number;
  seeding_time: string;
  size: string;
  size_bytes: number;
  time_ratio: number;
  upload_rate: number;
  total_download: number;
  total_upload: number;
}
