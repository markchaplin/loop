export type Weight = {
  name: string;
  weight: number;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  _id: string;
  email: string;
  hash_password: string;
  weights?: Weight[];
};
