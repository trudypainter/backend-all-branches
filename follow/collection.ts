import type { HydratedDocument, Types } from "mongoose";
import type { Follow } from "./model";
import FollowModel from "./model";
import UserCollection from "../user/collection";
import ChannelCollection from "../channel/collection";

/**
 * This files contains a class that has the functionality to explore Follows
 * stored in MongoDB, including adding, finding, updating, and deleting Follows.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Follow> is the output of the FollowModel() constructor,
 * and contains all the information in Follow. https://mongoosejs.com/docs/typescript.html
 */
class FollowCollection {
  /**
   * Add a Follow to the collection
   *
   * @param {string} authorId - The id of the author of the Follow
   * @param {string} channelId - The id of the channel to connect to
   * @return {Promise<HydratedDocument<Follow>>} - The newly created Follow
   */
  static async addOne(
    authorId: Types.ObjectId | string,
    channelId: Types.ObjectId | string
  ): Promise<HydratedDocument<Follow>> {
    const date = new Date();
    const Follow = new FollowModel({
      authorId,
      channelId,
      dateCreated: date,
      dateModified: date,
    });
    await Follow.save(); // Saves Follow to MongoDB
    return Follow.populate("authorId");
  }

  /**
   * Find a Follow by FollowId
   *
   * @param {string} FollowId - The id of the Follow to find
   * @return {Promise<HydratedDocument<Follow>> | Promise<null> } - The Follow with the given FollowId, if any
   */
  static async findOne(
    FollowId: Types.ObjectId | string
  ): Promise<HydratedDocument<Follow>> {
    return FollowModel.findOne({ _id: FollowId })
      .populate("authorId")
      .populate("channelId");
  }

  /**
   * Get all the Follows in the database
   *
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the Follows
   */
  static async findAll(): Promise<Array<HydratedDocument<Follow>>> {
    // Retrieves Follows and sorts them from most to least recent
    return FollowModel.find({})
      .sort({ dateModified: -1 })
      .populate("authorId")
      .populate("channelId");
  }

  /**
   * Get all the Follows in by given author
   *
   * @param {string} username - The username of author of the Follows
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the Follows
   */
  static async findAllByUsername(
    username: string
  ): Promise<Array<HydratedDocument<Follow>>> {
    console.log("looking for ...", username);
    const author = await UserCollection.findOneByUsername(username);
    console.log(author);
    return FollowModel.find({ authorId: author._id })
      .populate("authorId")
      .populate("channelId");
  }

  /**
   * Get all the Follows in by given author
   *
   * @param {string} username - The username of author of the Follows
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the Follows
   */
  static async findAllByUserId(
    userId: string
  ): Promise<Array<HydratedDocument<Follow>>> {
    console.log("looking for ...", userId);
    const author = await UserCollection.findOneByUserId(userId);
    console.log(author);
    return FollowModel.find({ authorId: author._id })
      .populate("authorId")
      .populate("channelId");
  }

  /**
   * Get Follow by author and channel name
   *
   * @param {string} username - The username of author of the Follows
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the Follows
   */
  static async findAllByUserAndChannelId(
    userId: string,
    channelId: string
  ): Promise<Array<HydratedDocument<Follow>>> {
    const author = await UserCollection.findOneByUsername(userId);
    const channel = await ChannelCollection.findOne(channelId);
    return FollowModel.find({
      authorId: author._id,
      channel: { channelId: channelId },
    })
      .populate("authorId")
      .populate("channelId");
  }

  // /**
  // ⭐️ CONNECTIONS ARE IMMUTABLE
  //  * Update a Follow with the new title + description
  //  *
  //  * @param {string} FollowId - The id of the Follow to be updated
  //  * @param {string} title - The new title of the Follow
  //  * @param {string} description - The new description of the Follow
  //  * @return {Promise<HydratedDocument<Follow>>} - The newly updated Follow
  //  */
  // static async updateOne(
  //   FollowId: Types.ObjectId | string,
  //   title: string,
  //   description: string
  // ): Promise<HydratedDocument<Follow>> {
  //   const Follow = await FollowModel.findOne({ _id: FollowId });
  //   Follow.title = title;
  //   Follow.description = description;
  //   Follow.dateModified = new Date();
  //   await Follow.save();
  //   return Follow.populate("authorId");
  // }

  /**
   * Delete a Follow with given FollowId.
   *
   * @param {string} FollowId - The FollowId of Follow to delete
   * @return {Promise<Boolean>} - true if the Follow has been deleted, false otherwise
   */
  static async deleteOne(FollowId: Types.ObjectId | string): Promise<boolean> {
    const Follow = await FollowModel.deleteOne({ _id: FollowId });
    return Follow !== null;
  }

  /**
   * Delete all the Follows by the given author
   *
   * @param {string} authorId - The id of author of Follows
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await FollowModel.deleteMany({ authorId });
  }
}

export default FollowCollection;
