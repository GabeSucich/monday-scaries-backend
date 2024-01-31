/* tslint:disable */
/* eslint-disable */

// ######################################## THIS FILE WAS GENERATED BY MONGOOSE-TSGEN ######################################## //

// NOTE: ANY CHANGES MADE WILL BE OVERWRITTEN ON SUBSEQUENT EXECUTIONS OF MONGOOSE-TSGEN.

import mongoose from "mongoose";

/**
 * Lean version of BettorDepositDocument
 *
 * This has all Mongoose getters & functions removed. This type will be returned from `BettorDocument.toObject()`.
 * ```
 * const bettorObject = bettor.toObject();
 * ```
 */
export type BettorDeposit = {
  amount: number;
  isReBuy: boolean;
  createdAt: number;
  _id: mongoose.Types.ObjectId;
};

/**
 * Lean version of BettorDocument
 *
 * This has all Mongoose getters & functions removed. This type will be returned from `BettorDocument.toObject()`. To avoid conflicts with model names, use the type alias `BettorObject`.
 * ```
 * const bettorObject = bettor.toObject();
 * ```
 */
export type Bettor = {
  user: User["_id"] | User;
  bettorGroup: BettorGroup["_id"] | BettorGroup;
  createdAt: number;
  balance: number;
  deposits: BettorDeposit[];
  _id: mongoose.Types.ObjectId;
};

/**
 * Lean version of BettorDocument (type alias of `Bettor`)
 *
 * Use this type alias to avoid conflicts with model names:
 * ```
 * import { Bettor } from "../models"
 * import { BettorObject } from "../interfaces/mongoose.gen.ts"
 *
 * const bettorObject: BettorObject = bettor.toObject();
 * ```
 */
export type BettorObject = Bettor;

/**
 * Mongoose Query type
 *
 * This type is returned from query functions. For most use cases, you should not need to use this type explicitly.
 */
export type BettorQuery = mongoose.Query<any, BettorDocument, BettorQueries> &
  BettorQueries;

/**
 * Mongoose Query helper types
 *
 * This type represents `BettorSchema.query`. For most use cases, you should not need to use this type explicitly.
 */
export type BettorQueries = {};

export type BettorMethods = {};

export type BettorStatics = {};

/**
 * Mongoose Model type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const Bettor = mongoose.model<BettorDocument, BettorModel>("Bettor", BettorSchema);
 * ```
 */
export type BettorModel = mongoose.Model<BettorDocument, BettorQueries> &
  BettorStatics;

/**
 * Mongoose Schema type
 *
 * Assign this type to new Bettor schema instances:
 * ```
 * const BettorSchema: BettorSchema = new mongoose.Schema({ ... })
 * ```
 */
export type BettorSchema = mongoose.Schema<
  BettorDocument,
  BettorModel,
  BettorMethods,
  BettorQueries
>;

/**
 * Mongoose Subdocument type
 *
 * Type of `BettorDocument["deposits"]` element.
 */
export type BettorDepositDocument = mongoose.Types.Subdocument & {
  amount: number;
  isReBuy: boolean;
  createdAt: number;
  _id: mongoose.Types.ObjectId;
};

/**
 * Mongoose Document type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const Bettor = mongoose.model<BettorDocument, BettorModel>("Bettor", BettorSchema);
 * ```
 */
export type BettorDocument = mongoose.Document<
  mongoose.Types.ObjectId,
  BettorQueries
> &
  BettorMethods & {
    user: UserDocument["_id"] | UserDocument;
    bettorGroup: BettorGroupDocument["_id"] | BettorGroupDocument;
    createdAt: number;
    balance: number;
    deposits: mongoose.Types.DocumentArray<BettorDepositDocument>;
    _id: mongoose.Types.ObjectId;
  };

/**
 * Lean version of BettorGroupDocument
 *
 * This has all Mongoose getters & functions removed. This type will be returned from `BettorGroupDocument.toObject()`. To avoid conflicts with model names, use the type alias `BettorGroupObject`.
 * ```
 * const bettorgroupObject = bettorgroup.toObject();
 * ```
 */
export type BettorGroup = {
  name: string;
  createdAt: Date;
  adminBettor?: User["_id"] | User;
  maxDeposit: number;
  maxDepositBalance?: number;
  bettors: (Bettor["_id"] | Bettor)[];
  _id: mongoose.Types.ObjectId;
};

/**
 * Lean version of BettorGroupDocument (type alias of `BettorGroup`)
 *
 * Use this type alias to avoid conflicts with model names:
 * ```
 * import { BettorGroup } from "../models"
 * import { BettorGroupObject } from "../interfaces/mongoose.gen.ts"
 *
 * const bettorgroupObject: BettorGroupObject = bettorgroup.toObject();
 * ```
 */
