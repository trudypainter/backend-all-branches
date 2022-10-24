import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import ChannelCollection from "../channel/collection";

/**
 * Checks if a Channel with ChannelId is req.params exists
 */
const isChannelExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validFormat = Types.ObjectId.isValid(req.params.channelId);
  const Channel = validFormat
    ? await ChannelCollection.findOne(req.params.channelId)
    : "";
  if (!Channel) {
    res.status(404).json({
      error: {
        ChannelNotFound: `Channel with Channel ID ${req.params.channelId} does not exist.`,
      },
    });
    return;
  }

  next();
};

/**
 * Checks if a Channel with ChannelId is req.query exists
 */
const isChannelInQueryExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("validator looking for ", req.query.channelId);

  const validFormat = Types.ObjectId.isValid(req.query.channelId.toString());
  const Channel = validFormat
    ? await ChannelCollection.findOne(req.query.channelId.toString())
    : "";
  if (!Channel) {
    res.status(404).json({
      error: {
        ChannelNotFound: `Channel with Channel ID ${req.params.channelId} does not exist.`,
      },
    });
    return;
  }

  next();
};

/**
 * Checks if a channel with channel in req.body exists
 */
const isChannelInBodyExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { channelId } = req.body as { channelId: string };
  const validFormat = Types.ObjectId.isValid(channelId);
  const channel = validFormat ? await ChannelCollection.findOne(channelId) : "";
  if (!channel) {
    res.status(404).json({
      error: {
        channelNotFound: `Channel with channel ID ${channelId} does not exist.`,
      },
    });
    return;
  }

  next();
};

/**
 * Checks if the title of the Channel in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidChannelTitle = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title } = req.body as { title: string };
  if (!title.trim()) {
    res.status(400).json({
      error: "Channel title must be at least one character long.",
    });
    return;
  }

  if (title.length > 140) {
    res.status(413).json({
      error: "Channel title must be no more than 140 characters.",
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the Channel whose ChannelId is in req.params
 */
const isValidChannelModifier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const Channel = await ChannelCollection.findOne(req.params.channelId);
  const userId = Channel.authorId._id;

  console.log(Channel);
  console.log(userId);
  console.log(req.session.userId.toString());
  if (req.session.userId.toString() !== userId.toString()) {
    res.status(403).json({
      error: "Cannot modify other users' Channels.",
    });
    return;
  }

  next();
};

export {
  isChannelInBodyExists,
  isValidChannelTitle,
  isChannelExists,
  isValidChannelModifier,
  isChannelInQueryExists,
};
