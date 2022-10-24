import type { Types, PopulatedDoc, Document } from "mongoose";
import { Schema, model } from "mongoose";
import type { User } from "../user/model";
import type { Channel } from "../channel/model";

/**
 * This file defines the properties stored in a Subscribe
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Subscribe on the backend
export type Subscribe = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  subscribingToId: Types.ObjectId;
  dateCreated: Date;
};

export type PopulatedSubscribe = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  subscribingToId: User;
  dateCreated: Date;
  dateModified: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Subscribes stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const SubscribeSchema = new Schema<Subscribe>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  // The channel subscribingToId
  subscribingToId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },

  // The date the Subscribe was created
  dateCreated: {
    type: Date,
    required: true,
  },
});

const SubscribeModel = model<Subscribe>("Subscribe", SubscribeSchema);
export default SubscribeModel;
