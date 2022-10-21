import type { HydratedDocument } from "mongoose";
import moment from "moment";
import type { Follow, PopulatedFollow } from "../follow/model";
import type { Channel } from "../channel/model";

// Update this if you add a property to the Follow type!
type FollowResponse = {
  _id: string;
  author: string;
  channel: Channel;
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
 * Transform a raw Follow object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Follow>} Follow - A Follow
 * @returns {FollowResponse} - The Follow object formatted for the frontend
 */
const constructFollowResponse = (
  Follow: HydratedDocument<Follow>
): FollowResponse => {
  const FollowCopy: PopulatedFollow = {
    ...Follow.toObject({
      versionKey: false, // Cosmetics; prevents returning of __v property
    }),
  };
  const { username } = FollowCopy.authorId;
  delete FollowCopy.authorId;
  return {
    // ...FollowCopy,
    _id: FollowCopy._id.toString(),
    author: username,
    channel: FollowCopy.channelId,
    dateCreated: formatDate(Follow.dateCreated),
  };
};

export { constructFollowResponse };