export type BettorGroupObject = BettorGroup;

/**
 * Mongoose Query type
 *
 * This type is returned from query functions. For most use cases, you should not need to use this type explicitly.
 */
export type BettorGroupQuery = mongoose.Query<
  any,
  BettorGroupDocument,
  BettorGroupQueries
> &
  BettorGroupQueries;

/**
 * Mongoose Query helper types
 *
 * This type represents `BettorGroupSchema.query`. For most use cases, you should not need to use this type explicitly.
 */
export type BettorGroupQueries = {};

export type BettorGroupMethods = {};

export type BettorGroupStatics = {};

/**
 * Mongoose Model type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const BettorGroup = mongoose.model<BettorGroupDocument, BettorGroupModel>("BettorGroup", BettorGroupSchema);
 * ```
 */
export type BettorGroupModel = mongoose.Model<
  BettorGroupDocument,
  BettorGroupQueries
> &
  BettorGroupStatics;

/**
 * Mongoose Schema type
 *
 * Assign this type to new BettorGroup schema instances:
 * ```
 * const BettorGroupSchema: BettorGroupSchema = new mongoose.Schema({ ... })
 * ```
 */
export type BettorGroupSchema = mongoose.Schema<
  BettorGroupDocument,
  BettorGroupModel,
  BettorGroupMethods,
  BettorGroupQueries
>;

/**
 * Mongoose Document type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const BettorGroup = mongoose.model<BettorGroupDocument, BettorGroupModel>("BettorGroup", BettorGroupSchema);
 * ```
 */
export type BettorGroupDocument = mongoose.Document<
  mongoose.Types.ObjectId,
  BettorGroupQueries
> &
  BettorGroupMethods & {
    name: string;
    createdAt: Date;
    adminBettor?: UserDocument["_id"] | UserDocument;
    maxDeposit: number;
    maxDepositBalance?: number;
    bettors: mongoose.Types.Array<BettorDocument["_id"] | BettorDocument>;
    _id: mongoose.Types.ObjectId;
  };

/**
 * Lean version of ServerErrorDocument
 *
 * This has all Mongoose getters & functions removed. This type will be returned from `ServerErrorDocument.toObject()`. To avoid conflicts with model names, use the type alias `ServerErrorObject`.
 * ```
 * const servererrorObject = servererror.toObject();
 * ```
 */
export type ServerError = {
  createdAt: Date;
  errorString: string;
  traceback?: string;
  description: string;
  _id: mongoose.Types.ObjectId;
};

/**
 * Lean version of ServerErrorDocument (type alias of `ServerError`)
 *
 * Use this type alias to avoid conflicts with model names:
 * ```
 * import { ServerError } from "../models"
 * import { ServerErrorObject } from "../interfaces/mongoose.gen.ts"
 *
 * const servererrorObject: ServerErrorObject = servererror.toObject();
 * ```
 */
export type ServerErrorObject = ServerError;

/**
 * Mongoose Query type
 *
 * This type is returned from query functions. For most use cases, you should not need to use this type explicitly.
 */
export type ServerErrorQuery = mongoose.Query<
  any,
  ServerErrorDocument,
  ServerErrorQueries
> &
  ServerErrorQueries;

/**
 * Mongoose Query helper types
 *
 * This type represents `ServerErrorSchema.query`. For most use cases, you should not need to use this type explicitly.
 */
export type ServerErrorQueries = {};

export type ServerErrorMethods = {};

export type ServerErrorStatics = {};

/**
 * Mongoose Model type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const ServerError = mongoose.model<ServerErrorDocument, ServerErrorModel>("ServerError", ServerErrorSchema);
 * ```
 */
export type ServerErrorModel = mongoose.Model<
  ServerErrorDocument,
  ServerErrorQueries
> &
  ServerErrorStatics;

/**
 * Mongoose Schema type
 *
 * Assign this type to new ServerError schema instances:
 * ```
 * const ServerErrorSchema: ServerErrorSchema = new mongoose.Schema({ ... })
 * ```
 */
export type ServerErrorSchema = mongoose.Schema<
  ServerErrorDocument,
  ServerErrorModel,
  ServerErrorMethods,
  ServerErrorQueries
>;

/**
 * Mongoose Document type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const ServerError = mongoose.model<ServerErrorDocument, ServerErrorModel>("ServerError", ServerErrorSchema);
 * ```
 */
export type ServerErrorDocument = mongoose.Document<
  mongoose.Types.ObjectId,
  ServerErrorQueries
> &
  ServerErrorMethods & {
    createdAt: Date;
    errorString: string;
    traceback?: string;
    description: string;
    _id: mongoose.Types.ObjectId;
  };

