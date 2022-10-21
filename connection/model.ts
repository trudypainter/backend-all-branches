import type { Types, PopulatedDoc, Document } from "mongoose";
import { Schema, model } from "mongoose";
import type { User } from "../user/model";
import type { Channel } from "../channel/model";
import type { Freet } from "../freet/model";

/**
 * This file defines the properties stored in a Connection
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Connection on the backend
export type Connection = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  channelId: Types.ObjectId;
  freetId: Types.ObjectId;
  dateCreated: Date;
};

export type PopulatedConnection = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  channelId: Channel;
  freetId: Freet;
  dateCreated: Date;
  dateModified: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Connections stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const ConnectionSchema = new Schema<Connection>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  // The channel channelId
  channelId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Channel",
  },
  // The freet freetId
  freetId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Freet",
  },
  // The date the Connection was created
  dateCreated: {
    type: Date,
    required: true,
  },
});

const ConnectionModel = model<Connection>("Connection", ConnectionSchema);
export default ConnectionModel;
