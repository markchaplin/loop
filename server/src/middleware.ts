import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const authenticated: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        console.log('Err ', err)
        return res.sendStatus(403);
      }

      (req as any).user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

export function getId(req: any) {
  const _id = req?.user?._id;
  return _id;
}