/**
 * Lean version of UserDocument
 *
 * This has all Mongoose getters & functions removed. This type will be returned from `UserDocument.toObject()`. To avoid conflicts with model names, use the type alias `UserObject`.
 * ```
 * const userObject = user.toObject();
 * ```
 */
export type User = {
  isAdmin: boolean;
  firstName: string;
  lastName: string;
  username: string;
  email?: string;
  createdAt: Date;
  _id: mongoose.Types.ObjectId;
  hash?: string;
  salt?: string;
};

/**
 * Lean version of UserDocument (type alias of `User`)
 *
 * Use this type alias to avoid conflicts with model names:
 * ```
 * import { User } from "../models"
 * import { UserObject } from "../interfaces/mongoose.gen.ts"
 *
 * const userObject: UserObject = user.toObject();
 * ```
 */
export type UserObject = User;

/**
 * Mongoose Query type
 *
 * This type is returned from query functions. For most use cases, you should not need to use this type explicitly.
 */
export type UserQuery = mongoose.Query<any, UserDocument, UserQueries> &
  UserQueries;

/**
 * Mongoose Query helper types
 *
 * This type represents `UserSchema.query`. For most use cases, you should not need to use this type explicitly.
 */
export type UserQueries = {};

export type UserMethods = {
  setPassword: (this: UserDocument, ...args: any[]) => any;
  changePassword: (this: UserDocument, ...args: any[]) => any;
  authenticate: (this: UserDocument, ...args: any[]) => any;
};

export type UserStatics = {
  authenticate: (this: UserModel, ...args: any[]) => any;
  serializeUser: (this: UserModel, ...args: any[]) => any;
  deserializeUser: (this: UserModel, ...args: any[]) => any;
  register: (this: UserModel, ...args: any[]) => any;
  findByUsername: (this: UserModel, ...args: any[]) => any;
  createStrategy: (this: UserModel, ...args: any[]) => any;
};

/**
 * Mongoose Model type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const User = mongoose.model<UserDocument, UserModel>("User", UserSchema);
 * ```
 */
export type UserModel = mongoose.Model<UserDocument, UserQueries> & UserStatics;

/**
 * Mongoose Schema type
 *
 * Assign this type to new User schema instances:
 * ```
 * const UserSchema: UserSchema = new mongoose.Schema({ ... })
 * ```
 */
export type UserSchema = mongoose.Schema<
  UserDocument,
  UserModel,
  UserMethods,
  UserQueries
>;

/**
 * Mongoose Document type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const User = mongoose.model<UserDocument, UserModel>("User", UserSchema);
 * ```
 */
export type UserDocument = mongoose.Document<
  mongoose.Types.ObjectId,
  UserQueries
> &
  UserMethods & {
    isAdmin: boolean;
    firstName: string;
    lastName: string;
    username: string;
    email?: string;
    createdAt: Date;
    _id: mongoose.Types.ObjectId;
    hash?: string;
    salt?: string;
  };

/**
 * Lean version of WagerDocument
 *
 * This has all Mongoose getters & functions removed. This type will be returned from `WagerDocument.toObject()`. To avoid conflicts with model names, use the type alias `WagerObject`.
 * ```
 * const wagerObject = wager.toObject();
 * ```
 */
export type Wager = {
  createdAt: number;
  bettor: Bettor["_id"] | Bettor;
  amount: number;
  odds: number;
  contestDate: string;
  description: string;
  live: boolean;
  details: {
    betType?: string;
    sport?: string;
  };
  result?: string;
  payout?: number;
  _id: mongoose.Types.ObjectId;
};

/**
 * Lean version of WagerDocument (type alias of `Wager`)
 *
 * Use this type alias to avoid conflicts with model names:
 * ```
 * import { Wager } from "../models"
 * import { WagerObject } from "../interfaces/mongoose.gen.ts"
 *
 * const wagerObject: WagerObject = wager.toObject();
 * ```
 */
export type WagerObject = Wager;

/**
 * Mongoose Query type
 *
 * This type is returned from query functions. For most use cases, you should not need to use this type explicitly.
 */
export type WagerQuery = mongoose.Query<any, WagerDocument, WagerQueries> &
  WagerQueries;

/**
 * Mongoose Query helper types
 *
 * This type represents `WagerSchema.query`. For most use cases, you should not need to use this type explicitly.
 */
export type WagerQueries = {};

export type WagerMethods = {};

export type WagerStatics = {};

/**
 * Mongoose Model type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const Wager = mongoose.model<WagerDocument, WagerModel>("Wager", WagerSchema);
 * ```
 */
export type WagerModel = mongoose.Model<WagerDocument, WagerQueries> &
  WagerStatics;

