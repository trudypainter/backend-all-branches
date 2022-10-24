import type { NextFunction, Request, Response } from "express";
import express from "express";
import SubscribeCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as SubscribeValidator from "../subscribe/middleware";
import UserCollection from "../user/collection";
import * as util from "./util";

const router = express.Router();

/**
 * Get the subscribe metadata
 *
 * @name GET /api/subscribe
 *
 * @return {SubscribeResponse[]} - A list of all the Subscribes sorted in descending
 *                      order by date modified
 */
/**
 * Get Subscribes by author.
 *
 * @name GET /api/subscribes?author=username
 *
 * @return {SubscribeResponse[]} - An array of Subscribes created by user with username
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
/**
 * Get Subscribes by subscribingTo.
 *
 * @name GET /api/subscribes?subscribingTo=username
 *
 * @return {SubscribeResponse[]} - An array of Subscribes created for a user with username
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if just returning all subscribeds
    console.log(req.query);
    if (
      req.query.author !== undefined ||
      req.query.subscribingTo !== undefined
    ) {
      next();
      return;
    }

    const allSubscribes = await SubscribeCollection.findAll();
    const response = allSubscribes.map(util.constructSubscribeResponse);
    res.status(200).json(response);
  },

  async (req: Request, res: Response, next: NextFunction) => {
    // subscribes for subscribingTo
    if (req.query.author !== undefined) {
      next();
      return;
    }
    const authorSubscribes = await SubscribeCollection.findAllBySubscribingToId(
      req.query.subscribingTo.toString()
    );
    const response = authorSubscribes.map(util.constructSubscribeResponse);
    res.status(200).json(response);
  },

  [userValidator.isAuthorExists],
  async (req: Request, res: Response) => {
    // subscribes for author
    let username = req.query.author.toString();
    const userId = await UserCollection.findOneByUsername(username);
    const authorSubscribes = await SubscribeCollection.findAllByAuthorId(
      userId._id.toString()
    );
    const response = authorSubscribes.map(util.constructSubscribeResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new Subscribe.
 *
 * @name POST /api/subscribes
 *
 * @param {string} subscribingTo - The username of the user to subscribe to
 * @return {SubscribeResponse} - The created Subscribe
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the Subscribe title is empty or a stream of empty spaces
 * @throws {413} - If the Subscribe title is more than 140 characters long
 */
router.post(
  "/",
  [userValidator.isUserLoggedIn, SubscribeValidator.isNotDuplicateSubscribe],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ""; // Will not be an empty string since its validated in isUserLoggedIn
    const subcribingTo = await UserCollection.findOneByUsername(
      req.body.subscribingTo
    );
    const Subscribe = await SubscribeCollection.addOne(
      userId,
      subcribingTo._id
    );

    res.status(201).json({
      message: "Your Subscribe was created successfully.",
      Subscribe: util.constructSubscribeResponse(Subscribe),
    });
  }
);

/**
 * Delete a subscribe and all associated subscribes
 * NOTE: the subscribe model has not been created yet
 *
 * @name DELETE /api/subscribes/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the Subscribe
 * @throws {404} - If the SubscribeId is not valid
 */
router.delete(
  "/:subscribeId?",
  [
    userValidator.isUserLoggedIn,
    SubscribeValidator.isSubscribeExists,
    // SubscribeValidator.isSubscribeAuthor,
  ],
  async (req: Request, res: Response) => {
    await SubscribeCollection.deleteOne(req.params.subscribeId);
    res.status(200).json({
      message: "Your Subscribe was deleted successfully.",
    });
  }
);

export { router as SubscribeRouter };
