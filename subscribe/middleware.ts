import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import SubscribeCollection from "../subscribe/collection";
import SubscribeModel, { Subscribe } from "./model";

/**
 * Checks if a Subscribe with SubscribeId is req.params exists
 */
const isSubscribeExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validFormat = Types.ObjectId.isValid(req.params.subscribeId);
  const Subscribe = validFormat
    ? await SubscribeCollection.findOne(req.params.subscribeId)
    : "";
  if (!Subscribe) {
    res.status(404).json({
      error: {
        SubscribeNotFound: `Subscribe with Subscribe ID ${req.params.subscribeId} does not exist.`,
      },
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the Subscribe
 */
const isSubscribeAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const Subscribe = await SubscribeCollection.findOne(req.params.subscribeId);
  const subscribeuthorId = Subscribe.authorId._id;
  if (req.session.userId !== subscribeuthorId.toString()) {
    res.status(403).json({
      error: "Cannot delete other user's subscribes.",
    });
    return;
  }

  next();
};

/**
 * Checks if the the author is already subscribeing the requested user
 */
const isNotDuplicateSubscribe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("session user id", req.session.userId);
  const AuthorSubscribes = await SubscribeCollection.findAllByAuthorId(
    req.session.userId
  );

  if (
    AuthorSubscribes.some(
      (elm) =>
        elm.subscribingToId.toString() === req.body.subscribingTo.toString()
    )
  ) {
    res.status(403).json({
      error: "Already subscribeing this user.",
    });
    return;
  }
  next();
};

export { isSubscribeExists, isSubscribeAuthor, isNotDuplicateSubscribe };
