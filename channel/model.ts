import type { Types, PopulatedDoc, Document } from "mongoose";
import { Schema, model } from "mongoose";
import type { User } from "../user/model";

/**
 * This file defines the properties stored in a Channel
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Channel on the backend
export type Channel = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  dateCreated: Date;
  title: string;
  description: string;
  dateModified: Date;
};

export type PopulatedChannel = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  dateCreated: Date;
  title: string;
  description: string;
  dateModified: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Channels stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const ChannelSchema = new Schema<Channel>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  // The date the Channel was created
  dateCreated: {
    type: Date,
    required: true,
  },
  // The title of the Channel
  title: {
    type: String,
    required: true,
  },
  // The title of the Channel
  description: {
    type: String,
    required: false,
  },
  // The date the Channel was modified
  dateModified: {
    type: Date,
    required: true,
  },
});

const ChannelModel = model<Channel>("Channel", ChannelSchema);
export default ChannelModel;
