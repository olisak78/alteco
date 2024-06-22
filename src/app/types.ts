export enum Status {
  Working,
  Vacation,
  Sickness,
}

export type User = {
  fullName: string;
  status: Status;
  email: string;
  password: string;
  lastUpdated: Date;
};
