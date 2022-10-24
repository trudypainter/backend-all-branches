import type { HydratedDocument } from "mongoose";
import moment from "moment";
import type { Subscribe, PopulatedSubscribe } from "../subscribe/model";
import type { Channel } from "../channel/model";

// Update this if you add a property to the Subscribe type!
type SubscribeResponse = {
  _id: string;
  authorId: string;
  subscribingToId: string;
  dateCreated: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string =>
  moment(date).format("MMMM Do YYYY, h:mm:ss a");

/**
 * Transform a raw Subscribe object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Subscribe>} Subscribe - A Subscribe
 * @returns {SubscribeResponse} - The Subscribe object formatted for the frontend
 */
const constructSubscribeResponse = (
  Subscribe: HydratedDocument<Subscribe>
): SubscribeResponse => {
  const SubscribeCopy: PopulatedSubscribe = {
    ...Subscribe.toObject({
      versionKey: false, // Cosmetics; prevents returning of __v property
    }),
  };
  return {
    // ...SubscribeCopy,
    _id: SubscribeCopy._id.toString(),
    authorId: SubscribeCopy.authorId._id.toString(),
    subscribingToId: SubscribeCopy.subscribingToId._id.toString(),
    dateCreated: formatDate(Subscribe.dateCreated),
  };
};

export { constructSubscribeResponse };
