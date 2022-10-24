import type { NextFunction, Request, Response } from "express";
import express from "express";
import FollowCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as FollowValidator from "../follow/middleware";
import * as ChannelValidator from "../channel/middleware";
import * as util from "./util";

const router = express.Router();

/**
 * Get the follow metadata
 *
 * @name GET /api/follow
 *
 * @return {FollowResponse[]} - A list of all the Follows sorted in descending
 *                      order by date modified
 */
/**
 * Get Follows by author.
 *
 * @name GET /api/Follows?authorId=id
 *
 * @return {FollowResponse[]} - An array of Follows created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.channelId !== undefined) {
      next("route");
      return;
    }

    if (req.query.author !== undefined) {
      next();
      return;
    }

    const allFollows = await FollowCollection.findAll();
    const response = allFollows.map(util.constructFollowResponse);
    res.status(200).json(response);
  },
  [userValidator.isAuthorExists],
  async (req: Request, res: Response) => {
    const authorFollows = await FollowCollection.findAllByUsername(
      req.query.author as string
    );
    const response = authorFollows.map(util.constructFollowResponse);
    res.status(200).json(response);
  }
);

/**
 * Get the follow metadata
 *
 * @name GET /api/follow
 *
 * @return {FollowResponse[]} - A list of all the Follows sorted in descending
 *                      order by date modified
 */
/**
 * Get Follows in channel.
 *
 * @name GET /api/Follows?channelId=id
 *
 * @return {FollowResponse[]} - An array of Follows created by user with id, channelId
 * @throws {400} - If channelId is not given
 * @throws {404} - If no user has given channelId
 *
 */

router.get(
  "/",
  [ChannelValidator.isChannelInQueryExists],
  async (req: Request, res: Response) => {
    const channelFollows = await FollowCollection.findAllByChannelId(
      req.query.channelId.toString()
    );
    const response = channelFollows.map(util.constructFollowResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new Follow.
 *
 * @name POST /api/Follows
 *
 * @param {string} channelId - The id of the channel to connect to
 * @return {FollowResponse} - The created Follow
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the Follow title is empty or a stream of empty spaces
 * @throws {413} - If the Follow title is more than 140 characters long
 */
router.post(
  "/",
  [
    userValidator.isUserLoggedIn,
    ChannelValidator.isChannelInBodyExists,
    FollowValidator.isChannelAuthor,
    FollowValidator.isNotDuplicateFollow,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ""; // Will not be an empty string since its validated in isUserLoggedIn
    const Follow = await FollowCollection.addOne(userId, req.body.channelId);

    res.status(201).json({
      message: "Your Follow was created successfully.",
      Follow: util.constructFollowResponse(Follow),
    });
  }
);

/**
 * Delete a follow and all associated follows
 * NOTE: the follow model has not been created yet
 *
 * @name DELETE /api/Follows/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the Follow
 * @throws {404} - If the FollowId is not valid
 */
router.delete(
  "/:followId?",
  [
    userValidator.isUserLoggedIn,
    FollowValidator.isFollowExists,
    FollowValidator.isFollowAuthor,
  ],
  async (req: Request, res: Response) => {
    await FollowCollection.deleteOne(req.params.followId);
    res.status(200).json({
      message: "Your Follow was deleted successfully.",
    });
  }
);

export { router as FollowRouter };
