import type { HydratedDocument, Types } from "mongoose";
import type { Connection } from "./model";
import ConnectionModel from "./model";
import UserCollection from "../user/collection";
import ChannelCollection from "../channel/collection";
import FreetCollection from "../freet/collection";

/**
 * This files contains a class that has the functionality to explore Connections
 * stored in MongoDB, including adding, finding, updating, and deleting Connections.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Connection> is the output of the ConnectionModel() constructor,
 * and contains all the information in Connection. https://mongoosejs.com/docs/typescript.html
 */
class ConnectionCollection {
  /**
   * Add a Connection to the collection
   *
   * @param {string} authorId - The id of the author of the Connection
   * @param {string} channelId - The id of the channel to connect to
   * @param {string} freetId - The id of the Freet connected
   * @return {Promise<HydratedDocument<Connection>>} - The newly created Connection
   */
  static async addOne(
    authorId: Types.ObjectId | string,
    channelId: Types.ObjectId | string,
    freetId: Types.ObjectId | string
  ): Promise<HydratedDocument<Connection>> {
    const date = new Date();
    const Connection = new ConnectionModel({
      authorId,
      channelId,
      freetId,
      dateCreated: date,
      dateModified: date,
    });
    await Connection.save(); // Saves Connection to MongoDB
    return Connection.populate("authorId");
  }

  /**
   * Find a Connection by ConnectionId
   *
   * @param {string} ConnectionId - The id of the Connection to find
   * @return {Promise<HydratedDocument<Connection>> | Promise<null> } - The Connection with the given ConnectionId, if any
   */
  static async findOne(
    ConnectionId: Types.ObjectId | string
  ): Promise<HydratedDocument<Connection>> {
    return ConnectionModel.findOne({ _id: ConnectionId })
      .populate("authorId")
      .populate("channelId")
      .populate("freetId");
  }

  /**
   * Get all the Connections in the database
   *
   * @return {Promise<HydratedDocument<Connection>[]>} - An array of all of the Connections
   */
  static async findAll(): Promise<Array<HydratedDocument<Connection>>> {
    // Retrieves Connections and sorts them from most to least recent
    return ConnectionModel.find({})
      .sort({ dateModified: -1 })
      .populate("authorId")
      .populate("channelId")
      .populate("freetId");
  }

  /**
   * Get all the Connections in by given author
   *
   * @param {string} username - The username of author of the Connections
   * @return {Promise<HydratedDocument<Connection>[]>} - An array of all of the Connections
   */
  static async findAllByUsername(
    username: string
  ): Promise<Array<HydratedDocument<Connection>>> {
    const author = await UserCollection.findOneByUsername(username);
    return ConnectionModel.find({ authorId: author._id })
      .populate("authorId")
      .populate("channelId")
      .populate("freetId");
  }

  /**
   * Get all the Connections in a given channel
   *
   * @param {string} channelId - The id of the channel
   * @return {Promise<HydratedDocument<Connection>[]>} - An array of all of the Connections
   */
  static async findAllByChannelId(
    channelId: string
  ): Promise<Array<HydratedDocument<Connection>>> {
    const channel = await ChannelCollection.findOne(channelId);
    return ConnectionModel.find({
      channelId: channel._id,
    })
      .populate("authorId")
      .populate("channelId")
      .populate("freetId");
  }

  /**
   * Get all the Connections for a given freet
   *
   * @param {string} freetId - The id of the freet
   * @return {Promise<HydratedDocument<Connection>[]>} - An array of all of the Connections
   */
  static async findAllByFreetId(
    freetId: string
  ): Promise<Array<HydratedDocument<Connection>>> {
    const freet = await FreetCollection.findOne(freetId);
    console.log("at conneciton for freet", freet);
    return ConnectionModel.find({
      freetId: freet._id,
    })
      .populate("authorId")
      .populate("channelId")
      .populate("freetId");
  }

  /**
   * Delete a Connection with given ConnectionId.
   *
   * @param {string} ConnectionId - The ConnectionId of Connection to delete
   * @return {Promise<Boolean>} - true if the Connection has been deleted, false otherwise
   */
  static async deleteOne(
    connectionId: Types.ObjectId | string
  ): Promise<boolean> {
    const Connection = await ConnectionModel.deleteOne({ _id: connectionId });
    console.log("connection deleted", Connection);
    return Connection !== null;
  }

  /**
   * Delete all the Connections by the given author
   *
   * @param {string} authorId - The id of author of Connections
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await ConnectionModel.deleteMany({ authorId });
  }

  /**
   * Delete all the Connections in a given channel
   *
   * @param {string} channelId - The id of channel having the Connections
   */
  static async deleteForChannel(channelId: string): Promise<boolean> {
    console.log("deleting connections for channel", channelId);
    let connectionDeletes = await ConnectionModel.deleteMany({
      channelId: { _id: channelId },
    });
    console.log("connecitons delted", connectionDeletes);
    return connectionDeletes !== null;
  }
}

export default ConnectionCollection;
