import ChannelCollection from "../channel/collection";
import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import ConnectionCollection from "../connection/collection";

/**
 * Checks if a Connection with ConnectionId is req.params exists
 */
const isConnectionExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validFormat = Types.ObjectId.isValid(req.params.connectionId);
  const Connection = validFormat
    ? await ConnectionCollection.findOne(req.params.connectionId)
    : "";
  if (!Connection) {
    res.status(404).json({
      error: {
        ConnectionNotFound: `Connection with Connection ID ${req.params.connectionId} does not exist.`,
      },
    });
    return;
  }

  next();
};

/**
 * Checks if the title of the Connection in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidConnectionTitle = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title } = req.body as { title: string };
  if (!title.trim()) {
    res.status(400).json({
      error: "Connection title must be at least one character long.",
    });
    return;
  }

  if (title.length > 140) {
    res.status(413).json({
      error: "Connection title must be no more than 140 characters.",
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the Channel Connection is connecting to
 */
const isConnectionAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.params);
  const Connection = await ConnectionCollection.findOne(
    req.params.connectionId
  );
  console.log(Connection);
  const connectionuthorId = Connection.authorId._id;
  console.log(connectionuthorId);
  if (req.session.userId !== connectionuthorId.toString()) {
    res.status(403).json({
      error: "Cannot delete other user's connections.",
    });
    return;
  }

  next();
};
/**
 * Checks if the freet has already been connected to a given channel
 */
const isNotDuplicateConnection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const freetConnections = await ConnectionCollection.findAllByFreetId(
    req.body.freetId
  );

  if (
    freetConnections.some(
      (elm) => elm.channelId._id.toString() === req.body.channelId.toString()
    )
  ) {
    res.status(403).json({
      error: "Already connected freet to this channel.",
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the Channel Connection is connecting to
 */
const isChannelAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { channelId } = req.body as { channelId: string };
  const Channel = await ChannelCollection.findOne(channelId);
  console.log(Channel);
  const channelAuthorId = Channel.authorId._id;
  if (req.session.userId !== channelAuthorId.toString()) {
    res.status(403).json({
      error: "Cannot connect to other users' channels.",
    });
    return;
  }

  next();
};

export {
  isValidConnectionTitle,
  isConnectionExists,
  isChannelAuthor,
  isConnectionAuthor,
  isNotDuplicateConnection,
};
