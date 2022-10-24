import ChannelCollection from "../channel/collection";
import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import FollowCollection from "../follow/collection";
import FollowModel, { Follow } from "./model";

/**
 * Checks if a Follow with FollowId is req.params exists
 */
const isFollowExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validFormat = Types.ObjectId.isValid(req.params.followId);
  const Follow = validFormat
    ? await FollowCollection.findOne(req.params.followId)
    : "";
  if (!Follow) {
    res.status(404).json({
      error: {
        FollowNotFound: `Follow with Follow ID ${req.params.followId} does not exist.`,
      },
    });
    return;
  }

  next();
};

/**
 * Checks if the title of the Follow in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidFollowTitle = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title } = req.body as { title: string };
  if (!title.trim()) {
    res.status(400).json({
      error: "Follow title must be at least one character long.",
    });
    return;
  }

  if (title.length > 140) {
    res.status(413).json({
      error: "Follow title must be no more than 140 characters.",
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the Channel Follow is connecting to
 */
const isFollowAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const Follow = await FollowCollection.findOne(req.params.followId);
  const followuthorId = Follow.authorId._id;
  if (req.session.userId !== followuthorId.toString()) {
    res.status(403).json({
      error: "Cannot delete other user's follows.",
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the Channel Follow is connecting to
 */
const isNotChannelAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { channelId } = req.body as { channelId: string };
  const Channel = await ChannelCollection.findOne(channelId);
  console.log(Channel);
  const channelAuthorId = Channel.authorId._id;
  if (req.session.userId === channelAuthorId.toString()) {
    res.status(403).json({
      error: "Cannot follow own channels.",
    });
    return;
  }

  next();
};

/**
 * Checks if the the user is already following the requested channel
 */
const isNotDuplicateFollow = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const AuthorFollows = await FollowCollection.findAllByUserId(
    req.session.userId
  );
  console.log("⭐️ checking for duplicates");
  console.log(req.body.channelId);
  console.log(AuthorFollows);
  console.log(
    AuthorFollows.some(
      (elm) => elm.channelId._id.toString() === req.body.channelId.toString()
    )
  );

  if (
    AuthorFollows.some(
      (elm) => elm.channelId._id.toString() === req.body.channelId.toString()
    )
  ) {
    res.status(403).json({
      error: "Already following this channel.",
    });
    return;
  }

  next();
};

export {
  isValidFollowTitle,
  isFollowExists,
  isNotChannelAuthor as isChannelAuthor,
  isFollowAuthor,
  isNotDuplicateFollow,
};
