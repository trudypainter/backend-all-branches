import type { NextFunction, Request, Response } from "express";
import express from "express";
import ChannelCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as ChannelValidator from "../channel/middleware";
import * as util from "./util";
import ConnectionCollection from "../connection/collection";
import FollowCollection from "../follow/collection";

const router = express.Router();

/**
 * Get the channel metadata
 *
 * @name GET /api/channel
 *
 * @return {ChannelResponse[]} - A list of all the Channels sorted in descending
 *                      order by date modified
 */
/**
 * Get Channels by author.
 *
 * @name GET /api/Channels?authorId=id
 *
 * @return {ChannelResponse[]} - An array of Channels created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.author !== undefined) {
      next();
      return;
    }

    const allChannels = await ChannelCollection.findAll();
    const response = allChannels.map(util.constructChannelResponse);
    res.status(200).json(response);
  },
  [userValidator.isAuthorExists],
  async (req: Request, res: Response) => {
    const authorChannels = await ChannelCollection.findAllByUsername(
      req.query.author as string
    );
    const response = authorChannels.map(util.constructChannelResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new Channel.
 *
 * @name POST /api/Channels
 *
 * @param {string} title - The title of the Channel
 * @param {string} description - The description of the Channel
 * @return {ChannelResponse} - The created Channel
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the Channel title is empty or a stream of empty spaces
 * @throws {413} - If the Channel title is more than 140 characters long
 */
router.post(
  "/",
  [userValidator.isUserLoggedIn],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ""; // Will not be an empty string since its validated in isUserLoggedIn
    const Channel = await ChannelCollection.addOne(
      userId,
      req.body.title,
      req.body.description
    );

    res.status(201).json({
      message: "Your Channel was created successfully.",
      Channel: util.constructChannelResponse(Channel),
    });
  }
);

/**
 * Delete a channel and all associated connections
 * NOTE: the connection model has not been created yet
 *
 * @name DELETE /api/Channels/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the Channel
 * @throws {404} - If the ChannelId is not valid
 */
router.delete(
  "/:channelId?",
  [
    userValidator.isUserLoggedIn,
    ChannelValidator.isChannelExists,
    ChannelValidator.isValidChannelModifier,
  ],
  async (req: Request, res: Response) => {
    console.log("req params", req.params.channelId);
    const chan = await ChannelCollection.deleteOne(req.params.channelId);
    console.log("deleted channel obj", chan);

    const connections = await ConnectionCollection.deleteForChannel(
      req.params.channelId.toString()
    );
    console.log("deleted conenctions", connections);

    await FollowCollection.deleteForChannel(req.params.channelId.toString());

    res.status(200).json({
      message: "Your Channel was deleted successfully.",
    });
  }
);

/**
 * Modify a Channel
 *
 * @name PUT /api/Channels/:id
 *
 * @param {string} title - the new title for the Channel
 * @param {string} description - the new description for the Channel
 * @return {ChannelResponse} - the updated Channel
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the Channel
 * @throws {404} - If the ChannelId is not valid
 * @throws {400} - If the Channel title is empty or a stream of empty spaces
 * @throws {413} - If the Channel title is more than 140 characters long
 */
router.put(
  "/:channelId?",
  [
    userValidator.isUserLoggedIn,
    ChannelValidator.isChannelExists,
    ChannelValidator.isValidChannelModifier,
    ChannelValidator.isValidChannelTitle,
  ],
  async (req: Request, res: Response) => {
    const Channel = await ChannelCollection.updateOne(
      req.params.channelId,
      req.body.title,
      req.body.description
    );
    res.status(200).json({
      message: "Your Channel was updated successfully.",
      Channel: util.constructChannelResponse(Channel),
    });
  }
);

export { router as ChannelRouter };
