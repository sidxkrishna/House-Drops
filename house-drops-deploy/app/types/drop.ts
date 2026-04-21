export interface Track {
  number: string;
  name: string;
  artist: string;
  note: string;
  isStandout?: boolean;
}

export interface DropCardProps {
  title: string;
  description: string;
  standout: string;
  href: string;
  hidden?: boolean;
}
