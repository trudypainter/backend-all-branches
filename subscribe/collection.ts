import type { HydratedDocument, Types } from "mongoose";
import type { Subscribe } from "./model";
import SubscribeModel from "./model";
import UserCollection from "../user/collection";
import ChannelCollection from "../channel/collection";

/**
 * This files contains a class that has the functionality to explore Subscribes
 * stored in MongoDB, including adding, finding, updating, and deleting Subscribes.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Subscribe> is the output of the SubscribeModel() constructor,
 * and contains all the information in Subscribe. https://mongoosejs.com/docs/typescript.html
 */
class SubscribeCollection {
  /**
   * Add a Subscribe to the collection
   *
   * @param {string} authorId - The id of the author of the Subscribe
   * @param {string} subscribingToId - The id of the user to subscribe to
   * @return {Promise<HydratedDocument<Subscribe>>} - The newly created Subscribe
   */
  static async addOne(
    authorId: Types.ObjectId | string,
    subscribingToId: Types.ObjectId | string
  ): Promise<HydratedDocument<Subscribe>> {
    const date = new Date();
    const Subscribe = new SubscribeModel({
      authorId,
      subscribingToId,
      dateCreated: date,
      dateModified: date,
    });
    await Subscribe.save(); // Saves Subscribe to MongoDB
    return Subscribe.populate("authorId");
  }

  /**
   * Find a Subscribe by SubscribeId
   *
   * @param {string} SubscribeId - The id of the Subscribe to find
   * @return {Promise<HydratedDocument<Subscribe>> | Promise<null> } - The Subscribe with the given SubscribeId, if any
   */
  static async findOne(
    SubscribeId: Types.ObjectId | string
  ): Promise<HydratedDocument<Subscribe>> {
    return SubscribeModel.findOne({ _id: SubscribeId })
      .populate("authorId")
      .populate("subscribingToId");
  }

  /**
   * Get all the Subscribes in the database
   *
   * @return {Promise<HydratedDocument<Subscribe>[]>} - An array of all of the Subscribes
   */
  static async findAll(): Promise<Array<HydratedDocument<Subscribe>>> {
    // Retrieves Subscribes and sorts them from most to least recent
    return SubscribeModel.find({})
      .sort({ dateModified: -1 })
      .populate("authorId")
      .populate("subscribingToId");
  }

  /**
   * Get all the Subscribes created by a given author
   *
   * @param {string} userId - The id of author of the Subscribes
   * @return {Promise<HydratedDocument<Subscribe>[]>} - An array of all of the Subscribes
   */
  static async findAllByAuthorId(
    userId: string
  ): Promise<Array<HydratedDocument<Subscribe>>> {
    console.log("looking for ...", userId);
    const author = await UserCollection.findOneByUserId(userId);
    console.log(author);
    return SubscribeModel.find({ authorId: author._id })
      .populate("authorId")
      .populate("subscribingToId");
  }

  /**
   * Get Subscribe for a subscribingTo user
   *
   * @param {string} username - The username of author of the Subscribes
   * @return {Promise<HydratedDocument<Subscribe>[]>} - An array of all of the Subscribes
   */
  static async findAllBySubscribingToId(
    username: string
  ): Promise<Array<HydratedDocument<Subscribe>>> {
    const subcribingTo = await UserCollection.findOneByUsername(username);

    return SubscribeModel.find({
      subscribingToId: subcribingTo._id,
    })
      .populate("authorId")
      .populate("subscribingToId");
  }

  /**
   * Delete a Subscribe with given SubscribeId.
   *
   * @param {string} SubscribeId - The SubscribeId of Subscribe to delete
   * @return {Promise<Boolean>} - true if the Subscribe has been deleted, false otherwise
   */
  static async deleteOne(
    SubscribeId: Types.ObjectId | string
  ): Promise<boolean> {
    const Subscribe = await SubscribeModel.deleteOne({ _id: SubscribeId });
    return Subscribe !== null;
  }

  /**
   * Delete all the Subscribes by the given author
   *
   * @param {string} authorId - The id of author of Subscribes
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await SubscribeModel.deleteMany({ authorId });
  }
}

export default SubscribeCollection;