/**
 * Mongoose Schema type
 *
 * Assign this type to new Wager schema instances:
 * ```
 * const WagerSchema: WagerSchema = new mongoose.Schema({ ... })
 * ```
 */
export type WagerSchema = mongoose.Schema<
  WagerDocument,
  WagerModel,
  WagerMethods,
  WagerQueries
>;

/**
 * Mongoose Document type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const Wager = mongoose.model<WagerDocument, WagerModel>("Wager", WagerSchema);
 * ```
 */
export type WagerDocument = mongoose.Document<
  mongoose.Types.ObjectId,
  WagerQueries
> &
  WagerMethods & {
    createdAt: number;
    bettor: BettorDocument["_id"] | BettorDocument;
    amount: number;
    odds: number;
    contestDate: string;
    description: string;
    live: boolean;
    details: {
      betType?: string;
      sport?: string;
    };
    result?: string;
    payout?: number;
    _id: mongoose.Types.ObjectId;
  };

/**
 * Check if a property on a document is populated:
 * ```
 * import { IsPopulated } from "../interfaces/mongoose.gen.ts"
 *
 * if (IsPopulated<UserDocument["bestFriend"]>) { ... }
 * ```
 */
export function IsPopulated<T>(doc: T | mongoose.Types.ObjectId): doc is T {
  return doc instanceof mongoose.Document;
}

/**
 * Helper type used by `PopulatedDocument`. Returns the parent property of a string
 * representing a nested property (i.e. `friend.user` -> `friend`)
 */
type ParentProperty<T> = T extends `${infer P}.${string}` ? P : never;

/**
 * Helper type used by `PopulatedDocument`. Returns the child property of a string
 * representing a nested property (i.e. `friend.user` -> `user`).
 */
type ChildProperty<T> = T extends `${string}.${infer C}` ? C : never;

/**
 * Helper type used by `PopulatedDocument`. Removes the `ObjectId` from the general union type generated
 * for ref documents (i.e. `mongoose.Types.ObjectId | UserDocument` -> `UserDocument`)
 */
type PopulatedProperty<Root, T extends keyof Root> = Omit<Root, T> & {
  [ref in T]: Root[T] extends mongoose.Types.Array<infer U>
    ? mongoose.Types.Array<Exclude<U, mongoose.Types.ObjectId>>
    : Exclude<Root[T], mongoose.Types.ObjectId>;
};

/**
 * Populate properties on a document type:
 * ```
 * import { PopulatedDocument } from "../interfaces/mongoose.gen.ts"
 *
 * function example(user: PopulatedDocument<UserDocument, "bestFriend">) {
 *   console.log(user.bestFriend._id) // typescript knows this is populated
 * }
 * ```
 */
export type PopulatedDocument<DocType, T> = T extends keyof DocType
  ? PopulatedProperty<DocType, T>
  : ParentProperty<T> extends keyof DocType
  ? Omit<DocType, ParentProperty<T>> & {
      [ref in ParentProperty<T>]: DocType[ParentProperty<T>] extends mongoose.Types.Array<
        infer U
      >
        ? mongoose.Types.Array<
            ChildProperty<T> extends keyof U
              ? PopulatedProperty<U, ChildProperty<T>>
              : PopulatedDocument<U, ChildProperty<T>>
          >
        : ChildProperty<T> extends keyof DocType[ParentProperty<T>]
        ? PopulatedProperty<DocType[ParentProperty<T>], ChildProperty<T>>
        : PopulatedDocument<DocType[ParentProperty<T>], ChildProperty<T>>;
    }
  : DocType;

/**
 * Helper types used by the populate overloads
 */
type Unarray<T> = T extends Array<infer U> ? U : T;
type Modify<T, R> = Omit<T, keyof R> & R;

/**
 * Augment mongoose with Query.populate overloads
 */
declare module "mongoose" {
  interface Query<ResultType, DocType, THelpers = {}> {
    populate<T extends string>(
      path: T,
      select?: string | any,
      model?: string | Model<any, THelpers>,
      match?: any
    ): Query<
      ResultType extends Array<DocType>
        ? Array<PopulatedDocument<Unarray<ResultType>, T>>
        : ResultType extends DocType
        ? PopulatedDocument<Unarray<ResultType>, T>
        : ResultType,
      DocType,
      THelpers
    > &
      THelpers;

    populate<T extends string>(
      options: Modify<PopulateOptions, { path: T }> | Array<PopulateOptions>
    ): Query<
      ResultType extends Array<DocType>
        ? Array<PopulatedDocument<Unarray<ResultType>, T>>
        : ResultType extends DocType
        ? PopulatedDocument<Unarray<ResultType>, T>
        : ResultType,
      DocType,
      THelpers
    > &
      THelpers;
  }
}
