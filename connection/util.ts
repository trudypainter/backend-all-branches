import type { HydratedDocument } from "mongoose";
import moment from "moment";
import type { Connection, PopulatedConnection } from "../connection/model";
import type { Channel } from "../channel/model";
import type { Freet } from "../freet/model";

// Update this if you add a property to the Connection type!
type ConnectionResponse = {
  _id: string;
  author: string;
  channel: Channel;
  freet: Freet;
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
 * Transform a raw Connection object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Connection>} Connection - A Connection
 * @returns {ConnectionResponse} - The Connection object formatted for the frontend
 */
const constructConnectionResponse = (
  Connection: HydratedDocument<Connection>
): ConnectionResponse => {
  const ConnectionCopy: PopulatedConnection = {
    ...Connection.toObject({
      versionKey: false, // Cosmetics; prevents returning of __v property
    }),
  };
  const { username } = ConnectionCopy.authorId;
  delete ConnectionCopy.authorId;
  return {
    // ...ConnectionCopy,
    _id: ConnectionCopy._id.toString(),
    author: username,
    channel: ConnectionCopy.channelId,
    freet: ConnectionCopy.freetId,
    dateCreated: formatDate(Connection.dateCreated),
  };
};

export { constructConnectionResponse };
