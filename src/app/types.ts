export enum Status {
  Working,
  Vacation,
  Sickness,
}
export enum Variant {
  success,
  info,
  warning,
}

export type User = {
  fullName: string;
  status: Status;
  email: string;
  password: string;
  lastUpdated: Date;
};

export enum FilterType {
  Name,
  Email,
  Status,
}
export type Employee = {
  _id: string;
  fullName: string;
  email: string;
  status: Status;
  lastUpdated: string;
};
