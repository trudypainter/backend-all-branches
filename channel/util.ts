import type { HydratedDocument } from "mongoose";
import moment from "moment";
import type { Channel, PopulatedChannel } from "../channel/model";

// Update this if you add a property to the Channel type!
type ChannelResponse = {
  _id: string;
  author: string;
  dateCreated: string;
  title: string;
  description: string;
  dateModified: string;
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
 * Transform a raw Channel object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Channel>} Channel - A Channel
 * @returns {ChannelResponse} - The Channel object formatted for the frontend
 */
const constructChannelResponse = (
  Channel: HydratedDocument<Channel>
): ChannelResponse => {
  const ChannelCopy: PopulatedChannel = {
    ...Channel.toObject({
      versionKey: false, // Cosmetics; prevents returning of __v property
    }),
  };
  const { username } = ChannelCopy.authorId;
  delete ChannelCopy.authorId;
  return {
    ...ChannelCopy,
    _id: ChannelCopy._id.toString(),
    author: username,
    title: ChannelCopy.title,
    description: ChannelCopy.description,
    dateCreated: formatDate(Channel.dateCreated),
    dateModified: formatDate(Channel.dateModified),
  };
};

export { constructChannelResponse };
