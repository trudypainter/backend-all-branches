import type { NextFunction, Request, Response } from "express";
import express from "express";
import ConnectionCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as ConnectionValidator from "../connection/middleware";
import * as FreetValidator from "../freet/middleware";
import * as ChannelValidator from "../channel/middleware";
import * as util from "./util";

const router = express.Router();

/**
 * Get the connection metadata
 *
 * @name GET /api/connection
 *
 * @return {ConnectionResponse[]} - A list of all the Connections sorted in descending
 *                      order by date modified
 */
/**
 * Get Connections by author.
 *
 * @name GET /api/Connections?authorId=id
 *
 * @return {ConnectionResponse[]} - An array of Connections created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.query);
    // Check if authorId query parameter was supplied
    if (req.query.channelId !== undefined || req.query.freetId !== undefined) {
      next("route");
      return;
    }

    if (req.query.author !== undefined) {
      next();
      return;
    }

    const allConnections = await ConnectionCollection.findAll();
    const response = allConnections.map(util.constructConnectionResponse);
    res.status(200).json(response);
  },
  [userValidator.isAuthorExists],
  async (req: Request, res: Response) => {
    const authorConnections = await ConnectionCollection.findAllByUsername(
      req.query.author as string
    );
    const response = authorConnections.map(util.constructConnectionResponse);
    res.status(200).json(response);
  }
);

/**
 * Get Connections in channel.
 *
 * @name GET /api/Connections?channelId=id
 *
 * @return {ConnectionResponse[]} - An array of Connections created by user with id, channelId
 * @throws {400} - If channelId is not given
 * @throws {404} - If no user has given channelId
 *
 */
router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if channelId query parameter was supplied
    if (req.query.freetId !== undefined) {
      next("route");
      return;
    }
    next();
  },
  [ChannelValidator.isChannelInQueryExists],
  async (req: Request, res: Response) => {
    console.log("looking for ", req.query.channelId.toString());
    const channelConnections = await ConnectionCollection.findAllByChannelId(
      req.query.channelId.toString()
    );
    const response = channelConnections.map(util.constructConnectionResponse);
    res.status(200).json(response);
  }
);

/**
 * Get Connections for freet.
 *
 * @name GET /api/Connections?freetId=id
 *
 * @return {ConnectionResponse[]} - An array of Connections created by user with id, freetId
 * @throws {400} - If freetId is not given
 * @throws {404} - If no user has given freetId
 *
 */

router.get(
  "/",
  [FreetValidator.isFreetInQueryExists],
  async (req: Request, res: Response, next: NextFunction) => {
    const channelConnections = await ConnectionCollection.findAllByFreetId(
      req.query.freetId.toString()
    );
    const response = channelConnections.map(util.constructConnectionResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new Connection.
 *
 * @name POST /api/Connections
 *
 * @param {string} channelId - The id of the channel to connect to
 * @param {string} freetId - The id of the Freet connected
 * @return {ConnectionResponse} - The created Connection
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the Connection title is empty or a stream of empty spaces
 * @throws {413} - If the Connection title is more than 140 characters long
 */
router.post(
  "/",
  [
    userValidator.isUserLoggedIn,
    FreetValidator.isFreetInBodyExists,
    ChannelValidator.isChannelInBodyExists,
    ConnectionValidator.isChannelAuthor,
    ConnectionValidator.isNotDuplicateConnection,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ""; // Will not be an empty string since its validated in isUserLoggedIn
    const Connection = await ConnectionCollection.addOne(
      userId,
      req.body.channelId,
      req.body.freetId
    );

    res.status(201).json({
      message: "Your Connection was created successfully.",
      Connection: util.constructConnectionResponse(Connection),
    });
  }
);

/**
 * Delete a connection and all associated connections
 * NOTE: the connection model has not been created yet
 *
 * @name DELETE /api/Connections/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the Connection
 * @throws {404} - If the ConnectionId is not valid
 */
router.delete(
  "/:connectionId?",
  [
    userValidator.isUserLoggedIn,
    ConnectionValidator.isConnectionExists,
    ConnectionValidator.isConnectionAuthor,
  ],
  async (req: Request, res: Response) => {
    console.log(req.params.connectionId);
    await ConnectionCollection.deleteOne(req.params.connectionId);
    res.status(200).json({
      message: "Your Connection was deleted successfully.",
    });
  }
);

export { router as ConnectionRouter };
