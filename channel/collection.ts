import type { HydratedDocument, Types } from "mongoose";
import type { Channel } from "./model";
import ChannelModel from "./model";
import UserCollection from "../user/collection";

/**
 * This files contains a class that has the functionality to explore channels
 * stored in MongoDB, including adding, finding, updating, and deleting channels.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Channel> is the output of the ChannelModel() constructor,
 * and contains all the information in Channel. https://mongoosejs.com/docs/typescript.html
 */
class ChannelCollection {
  /**
   * Add a Channel to the collection
   *
   * @param {string} authorId - The id of the author of the Channel
   * @param {string} title - The title of the Channel
   * @param {string} description - The description of the Channel
   * @return {Promise<HydratedDocument<Channel>>} - The newly created Channel
   */
  static async addOne(
    authorId: Types.ObjectId | string,
    title: string,
    description: string
  ): Promise<HydratedDocument<Channel>> {
    const date = new Date();
    const Channel = new ChannelModel({
      authorId,
      dateCreated: date,
      title,
      description,
      dateModified: date,
    });
    await Channel.save(); // Saves Channel to MongoDB
    return Channel.populate("authorId");
  }

  /**
   * Find a Channel by ChannelId
   *
   * @param {string} ChannelId - The id of the Channel to find
   * @return {Promise<HydratedDocument<Channel>> | Promise<null> } - The Channel with the given ChannelId, if any
   */
  static async findOne(
    ChannelId: Types.ObjectId | string
  ): Promise<HydratedDocument<Channel>> {
    return ChannelModel.findOne({ _id: ChannelId }).populate("authorId");
  }

  /**
   * Get all the Channels in the database
   *
   * @return {Promise<HydratedDocument<Channel>[]>} - An array of all of the Channels
   */
  static async findAll(): Promise<Array<HydratedDocument<Channel>>> {
    // Retrieves Channels and sorts them from most to least recent
    return ChannelModel.find({})
      .sort({ dateModified: -1 })
      .populate("authorId");
  }

  /**
   * Get all the Channels in by given author
   *
   * @param {string} username - The username of author of the Channels
   * @return {Promise<HydratedDocument<Channel>[]>} - An array of all of the Channels
   */
  static async findAllByUsername(
    username: string
  ): Promise<Array<HydratedDocument<Channel>>> {
    const author = await UserCollection.findOneByUsername(username);
    return ChannelModel.find({ authorId: author._id }).populate("authorId");
  }

  /**
   * Update a Channel with the new title + description
   *
   * @param {string} ChannelId - The id of the Channel to be updated
   * @param {string} title - The new title of the Channel
   * @param {string} description - The new description of the Channel
   * @return {Promise<HydratedDocument<Channel>>} - The newly updated Channel
   */
  static async updateOne(
    ChannelId: Types.ObjectId | string,
    title: string,
    description: string
  ): Promise<HydratedDocument<Channel>> {
    const Channel = await ChannelModel.findOne({ _id: ChannelId });
    Channel.title = title;
    Channel.description = description;
    Channel.dateModified = new Date();
    await Channel.save();
    return Channel.populate("authorId");
  }

  /**
   * Delete a Channel with given ChannelId.
   *
   * @param {string} ChannelId - The ChannelId of Channel to delete
   * @return {Promise<Boolean>} - true if the Channel has been deleted, false otherwise
   */
  static async deleteOne(ChannelId: Types.ObjectId | string): Promise<boolean> {
    console.log("channle id passed: ", ChannelId);
    const Channel = await ChannelModel.deleteOne({ _id: ChannelId.toString() });
    console.log("channel response, ", Channel);
    return Channel !== null;
  }

  /**
   * Delete all the Channels by the given author
   *
   * @param {string} authorId - The id of author of Channels
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await ChannelModel.deleteMany({ authorId });
  }
}

export default ChannelCollection;
