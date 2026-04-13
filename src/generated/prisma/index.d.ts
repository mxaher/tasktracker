
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Task
 * 
 */
export type Task = $Result.DefaultSelection<Prisma.$TaskPayload>
/**
 * Model Contact
 * 
 */
export type Contact = $Result.DefaultSelection<Prisma.$ContactPayload>
/**
 * Model TaskUpdate
 * 
 */
export type TaskUpdate = $Result.DefaultSelection<Prisma.$TaskUpdatePayload>
/**
 * Model TaskAuditLog
 * 
 */
export type TaskAuditLog = $Result.DefaultSelection<Prisma.$TaskAuditLogPayload>
/**
 * Model DataSource
 * 
 */
export type DataSource = $Result.DefaultSelection<Prisma.$DataSourcePayload>
/**
 * Model Notification
 * 
 */
export type Notification = $Result.DefaultSelection<Prisma.$NotificationPayload>
/**
 * Model NotificationRule
 * 
 */
export type NotificationRule = $Result.DefaultSelection<Prisma.$NotificationRulePayload>
/**
 * Model SystemConfig
 * 
 */
export type SystemConfig = $Result.DefaultSelection<Prisma.$SystemConfigPayload>
/**
 * Model AdminSettings
 * 
 */
export type AdminSettings = $Result.DefaultSelection<Prisma.$AdminSettingsPayload>
/**
 * Model ScheduledReminder
 * 
 */
export type ScheduledReminder = $Result.DefaultSelection<Prisma.$ScheduledReminderPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.task`: Exposes CRUD operations for the **Task** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tasks
    * const tasks = await prisma.task.findMany()
    * ```
    */
  get task(): Prisma.TaskDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.contact`: Exposes CRUD operations for the **Contact** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Contacts
    * const contacts = await prisma.contact.findMany()
    * ```
    */
  get contact(): Prisma.ContactDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.taskUpdate`: Exposes CRUD operations for the **TaskUpdate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TaskUpdates
    * const taskUpdates = await prisma.taskUpdate.findMany()
    * ```
    */
  get taskUpdate(): Prisma.TaskUpdateDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.taskAuditLog`: Exposes CRUD operations for the **TaskAuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TaskAuditLogs
    * const taskAuditLogs = await prisma.taskAuditLog.findMany()
    * ```
    */
  get taskAuditLog(): Prisma.TaskAuditLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.dataSource`: Exposes CRUD operations for the **DataSource** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DataSources
    * const dataSources = await prisma.dataSource.findMany()
    * ```
    */
  get dataSource(): Prisma.DataSourceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notifications
    * const notifications = await prisma.notification.findMany()
    * ```
    */
  get notification(): Prisma.NotificationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.notificationRule`: Exposes CRUD operations for the **NotificationRule** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NotificationRules
    * const notificationRules = await prisma.notificationRule.findMany()
    * ```
    */
  get notificationRule(): Prisma.NotificationRuleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.systemConfig`: Exposes CRUD operations for the **SystemConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SystemConfigs
    * const systemConfigs = await prisma.systemConfig.findMany()
    * ```
    */
  get systemConfig(): Prisma.SystemConfigDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.adminSettings`: Exposes CRUD operations for the **AdminSettings** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AdminSettings
    * const adminSettings = await prisma.adminSettings.findMany()
    * ```
    */
  get adminSettings(): Prisma.AdminSettingsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.scheduledReminder`: Exposes CRUD operations for the **ScheduledReminder** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ScheduledReminders
    * const scheduledReminders = await prisma.scheduledReminder.findMany()
    * ```
    */
  get scheduledReminder(): Prisma.ScheduledReminderDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Task: 'Task',
    Contact: 'Contact',
    TaskUpdate: 'TaskUpdate',
    TaskAuditLog: 'TaskAuditLog',
    DataSource: 'DataSource',
    Notification: 'Notification',
    NotificationRule: 'NotificationRule',
    SystemConfig: 'SystemConfig',
    AdminSettings: 'AdminSettings',
    ScheduledReminder: 'ScheduledReminder'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "task" | "contact" | "taskUpdate" | "taskAuditLog" | "dataSource" | "notification" | "notificationRule" | "systemConfig" | "adminSettings" | "scheduledReminder"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Task: {
        payload: Prisma.$TaskPayload<ExtArgs>
        fields: Prisma.TaskFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TaskFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TaskFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          findFirst: {
            args: Prisma.TaskFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TaskFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          findMany: {
            args: Prisma.TaskFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>[]
          }
          create: {
            args: Prisma.TaskCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          createMany: {
            args: Prisma.TaskCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TaskCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>[]
          }
          delete: {
            args: Prisma.TaskDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          update: {
            args: Prisma.TaskUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          deleteMany: {
            args: Prisma.TaskDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TaskUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TaskUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>[]
          }
          upsert: {
            args: Prisma.TaskUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          aggregate: {
            args: Prisma.TaskAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTask>
          }
          groupBy: {
            args: Prisma.TaskGroupByArgs<ExtArgs>
            result: $Utils.Optional<TaskGroupByOutputType>[]
          }
          count: {
            args: Prisma.TaskCountArgs<ExtArgs>
            result: $Utils.Optional<TaskCountAggregateOutputType> | number
          }
        }
      }
      Contact: {
        payload: Prisma.$ContactPayload<ExtArgs>
        fields: Prisma.ContactFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ContactFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ContactFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactPayload>
          }
          findFirst: {
            args: Prisma.ContactFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ContactFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactPayload>
          }
          findMany: {
            args: Prisma.ContactFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactPayload>[]
          }
          create: {
            args: Prisma.ContactCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactPayload>
          }
          createMany: {
            args: Prisma.ContactCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ContactCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactPayload>[]
          }
          delete: {
            args: Prisma.ContactDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactPayload>
          }
          update: {
            args: Prisma.ContactUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactPayload>
          }
          deleteMany: {
            args: Prisma.ContactDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ContactUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ContactUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactPayload>[]
          }
          upsert: {
            args: Prisma.ContactUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactPayload>
          }
          aggregate: {
            args: Prisma.ContactAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateContact>
          }
          groupBy: {
            args: Prisma.ContactGroupByArgs<ExtArgs>
            result: $Utils.Optional<ContactGroupByOutputType>[]
          }
          count: {
            args: Prisma.ContactCountArgs<ExtArgs>
            result: $Utils.Optional<ContactCountAggregateOutputType> | number
          }
        }
      }
      TaskUpdate: {
        payload: Prisma.$TaskUpdatePayload<ExtArgs>
        fields: Prisma.TaskUpdateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TaskUpdateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskUpdatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TaskUpdateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskUpdatePayload>
          }
          findFirst: {
            args: Prisma.TaskUpdateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskUpdatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TaskUpdateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskUpdatePayload>
          }
          findMany: {
            args: Prisma.TaskUpdateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskUpdatePayload>[]
          }
          create: {
            args: Prisma.TaskUpdateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskUpdatePayload>
          }
          createMany: {
            args: Prisma.TaskUpdateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TaskUpdateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskUpdatePayload>[]
          }
          delete: {
            args: Prisma.TaskUpdateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskUpdatePayload>
          }
          update: {
            args: Prisma.TaskUpdateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskUpdatePayload>
          }
          deleteMany: {
            args: Prisma.TaskUpdateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TaskUpdateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TaskUpdateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskUpdatePayload>[]
          }
          upsert: {
            args: Prisma.TaskUpdateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskUpdatePayload>
          }
          aggregate: {
            args: Prisma.TaskUpdateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTaskUpdate>
          }
          groupBy: {
            args: Prisma.TaskUpdateGroupByArgs<ExtArgs>
            result: $Utils.Optional<TaskUpdateGroupByOutputType>[]
          }
          count: {
            args: Prisma.TaskUpdateCountArgs<ExtArgs>
            result: $Utils.Optional<TaskUpdateCountAggregateOutputType> | number
          }
        }
      }
      TaskAuditLog: {
        payload: Prisma.$TaskAuditLogPayload<ExtArgs>
        fields: Prisma.TaskAuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TaskAuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskAuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TaskAuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskAuditLogPayload>
          }
          findFirst: {
            args: Prisma.TaskAuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskAuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TaskAuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskAuditLogPayload>
          }
          findMany: {
            args: Prisma.TaskAuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskAuditLogPayload>[]
          }
          create: {
            args: Prisma.TaskAuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskAuditLogPayload>
          }
          createMany: {
            args: Prisma.TaskAuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TaskAuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskAuditLogPayload>[]
          }
          delete: {
            args: Prisma.TaskAuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskAuditLogPayload>
          }
          update: {
            args: Prisma.TaskAuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskAuditLogPayload>
          }
          deleteMany: {
            args: Prisma.TaskAuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TaskAuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TaskAuditLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskAuditLogPayload>[]
          }
          upsert: {
            args: Prisma.TaskAuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskAuditLogPayload>
          }
          aggregate: {
            args: Prisma.TaskAuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTaskAuditLog>
          }
          groupBy: {
            args: Prisma.TaskAuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<TaskAuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.TaskAuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<TaskAuditLogCountAggregateOutputType> | number
          }
        }
      }
      DataSource: {
        payload: Prisma.$DataSourcePayload<ExtArgs>
        fields: Prisma.DataSourceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DataSourceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataSourcePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DataSourceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataSourcePayload>
          }
          findFirst: {
            args: Prisma.DataSourceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataSourcePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DataSourceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataSourcePayload>
          }
          findMany: {
            args: Prisma.DataSourceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataSourcePayload>[]
          }
          create: {
            args: Prisma.DataSourceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataSourcePayload>
          }
          createMany: {
            args: Prisma.DataSourceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DataSourceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataSourcePayload>[]
          }
          delete: {
            args: Prisma.DataSourceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataSourcePayload>
          }
          update: {
            args: Prisma.DataSourceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataSourcePayload>
          }
          deleteMany: {
            args: Prisma.DataSourceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DataSourceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DataSourceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataSourcePayload>[]
          }
          upsert: {
            args: Prisma.DataSourceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataSourcePayload>
          }
          aggregate: {
            args: Prisma.DataSourceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDataSource>
          }
          groupBy: {
            args: Prisma.DataSourceGroupByArgs<ExtArgs>
            result: $Utils.Optional<DataSourceGroupByOutputType>[]
          }
          count: {
            args: Prisma.DataSourceCountArgs<ExtArgs>
            result: $Utils.Optional<DataSourceCountAggregateOutputType> | number
          }
        }
      }
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>
        fields: Prisma.NotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NotificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotification>
          }
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationCountAggregateOutputType> | number
          }
        }
      }
      NotificationRule: {
        payload: Prisma.$NotificationRulePayload<ExtArgs>
        fields: Prisma.NotificationRuleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationRuleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationRulePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationRuleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationRulePayload>
          }
          findFirst: {
            args: Prisma.NotificationRuleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationRulePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationRuleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationRulePayload>
          }
          findMany: {
            args: Prisma.NotificationRuleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationRulePayload>[]
          }
          create: {
            args: Prisma.NotificationRuleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationRulePayload>
          }
          createMany: {
            args: Prisma.NotificationRuleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationRuleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationRulePayload>[]
          }
          delete: {
            args: Prisma.NotificationRuleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationRulePayload>
          }
          update: {
            args: Prisma.NotificationRuleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationRulePayload>
          }
          deleteMany: {
            args: Prisma.NotificationRuleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationRuleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NotificationRuleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationRulePayload>[]
          }
          upsert: {
            args: Prisma.NotificationRuleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationRulePayload>
          }
          aggregate: {
            args: Prisma.NotificationRuleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotificationRule>
          }
          groupBy: {
            args: Prisma.NotificationRuleGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationRuleGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationRuleCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationRuleCountAggregateOutputType> | number
          }
        }
      }
      SystemConfig: {
        payload: Prisma.$SystemConfigPayload<ExtArgs>
        fields: Prisma.SystemConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SystemConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SystemConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          findFirst: {
            args: Prisma.SystemConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SystemConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          findMany: {
            args: Prisma.SystemConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>[]
          }
          create: {
            args: Prisma.SystemConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          createMany: {
            args: Prisma.SystemConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SystemConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>[]
          }
          delete: {
            args: Prisma.SystemConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          update: {
            args: Prisma.SystemConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          deleteMany: {
            args: Prisma.SystemConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SystemConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SystemConfigUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>[]
          }
          upsert: {
            args: Prisma.SystemConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          aggregate: {
            args: Prisma.SystemConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSystemConfig>
          }
          groupBy: {
            args: Prisma.SystemConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<SystemConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.SystemConfigCountArgs<ExtArgs>
            result: $Utils.Optional<SystemConfigCountAggregateOutputType> | number
          }
        }
      }
      AdminSettings: {
        payload: Prisma.$AdminSettingsPayload<ExtArgs>
        fields: Prisma.AdminSettingsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AdminSettingsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminSettingsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AdminSettingsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminSettingsPayload>
          }
          findFirst: {
            args: Prisma.AdminSettingsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminSettingsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AdminSettingsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminSettingsPayload>
          }
          findMany: {
            args: Prisma.AdminSettingsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminSettingsPayload>[]
          }
          create: {
            args: Prisma.AdminSettingsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminSettingsPayload>
          }
          createMany: {
            args: Prisma.AdminSettingsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AdminSettingsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminSettingsPayload>[]
          }
          delete: {
            args: Prisma.AdminSettingsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminSettingsPayload>
          }
          update: {
            args: Prisma.AdminSettingsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminSettingsPayload>
          }
          deleteMany: {
            args: Prisma.AdminSettingsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AdminSettingsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AdminSettingsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminSettingsPayload>[]
          }
          upsert: {
            args: Prisma.AdminSettingsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminSettingsPayload>
          }
          aggregate: {
            args: Prisma.AdminSettingsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAdminSettings>
          }
          groupBy: {
            args: Prisma.AdminSettingsGroupByArgs<ExtArgs>
            result: $Utils.Optional<AdminSettingsGroupByOutputType>[]
          }
          count: {
            args: Prisma.AdminSettingsCountArgs<ExtArgs>
            result: $Utils.Optional<AdminSettingsCountAggregateOutputType> | number
          }
        }
      }
      ScheduledReminder: {
        payload: Prisma.$ScheduledReminderPayload<ExtArgs>
        fields: Prisma.ScheduledReminderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ScheduledReminderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScheduledReminderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ScheduledReminderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScheduledReminderPayload>
          }
          findFirst: {
            args: Prisma.ScheduledReminderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScheduledReminderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ScheduledReminderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScheduledReminderPayload>
          }
          findMany: {
            args: Prisma.ScheduledReminderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScheduledReminderPayload>[]
          }
          create: {
            args: Prisma.ScheduledReminderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScheduledReminderPayload>
          }
          createMany: {
            args: Prisma.ScheduledReminderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ScheduledReminderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScheduledReminderPayload>[]
          }
          delete: {
            args: Prisma.ScheduledReminderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScheduledReminderPayload>
          }
          update: {
            args: Prisma.ScheduledReminderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScheduledReminderPayload>
          }
          deleteMany: {
            args: Prisma.ScheduledReminderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ScheduledReminderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ScheduledReminderUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScheduledReminderPayload>[]
          }
          upsert: {
            args: Prisma.ScheduledReminderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScheduledReminderPayload>
          }
          aggregate: {
            args: Prisma.ScheduledReminderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateScheduledReminder>
          }
          groupBy: {
            args: Prisma.ScheduledReminderGroupByArgs<ExtArgs>
            result: $Utils.Optional<ScheduledReminderGroupByOutputType>[]
          }
          count: {
            args: Prisma.ScheduledReminderCountArgs<ExtArgs>
            result: $Utils.Optional<ScheduledReminderCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    task?: TaskOmit
    contact?: ContactOmit
    taskUpdate?: TaskUpdateOmit
    taskAuditLog?: TaskAuditLogOmit
    dataSource?: DataSourceOmit
    notification?: NotificationOmit
    notificationRule?: NotificationRuleOmit
    systemConfig?: SystemConfigOmit
    adminSettings?: AdminSettingsOmit
    scheduledReminder?: ScheduledReminderOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    ownedTasks: number
    assignedTasks: number
    auditLogs: number
    notifications: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ownedTasks?: boolean | UserCountOutputTypeCountOwnedTasksArgs
    assignedTasks?: boolean | UserCountOutputTypeCountAssignedTasksArgs
    auditLogs?: boolean | UserCountOutputTypeCountAuditLogsArgs
    notifications?: boolean | UserCountOutputTypeCountNotificationsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOwnedTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAssignedTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAuditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskAuditLogWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }


  /**
   * Count Type TaskCountOutputType
   */

  export type TaskCountOutputType = {
    auditLogs: number
    notifications: number
    updates: number
  }

  export type TaskCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auditLogs?: boolean | TaskCountOutputTypeCountAuditLogsArgs
    notifications?: boolean | TaskCountOutputTypeCountNotificationsArgs
    updates?: boolean | TaskCountOutputTypeCountUpdatesArgs
  }

  // Custom InputTypes
  /**
   * TaskCountOutputType without action
   */
  export type TaskCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskCountOutputType
     */
    select?: TaskCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TaskCountOutputType without action
   */
  export type TaskCountOutputTypeCountAuditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskAuditLogWhereInput
  }

  /**
   * TaskCountOutputType without action
   */
  export type TaskCountOutputTypeCountNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }

  /**
   * TaskCountOutputType without action
   */
  export type TaskCountOutputTypeCountUpdatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskUpdateWhereInput
  }


  /**
   * Count Type DataSourceCountOutputType
   */

  export type DataSourceCountOutputType = {
    tasks: number
  }

  export type DataSourceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tasks?: boolean | DataSourceCountOutputTypeCountTasksArgs
  }

  // Custom InputTypes
  /**
   * DataSourceCountOutputType without action
   */
  export type DataSourceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataSourceCountOutputType
     */
    select?: DataSourceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DataSourceCountOutputType without action
   */
  export type DataSourceCountOutputTypeCountTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    reminderDaysBefore: number | null
  }

  export type UserSumAggregateOutputType = {
    reminderDaysBefore: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    username: string | null
    name: string | null
    role: string | null
    department: string | null
    phone: string | null
    avatar: string | null
    isActive: boolean | null
    receiveTaskReminders: boolean | null
    receiveDailyDigest: boolean | null
    receiveWeeklyReport: boolean | null
    reminderDaysBefore: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    username: string | null
    name: string | null
    role: string | null
    department: string | null
    phone: string | null
    avatar: string | null
    isActive: boolean | null
    receiveTaskReminders: boolean | null
    receiveDailyDigest: boolean | null
    receiveWeeklyReport: boolean | null
    reminderDaysBefore: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    username: number
    name: number
    role: number
    department: number
    phone: number
    avatar: number
    isActive: number
    receiveTaskReminders: number
    receiveDailyDigest: number
    receiveWeeklyReport: number
    reminderDaysBefore: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    reminderDaysBefore?: true
  }

  export type UserSumAggregateInputType = {
    reminderDaysBefore?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    username?: true
    name?: true
    role?: true
    department?: true
    phone?: true
    avatar?: true
    isActive?: true
    receiveTaskReminders?: true
    receiveDailyDigest?: true
    receiveWeeklyReport?: true
    reminderDaysBefore?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    username?: true
    name?: true
    role?: true
    department?: true
    phone?: true
    avatar?: true
    isActive?: true
    receiveTaskReminders?: true
    receiveDailyDigest?: true
    receiveWeeklyReport?: true
    reminderDaysBefore?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    username?: true
    name?: true
    role?: true
    department?: true
    phone?: true
    avatar?: true
    isActive?: true
    receiveTaskReminders?: true
    receiveDailyDigest?: true
    receiveWeeklyReport?: true
    reminderDaysBefore?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    username: string | null
    name: string | null
    role: string
    department: string | null
    phone: string | null
    avatar: string | null
    isActive: boolean
    receiveTaskReminders: boolean
    receiveDailyDigest: boolean
    receiveWeeklyReport: boolean
    reminderDaysBefore: number
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    name?: boolean
    role?: boolean
    department?: boolean
    phone?: boolean
    avatar?: boolean
    isActive?: boolean
    receiveTaskReminders?: boolean
    receiveDailyDigest?: boolean
    receiveWeeklyReport?: boolean
    reminderDaysBefore?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ownedTasks?: boolean | User$ownedTasksArgs<ExtArgs>
    assignedTasks?: boolean | User$assignedTasksArgs<ExtArgs>
    auditLogs?: boolean | User$auditLogsArgs<ExtArgs>
    notifications?: boolean | User$notificationsArgs<ExtArgs>
    contact?: boolean | User$contactArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    name?: boolean
    role?: boolean
    department?: boolean
    phone?: boolean
    avatar?: boolean
    isActive?: boolean
    receiveTaskReminders?: boolean
    receiveDailyDigest?: boolean
    receiveWeeklyReport?: boolean
    reminderDaysBefore?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    name?: boolean
    role?: boolean
    department?: boolean
    phone?: boolean
    avatar?: boolean
    isActive?: boolean
    receiveTaskReminders?: boolean
    receiveDailyDigest?: boolean
    receiveWeeklyReport?: boolean
    reminderDaysBefore?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    username?: boolean
    name?: boolean
    role?: boolean
    department?: boolean
    phone?: boolean
    avatar?: boolean
    isActive?: boolean
    receiveTaskReminders?: boolean
    receiveDailyDigest?: boolean
    receiveWeeklyReport?: boolean
    reminderDaysBefore?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "username" | "name" | "role" | "department" | "phone" | "avatar" | "isActive" | "receiveTaskReminders" | "receiveDailyDigest" | "receiveWeeklyReport" | "reminderDaysBefore" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ownedTasks?: boolean | User$ownedTasksArgs<ExtArgs>
    assignedTasks?: boolean | User$assignedTasksArgs<ExtArgs>
    auditLogs?: boolean | User$auditLogsArgs<ExtArgs>
    notifications?: boolean | User$notificationsArgs<ExtArgs>
    contact?: boolean | User$contactArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      ownedTasks: Prisma.$TaskPayload<ExtArgs>[]
      assignedTasks: Prisma.$TaskPayload<ExtArgs>[]
      auditLogs: Prisma.$TaskAuditLogPayload<ExtArgs>[]
      notifications: Prisma.$NotificationPayload<ExtArgs>[]
      contact: Prisma.$ContactPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      username: string | null
      name: string | null
      role: string
      department: string | null
      phone: string | null
      avatar: string | null
      isActive: boolean
      receiveTaskReminders: boolean
      receiveDailyDigest: boolean
      receiveWeeklyReport: boolean
      reminderDaysBefore: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    ownedTasks<T extends User$ownedTasksArgs<ExtArgs> = {}>(args?: Subset<T, User$ownedTasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    assignedTasks<T extends User$assignedTasksArgs<ExtArgs> = {}>(args?: Subset<T, User$assignedTasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    auditLogs<T extends User$auditLogsArgs<ExtArgs> = {}>(args?: Subset<T, User$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskAuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    notifications<T extends User$notificationsArgs<ExtArgs> = {}>(args?: Subset<T, User$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    contact<T extends User$contactArgs<ExtArgs> = {}>(args?: Subset<T, User$contactArgs<ExtArgs>>): Prisma__ContactClient<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly department: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly avatar: FieldRef<"User", 'String'>
    readonly isActive: FieldRef<"User", 'Boolean'>
    readonly receiveTaskReminders: FieldRef<"User", 'Boolean'>
    readonly receiveDailyDigest: FieldRef<"User", 'Boolean'>
    readonly receiveWeeklyReport: FieldRef<"User", 'Boolean'>
    readonly reminderDaysBefore: FieldRef<"User", 'Int'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.ownedTasks
   */
  export type User$ownedTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    cursor?: TaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * User.assignedTasks
   */
  export type User$assignedTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    cursor?: TaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * User.auditLogs
   */
  export type User$auditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskAuditLog
     */
    select?: TaskAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskAuditLog
     */
    omit?: TaskAuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskAuditLogInclude<ExtArgs> | null
    where?: TaskAuditLogWhereInput
    orderBy?: TaskAuditLogOrderByWithRelationInput | TaskAuditLogOrderByWithRelationInput[]
    cursor?: TaskAuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskAuditLogScalarFieldEnum | TaskAuditLogScalarFieldEnum[]
  }

  /**
   * User.notifications
   */
  export type User$notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * User.contact
   */
  export type User$contactArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInclude<ExtArgs> | null
    where?: ContactWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Task
   */

  export type AggregateTask = {
    _count: TaskCountAggregateOutputType | null
    _avg: TaskAvgAggregateOutputType | null
    _sum: TaskSumAggregateOutputType | null
    _min: TaskMinAggregateOutputType | null
    _max: TaskMaxAggregateOutputType | null
  }

  export type TaskAvgAggregateOutputType = {
    completion: number | null
  }

  export type TaskSumAggregateOutputType = {
    completion: number | null
  }

  export type TaskMinAggregateOutputType = {
    id: string | null
    taskId: string | null
    title: string | null
    description: string | null
    sentdmMessageId: string | null
    lastReminderSentAt: Date | null
    ownerId: string | null
    assigneeId: string | null
    department: string | null
    priority: string | null
    status: string | null
    strategicPillar: string | null
    completion: number | null
    riskIndicator: string | null
    startDate: Date | null
    dueDate: Date | null
    completedAt: Date | null
    notes: string | null
    nextStep: string | null
    ceoNotes: string | null
    sourceMonth: string | null
    source: string | null
    dataSourceId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TaskMaxAggregateOutputType = {
    id: string | null
    taskId: string | null
    title: string | null
    description: string | null
    sentdmMessageId: string | null
    lastReminderSentAt: Date | null
    ownerId: string | null
    assigneeId: string | null
    department: string | null
    priority: string | null
    status: string | null
    strategicPillar: string | null
    completion: number | null
    riskIndicator: string | null
    startDate: Date | null
    dueDate: Date | null
    completedAt: Date | null
    notes: string | null
    nextStep: string | null
    ceoNotes: string | null
    sourceMonth: string | null
    source: string | null
    dataSourceId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TaskCountAggregateOutputType = {
    id: number
    taskId: number
    title: number
    description: number
    sentdmMessageId: number
    lastReminderSentAt: number
    ownerId: number
    assigneeId: number
    department: number
    priority: number
    status: number
    strategicPillar: number
    completion: number
    riskIndicator: number
    startDate: number
    dueDate: number
    completedAt: number
    notes: number
    nextStep: number
    ceoNotes: number
    sourceMonth: number
    source: number
    dataSourceId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TaskAvgAggregateInputType = {
    completion?: true
  }

  export type TaskSumAggregateInputType = {
    completion?: true
  }

  export type TaskMinAggregateInputType = {
    id?: true
    taskId?: true
    title?: true
    description?: true
    sentdmMessageId?: true
    lastReminderSentAt?: true
    ownerId?: true
    assigneeId?: true
    department?: true
    priority?: true
    status?: true
    strategicPillar?: true
    completion?: true
    riskIndicator?: true
    startDate?: true
    dueDate?: true
    completedAt?: true
    notes?: true
    nextStep?: true
    ceoNotes?: true
    sourceMonth?: true
    source?: true
    dataSourceId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TaskMaxAggregateInputType = {
    id?: true
    taskId?: true
    title?: true
    description?: true
    sentdmMessageId?: true
    lastReminderSentAt?: true
    ownerId?: true
    assigneeId?: true
    department?: true
    priority?: true
    status?: true
    strategicPillar?: true
    completion?: true
    riskIndicator?: true
    startDate?: true
    dueDate?: true
    completedAt?: true
    notes?: true
    nextStep?: true
    ceoNotes?: true
    sourceMonth?: true
    source?: true
    dataSourceId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TaskCountAggregateInputType = {
    id?: true
    taskId?: true
    title?: true
    description?: true
    sentdmMessageId?: true
    lastReminderSentAt?: true
    ownerId?: true
    assigneeId?: true
    department?: true
    priority?: true
    status?: true
    strategicPillar?: true
    completion?: true
    riskIndicator?: true
    startDate?: true
    dueDate?: true
    completedAt?: true
    notes?: true
    nextStep?: true
    ceoNotes?: true
    sourceMonth?: true
    source?: true
    dataSourceId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TaskAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Task to aggregate.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tasks
    **/
    _count?: true | TaskCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TaskAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TaskSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TaskMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TaskMaxAggregateInputType
  }

  export type GetTaskAggregateType<T extends TaskAggregateArgs> = {
        [P in keyof T & keyof AggregateTask]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTask[P]>
      : GetScalarType<T[P], AggregateTask[P]>
  }




  export type TaskGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithAggregationInput | TaskOrderByWithAggregationInput[]
    by: TaskScalarFieldEnum[] | TaskScalarFieldEnum
    having?: TaskScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TaskCountAggregateInputType | true
    _avg?: TaskAvgAggregateInputType
    _sum?: TaskSumAggregateInputType
    _min?: TaskMinAggregateInputType
    _max?: TaskMaxAggregateInputType
  }

  export type TaskGroupByOutputType = {
    id: string
    taskId: string | null
    title: string
    description: string | null
    sentdmMessageId: string | null
    lastReminderSentAt: Date | null
    ownerId: string | null
    assigneeId: string | null
    department: string | null
    priority: string
    status: string
    strategicPillar: string | null
    completion: number
    riskIndicator: string | null
    startDate: Date | null
    dueDate: Date | null
    completedAt: Date | null
    notes: string | null
    nextStep: string | null
    ceoNotes: string | null
    sourceMonth: string | null
    source: string | null
    dataSourceId: string | null
    createdAt: Date
    updatedAt: Date
    _count: TaskCountAggregateOutputType | null
    _avg: TaskAvgAggregateOutputType | null
    _sum: TaskSumAggregateOutputType | null
    _min: TaskMinAggregateOutputType | null
    _max: TaskMaxAggregateOutputType | null
  }

  type GetTaskGroupByPayload<T extends TaskGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TaskGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TaskGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TaskGroupByOutputType[P]>
            : GetScalarType<T[P], TaskGroupByOutputType[P]>
        }
      >
    >


  export type TaskSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    taskId?: boolean
    title?: boolean
    description?: boolean
    sentdmMessageId?: boolean
    lastReminderSentAt?: boolean
    ownerId?: boolean
    assigneeId?: boolean
    department?: boolean
    priority?: boolean
    status?: boolean
    strategicPillar?: boolean
    completion?: boolean
    riskIndicator?: boolean
    startDate?: boolean
    dueDate?: boolean
    completedAt?: boolean
    notes?: boolean
    nextStep?: boolean
    ceoNotes?: boolean
    sourceMonth?: boolean
    source?: boolean
    dataSourceId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | Task$ownerArgs<ExtArgs>
    assignee?: boolean | Task$assigneeArgs<ExtArgs>
    dataSource?: boolean | Task$dataSourceArgs<ExtArgs>
    auditLogs?: boolean | Task$auditLogsArgs<ExtArgs>
    notifications?: boolean | Task$notificationsArgs<ExtArgs>
    updates?: boolean | Task$updatesArgs<ExtArgs>
    _count?: boolean | TaskCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>

  export type TaskSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    taskId?: boolean
    title?: boolean
    description?: boolean
    sentdmMessageId?: boolean
    lastReminderSentAt?: boolean
    ownerId?: boolean
    assigneeId?: boolean
    department?: boolean
    priority?: boolean
    status?: boolean
    strategicPillar?: boolean
    completion?: boolean
    riskIndicator?: boolean
    startDate?: boolean
    dueDate?: boolean
    completedAt?: boolean
    notes?: boolean
    nextStep?: boolean
    ceoNotes?: boolean
    sourceMonth?: boolean
    source?: boolean
    dataSourceId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | Task$ownerArgs<ExtArgs>
    assignee?: boolean | Task$assigneeArgs<ExtArgs>
    dataSource?: boolean | Task$dataSourceArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>

  export type TaskSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    taskId?: boolean
    title?: boolean
    description?: boolean
    sentdmMessageId?: boolean
    lastReminderSentAt?: boolean
    ownerId?: boolean
    assigneeId?: boolean
    department?: boolean
    priority?: boolean
    status?: boolean
    strategicPillar?: boolean
    completion?: boolean
    riskIndicator?: boolean
    startDate?: boolean
    dueDate?: boolean
    completedAt?: boolean
    notes?: boolean
    nextStep?: boolean
    ceoNotes?: boolean
    sourceMonth?: boolean
    source?: boolean
    dataSourceId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | Task$ownerArgs<ExtArgs>
    assignee?: boolean | Task$assigneeArgs<ExtArgs>
    dataSource?: boolean | Task$dataSourceArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>

  export type TaskSelectScalar = {
    id?: boolean
    taskId?: boolean
    title?: boolean
    description?: boolean
    sentdmMessageId?: boolean
    lastReminderSentAt?: boolean
    ownerId?: boolean
    assigneeId?: boolean
    department?: boolean
    priority?: boolean
    status?: boolean
    strategicPillar?: boolean
    completion?: boolean
    riskIndicator?: boolean
    startDate?: boolean
    dueDate?: boolean
    completedAt?: boolean
    notes?: boolean
    nextStep?: boolean
    ceoNotes?: boolean
    sourceMonth?: boolean
    source?: boolean
    dataSourceId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TaskOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "taskId" | "title" | "description" | "sentdmMessageId" | "lastReminderSentAt" | "ownerId" | "assigneeId" | "department" | "priority" | "status" | "strategicPillar" | "completion" | "riskIndicator" | "startDate" | "dueDate" | "completedAt" | "notes" | "nextStep" | "ceoNotes" | "sourceMonth" | "source" | "dataSourceId" | "createdAt" | "updatedAt", ExtArgs["result"]["task"]>
  export type TaskInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | Task$ownerArgs<ExtArgs>
    assignee?: boolean | Task$assigneeArgs<ExtArgs>
    dataSource?: boolean | Task$dataSourceArgs<ExtArgs>
    auditLogs?: boolean | Task$auditLogsArgs<ExtArgs>
    notifications?: boolean | Task$notificationsArgs<ExtArgs>
    updates?: boolean | Task$updatesArgs<ExtArgs>
    _count?: boolean | TaskCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TaskIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | Task$ownerArgs<ExtArgs>
    assignee?: boolean | Task$assigneeArgs<ExtArgs>
    dataSource?: boolean | Task$dataSourceArgs<ExtArgs>
  }
  export type TaskIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | Task$ownerArgs<ExtArgs>
    assignee?: boolean | Task$assigneeArgs<ExtArgs>
    dataSource?: boolean | Task$dataSourceArgs<ExtArgs>
  }

  export type $TaskPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Task"
    objects: {
      owner: Prisma.$UserPayload<ExtArgs> | null
      assignee: Prisma.$UserPayload<ExtArgs> | null
      dataSource: Prisma.$DataSourcePayload<ExtArgs> | null
      auditLogs: Prisma.$TaskAuditLogPayload<ExtArgs>[]
      notifications: Prisma.$NotificationPayload<ExtArgs>[]
      updates: Prisma.$TaskUpdatePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      taskId: string | null
      title: string
      description: string | null
      sentdmMessageId: string | null
      lastReminderSentAt: Date | null
      ownerId: string | null
      assigneeId: string | null
      department: string | null
      priority: string
      status: string
      strategicPillar: string | null
      completion: number
      riskIndicator: string | null
      startDate: Date | null
      dueDate: Date | null
      completedAt: Date | null
      notes: string | null
      nextStep: string | null
      ceoNotes: string | null
      sourceMonth: string | null
      source: string | null
      dataSourceId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["task"]>
    composites: {}
  }

  type TaskGetPayload<S extends boolean | null | undefined | TaskDefaultArgs> = $Result.GetResult<Prisma.$TaskPayload, S>

  type TaskCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TaskFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TaskCountAggregateInputType | true
    }

  export interface TaskDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Task'], meta: { name: 'Task' } }
    /**
     * Find zero or one Task that matches the filter.
     * @param {TaskFindUniqueArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TaskFindUniqueArgs>(args: SelectSubset<T, TaskFindUniqueArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Task that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TaskFindUniqueOrThrowArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TaskFindUniqueOrThrowArgs>(args: SelectSubset<T, TaskFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Task that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindFirstArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TaskFindFirstArgs>(args?: SelectSubset<T, TaskFindFirstArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Task that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindFirstOrThrowArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TaskFindFirstOrThrowArgs>(args?: SelectSubset<T, TaskFindFirstOrThrowArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tasks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tasks
     * const tasks = await prisma.task.findMany()
     * 
     * // Get first 10 Tasks
     * const tasks = await prisma.task.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const taskWithIdOnly = await prisma.task.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TaskFindManyArgs>(args?: SelectSubset<T, TaskFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Task.
     * @param {TaskCreateArgs} args - Arguments to create a Task.
     * @example
     * // Create one Task
     * const Task = await prisma.task.create({
     *   data: {
     *     // ... data to create a Task
     *   }
     * })
     * 
     */
    create<T extends TaskCreateArgs>(args: SelectSubset<T, TaskCreateArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tasks.
     * @param {TaskCreateManyArgs} args - Arguments to create many Tasks.
     * @example
     * // Create many Tasks
     * const task = await prisma.task.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TaskCreateManyArgs>(args?: SelectSubset<T, TaskCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tasks and returns the data saved in the database.
     * @param {TaskCreateManyAndReturnArgs} args - Arguments to create many Tasks.
     * @example
     * // Create many Tasks
     * const task = await prisma.task.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tasks and only return the `id`
     * const taskWithIdOnly = await prisma.task.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TaskCreateManyAndReturnArgs>(args?: SelectSubset<T, TaskCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Task.
     * @param {TaskDeleteArgs} args - Arguments to delete one Task.
     * @example
     * // Delete one Task
     * const Task = await prisma.task.delete({
     *   where: {
     *     // ... filter to delete one Task
     *   }
     * })
     * 
     */
    delete<T extends TaskDeleteArgs>(args: SelectSubset<T, TaskDeleteArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Task.
     * @param {TaskUpdateArgs} args - Arguments to update one Task.
     * @example
     * // Update one Task
     * const task = await prisma.task.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TaskUpdateArgs>(args: SelectSubset<T, TaskUpdateArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tasks.
     * @param {TaskDeleteManyArgs} args - Arguments to filter Tasks to delete.
     * @example
     * // Delete a few Tasks
     * const { count } = await prisma.task.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TaskDeleteManyArgs>(args?: SelectSubset<T, TaskDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tasks
     * const task = await prisma.task.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TaskUpdateManyArgs>(args: SelectSubset<T, TaskUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tasks and returns the data updated in the database.
     * @param {TaskUpdateManyAndReturnArgs} args - Arguments to update many Tasks.
     * @example
     * // Update many Tasks
     * const task = await prisma.task.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tasks and only return the `id`
     * const taskWithIdOnly = await prisma.task.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TaskUpdateManyAndReturnArgs>(args: SelectSubset<T, TaskUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Task.
     * @param {TaskUpsertArgs} args - Arguments to update or create a Task.
     * @example
     * // Update or create a Task
     * const task = await prisma.task.upsert({
     *   create: {
     *     // ... data to create a Task
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Task we want to update
     *   }
     * })
     */
    upsert<T extends TaskUpsertArgs>(args: SelectSubset<T, TaskUpsertArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskCountArgs} args - Arguments to filter Tasks to count.
     * @example
     * // Count the number of Tasks
     * const count = await prisma.task.count({
     *   where: {
     *     // ... the filter for the Tasks we want to count
     *   }
     * })
    **/
    count<T extends TaskCountArgs>(
      args?: Subset<T, TaskCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TaskCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Task.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TaskAggregateArgs>(args: Subset<T, TaskAggregateArgs>): Prisma.PrismaPromise<GetTaskAggregateType<T>>

    /**
     * Group by Task.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TaskGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TaskGroupByArgs['orderBy'] }
        : { orderBy?: TaskGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TaskGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Task model
   */
  readonly fields: TaskFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Task.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TaskClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    owner<T extends Task$ownerArgs<ExtArgs> = {}>(args?: Subset<T, Task$ownerArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    assignee<T extends Task$assigneeArgs<ExtArgs> = {}>(args?: Subset<T, Task$assigneeArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    dataSource<T extends Task$dataSourceArgs<ExtArgs> = {}>(args?: Subset<T, Task$dataSourceArgs<ExtArgs>>): Prisma__DataSourceClient<$Result.GetResult<Prisma.$DataSourcePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    auditLogs<T extends Task$auditLogsArgs<ExtArgs> = {}>(args?: Subset<T, Task$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskAuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    notifications<T extends Task$notificationsArgs<ExtArgs> = {}>(args?: Subset<T, Task$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    updates<T extends Task$updatesArgs<ExtArgs> = {}>(args?: Subset<T, Task$updatesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskUpdatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Task model
   */
  interface TaskFieldRefs {
    readonly id: FieldRef<"Task", 'String'>
    readonly taskId: FieldRef<"Task", 'String'>
    readonly title: FieldRef<"Task", 'String'>
    readonly description: FieldRef<"Task", 'String'>
    readonly sentdmMessageId: FieldRef<"Task", 'String'>
    readonly lastReminderSentAt: FieldRef<"Task", 'DateTime'>
    readonly ownerId: FieldRef<"Task", 'String'>
    readonly assigneeId: FieldRef<"Task", 'String'>
    readonly department: FieldRef<"Task", 'String'>
    readonly priority: FieldRef<"Task", 'String'>
    readonly status: FieldRef<"Task", 'String'>
    readonly strategicPillar: FieldRef<"Task", 'String'>
    readonly completion: FieldRef<"Task", 'Float'>
    readonly riskIndicator: FieldRef<"Task", 'String'>
    readonly startDate: FieldRef<"Task", 'DateTime'>
    readonly dueDate: FieldRef<"Task", 'DateTime'>
    readonly completedAt: FieldRef<"Task", 'DateTime'>
    readonly notes: FieldRef<"Task", 'String'>
    readonly nextStep: FieldRef<"Task", 'String'>
    readonly ceoNotes: FieldRef<"Task", 'String'>
    readonly sourceMonth: FieldRef<"Task", 'String'>
    readonly source: FieldRef<"Task", 'String'>
    readonly dataSourceId: FieldRef<"Task", 'String'>
    readonly createdAt: FieldRef<"Task", 'DateTime'>
    readonly updatedAt: FieldRef<"Task", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Task findUnique
   */
  export type TaskFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task findUniqueOrThrow
   */
  export type TaskFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task findFirst
   */
  export type TaskFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tasks.
     */
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task findFirstOrThrow
   */
  export type TaskFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tasks.
     */
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task findMany
   */
  export type TaskFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Tasks to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task create
   */
  export type TaskCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The data needed to create a Task.
     */
    data: XOR<TaskCreateInput, TaskUncheckedCreateInput>
  }

  /**
   * Task createMany
   */
  export type TaskCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tasks.
     */
    data: TaskCreateManyInput | TaskCreateManyInput[]
  }

  /**
   * Task createManyAndReturn
   */
  export type TaskCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * The data used to create many Tasks.
     */
    data: TaskCreateManyInput | TaskCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Task update
   */
  export type TaskUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The data needed to update a Task.
     */
    data: XOR<TaskUpdateInput, TaskUncheckedUpdateInput>
    /**
     * Choose, which Task to update.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task updateMany
   */
  export type TaskUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tasks.
     */
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyInput>
    /**
     * Filter which Tasks to update
     */
    where?: TaskWhereInput
    /**
     * Limit how many Tasks to update.
     */
    limit?: number
  }

  /**
   * Task updateManyAndReturn
   */
  export type TaskUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * The data used to update Tasks.
     */
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyInput>
    /**
     * Filter which Tasks to update
     */
    where?: TaskWhereInput
    /**
     * Limit how many Tasks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Task upsert
   */
  export type TaskUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The filter to search for the Task to update in case it exists.
     */
    where: TaskWhereUniqueInput
    /**
     * In case the Task found by the `where` argument doesn't exist, create a new Task with this data.
     */
    create: XOR<TaskCreateInput, TaskUncheckedCreateInput>
    /**
     * In case the Task was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TaskUpdateInput, TaskUncheckedUpdateInput>
  }

  /**
   * Task delete
   */
  export type TaskDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter which Task to delete.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task deleteMany
   */
  export type TaskDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tasks to delete
     */
    where?: TaskWhereInput
    /**
     * Limit how many Tasks to delete.
     */
    limit?: number
  }

  /**
   * Task.owner
   */
  export type Task$ownerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Task.assignee
   */
  export type Task$assigneeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Task.dataSource
   */
  export type Task$dataSourceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataSource
     */
    select?: DataSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataSource
     */
    omit?: DataSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataSourceInclude<ExtArgs> | null
    where?: DataSourceWhereInput
  }

  /**
   * Task.auditLogs
   */
  export type Task$auditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskAuditLog
     */
    select?: TaskAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskAuditLog
     */
    omit?: TaskAuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskAuditLogInclude<ExtArgs> | null
    where?: TaskAuditLogWhereInput
    orderBy?: TaskAuditLogOrderByWithRelationInput | TaskAuditLogOrderByWithRelationInput[]
    cursor?: TaskAuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskAuditLogScalarFieldEnum | TaskAuditLogScalarFieldEnum[]
  }

  /**
   * Task.notifications
   */
  export type Task$notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Task.updates
   */
  export type Task$updatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskUpdate
     */
    select?: TaskUpdateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskUpdate
     */
    omit?: TaskUpdateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskUpdateInclude<ExtArgs> | null
    where?: TaskUpdateWhereInput
    orderBy?: TaskUpdateOrderByWithRelationInput | TaskUpdateOrderByWithRelationInput[]
    cursor?: TaskUpdateWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskUpdateScalarFieldEnum | TaskUpdateScalarFieldEnum[]
  }

  /**
   * Task without action
   */
  export type TaskDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
  }


  /**
   * Model Contact
   */

  export type AggregateContact = {
    _count: ContactCountAggregateOutputType | null
    _min: ContactMinAggregateOutputType | null
    _max: ContactMaxAggregateOutputType | null
  }

  export type ContactMinAggregateOutputType = {
    id: string | null
    name: string | null
    phone: string | null
    email: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ContactMaxAggregateOutputType = {
    id: string | null
    name: string | null
    phone: string | null
    email: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ContactCountAggregateOutputType = {
    id: number
    name: number
    phone: number
    email: number
    userId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ContactMinAggregateInputType = {
    id?: true
    name?: true
    phone?: true
    email?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ContactMaxAggregateInputType = {
    id?: true
    name?: true
    phone?: true
    email?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ContactCountAggregateInputType = {
    id?: true
    name?: true
    phone?: true
    email?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ContactAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Contact to aggregate.
     */
    where?: ContactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Contacts to fetch.
     */
    orderBy?: ContactOrderByWithRelationInput | ContactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ContactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Contacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Contacts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Contacts
    **/
    _count?: true | ContactCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ContactMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ContactMaxAggregateInputType
  }

  export type GetContactAggregateType<T extends ContactAggregateArgs> = {
        [P in keyof T & keyof AggregateContact]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateContact[P]>
      : GetScalarType<T[P], AggregateContact[P]>
  }




  export type ContactGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ContactWhereInput
    orderBy?: ContactOrderByWithAggregationInput | ContactOrderByWithAggregationInput[]
    by: ContactScalarFieldEnum[] | ContactScalarFieldEnum
    having?: ContactScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ContactCountAggregateInputType | true
    _min?: ContactMinAggregateInputType
    _max?: ContactMaxAggregateInputType
  }

  export type ContactGroupByOutputType = {
    id: string
    name: string
    phone: string | null
    email: string | null
    userId: string | null
    createdAt: Date
    updatedAt: Date
    _count: ContactCountAggregateOutputType | null
    _min: ContactMinAggregateOutputType | null
    _max: ContactMaxAggregateOutputType | null
  }

  type GetContactGroupByPayload<T extends ContactGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ContactGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ContactGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ContactGroupByOutputType[P]>
            : GetScalarType<T[P], ContactGroupByOutputType[P]>
        }
      >
    >


  export type ContactSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phone?: boolean
    email?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | Contact$userArgs<ExtArgs>
  }, ExtArgs["result"]["contact"]>

  export type ContactSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phone?: boolean
    email?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | Contact$userArgs<ExtArgs>
  }, ExtArgs["result"]["contact"]>

  export type ContactSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phone?: boolean
    email?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | Contact$userArgs<ExtArgs>
  }, ExtArgs["result"]["contact"]>

  export type ContactSelectScalar = {
    id?: boolean
    name?: boolean
    phone?: boolean
    email?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ContactOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "phone" | "email" | "userId" | "createdAt" | "updatedAt", ExtArgs["result"]["contact"]>
  export type ContactInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Contact$userArgs<ExtArgs>
  }
  export type ContactIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Contact$userArgs<ExtArgs>
  }
  export type ContactIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Contact$userArgs<ExtArgs>
  }

  export type $ContactPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Contact"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      phone: string | null
      email: string | null
      userId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["contact"]>
    composites: {}
  }

  type ContactGetPayload<S extends boolean | null | undefined | ContactDefaultArgs> = $Result.GetResult<Prisma.$ContactPayload, S>

  type ContactCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ContactFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ContactCountAggregateInputType | true
    }

  export interface ContactDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Contact'], meta: { name: 'Contact' } }
    /**
     * Find zero or one Contact that matches the filter.
     * @param {ContactFindUniqueArgs} args - Arguments to find a Contact
     * @example
     * // Get one Contact
     * const contact = await prisma.contact.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ContactFindUniqueArgs>(args: SelectSubset<T, ContactFindUniqueArgs<ExtArgs>>): Prisma__ContactClient<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Contact that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ContactFindUniqueOrThrowArgs} args - Arguments to find a Contact
     * @example
     * // Get one Contact
     * const contact = await prisma.contact.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ContactFindUniqueOrThrowArgs>(args: SelectSubset<T, ContactFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ContactClient<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Contact that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactFindFirstArgs} args - Arguments to find a Contact
     * @example
     * // Get one Contact
     * const contact = await prisma.contact.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ContactFindFirstArgs>(args?: SelectSubset<T, ContactFindFirstArgs<ExtArgs>>): Prisma__ContactClient<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Contact that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactFindFirstOrThrowArgs} args - Arguments to find a Contact
     * @example
     * // Get one Contact
     * const contact = await prisma.contact.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ContactFindFirstOrThrowArgs>(args?: SelectSubset<T, ContactFindFirstOrThrowArgs<ExtArgs>>): Prisma__ContactClient<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Contacts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Contacts
     * const contacts = await prisma.contact.findMany()
     * 
     * // Get first 10 Contacts
     * const contacts = await prisma.contact.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const contactWithIdOnly = await prisma.contact.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ContactFindManyArgs>(args?: SelectSubset<T, ContactFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Contact.
     * @param {ContactCreateArgs} args - Arguments to create a Contact.
     * @example
     * // Create one Contact
     * const Contact = await prisma.contact.create({
     *   data: {
     *     // ... data to create a Contact
     *   }
     * })
     * 
     */
    create<T extends ContactCreateArgs>(args: SelectSubset<T, ContactCreateArgs<ExtArgs>>): Prisma__ContactClient<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Contacts.
     * @param {ContactCreateManyArgs} args - Arguments to create many Contacts.
     * @example
     * // Create many Contacts
     * const contact = await prisma.contact.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ContactCreateManyArgs>(args?: SelectSubset<T, ContactCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Contacts and returns the data saved in the database.
     * @param {ContactCreateManyAndReturnArgs} args - Arguments to create many Contacts.
     * @example
     * // Create many Contacts
     * const contact = await prisma.contact.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Contacts and only return the `id`
     * const contactWithIdOnly = await prisma.contact.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ContactCreateManyAndReturnArgs>(args?: SelectSubset<T, ContactCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Contact.
     * @param {ContactDeleteArgs} args - Arguments to delete one Contact.
     * @example
     * // Delete one Contact
     * const Contact = await prisma.contact.delete({
     *   where: {
     *     // ... filter to delete one Contact
     *   }
     * })
     * 
     */
    delete<T extends ContactDeleteArgs>(args: SelectSubset<T, ContactDeleteArgs<ExtArgs>>): Prisma__ContactClient<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Contact.
     * @param {ContactUpdateArgs} args - Arguments to update one Contact.
     * @example
     * // Update one Contact
     * const contact = await prisma.contact.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ContactUpdateArgs>(args: SelectSubset<T, ContactUpdateArgs<ExtArgs>>): Prisma__ContactClient<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Contacts.
     * @param {ContactDeleteManyArgs} args - Arguments to filter Contacts to delete.
     * @example
     * // Delete a few Contacts
     * const { count } = await prisma.contact.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ContactDeleteManyArgs>(args?: SelectSubset<T, ContactDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Contacts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Contacts
     * const contact = await prisma.contact.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ContactUpdateManyArgs>(args: SelectSubset<T, ContactUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Contacts and returns the data updated in the database.
     * @param {ContactUpdateManyAndReturnArgs} args - Arguments to update many Contacts.
     * @example
     * // Update many Contacts
     * const contact = await prisma.contact.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Contacts and only return the `id`
     * const contactWithIdOnly = await prisma.contact.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ContactUpdateManyAndReturnArgs>(args: SelectSubset<T, ContactUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Contact.
     * @param {ContactUpsertArgs} args - Arguments to update or create a Contact.
     * @example
     * // Update or create a Contact
     * const contact = await prisma.contact.upsert({
     *   create: {
     *     // ... data to create a Contact
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Contact we want to update
     *   }
     * })
     */
    upsert<T extends ContactUpsertArgs>(args: SelectSubset<T, ContactUpsertArgs<ExtArgs>>): Prisma__ContactClient<$Result.GetResult<Prisma.$ContactPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Contacts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactCountArgs} args - Arguments to filter Contacts to count.
     * @example
     * // Count the number of Contacts
     * const count = await prisma.contact.count({
     *   where: {
     *     // ... the filter for the Contacts we want to count
     *   }
     * })
    **/
    count<T extends ContactCountArgs>(
      args?: Subset<T, ContactCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ContactCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Contact.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ContactAggregateArgs>(args: Subset<T, ContactAggregateArgs>): Prisma.PrismaPromise<GetContactAggregateType<T>>

    /**
     * Group by Contact.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ContactGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ContactGroupByArgs['orderBy'] }
        : { orderBy?: ContactGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ContactGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetContactGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Contact model
   */
  readonly fields: ContactFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Contact.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ContactClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends Contact$userArgs<ExtArgs> = {}>(args?: Subset<T, Contact$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Contact model
   */
  interface ContactFieldRefs {
    readonly id: FieldRef<"Contact", 'String'>
    readonly name: FieldRef<"Contact", 'String'>
    readonly phone: FieldRef<"Contact", 'String'>
    readonly email: FieldRef<"Contact", 'String'>
    readonly userId: FieldRef<"Contact", 'String'>
    readonly createdAt: FieldRef<"Contact", 'DateTime'>
    readonly updatedAt: FieldRef<"Contact", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Contact findUnique
   */
  export type ContactFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInclude<ExtArgs> | null
    /**
     * Filter, which Contact to fetch.
     */
    where: ContactWhereUniqueInput
  }

  /**
   * Contact findUniqueOrThrow
   */
  export type ContactFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInclude<ExtArgs> | null
    /**
     * Filter, which Contact to fetch.
     */
    where: ContactWhereUniqueInput
  }

  /**
   * Contact findFirst
   */
  export type ContactFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInclude<ExtArgs> | null
    /**
     * Filter, which Contact to fetch.
     */
    where?: ContactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Contacts to fetch.
     */
    orderBy?: ContactOrderByWithRelationInput | ContactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Contacts.
     */
    cursor?: ContactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Contacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Contacts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Contacts.
     */
    distinct?: ContactScalarFieldEnum | ContactScalarFieldEnum[]
  }

  /**
   * Contact findFirstOrThrow
   */
  export type ContactFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInclude<ExtArgs> | null
    /**
     * Filter, which Contact to fetch.
     */
    where?: ContactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Contacts to fetch.
     */
    orderBy?: ContactOrderByWithRelationInput | ContactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Contacts.
     */
    cursor?: ContactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Contacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Contacts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Contacts.
     */
    distinct?: ContactScalarFieldEnum | ContactScalarFieldEnum[]
  }

  /**
   * Contact findMany
   */
  export type ContactFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInclude<ExtArgs> | null
    /**
     * Filter, which Contacts to fetch.
     */
    where?: ContactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Contacts to fetch.
     */
    orderBy?: ContactOrderByWithRelationInput | ContactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Contacts.
     */
    cursor?: ContactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Contacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Contacts.
     */
    skip?: number
    distinct?: ContactScalarFieldEnum | ContactScalarFieldEnum[]
  }

  /**
   * Contact create
   */
  export type ContactCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInclude<ExtArgs> | null
    /**
     * The data needed to create a Contact.
     */
    data: XOR<ContactCreateInput, ContactUncheckedCreateInput>
  }

  /**
   * Contact createMany
   */
  export type ContactCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Contacts.
     */
    data: ContactCreateManyInput | ContactCreateManyInput[]
  }

  /**
   * Contact createManyAndReturn
   */
  export type ContactCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * The data used to create many Contacts.
     */
    data: ContactCreateManyInput | ContactCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Contact update
   */
  export type ContactUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInclude<ExtArgs> | null
    /**
     * The data needed to update a Contact.
     */
    data: XOR<ContactUpdateInput, ContactUncheckedUpdateInput>
    /**
     * Choose, which Contact to update.
     */
    where: ContactWhereUniqueInput
  }

  /**
   * Contact updateMany
   */
  export type ContactUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Contacts.
     */
    data: XOR<ContactUpdateManyMutationInput, ContactUncheckedUpdateManyInput>
    /**
     * Filter which Contacts to update
     */
    where?: ContactWhereInput
    /**
     * Limit how many Contacts to update.
     */
    limit?: number
  }

  /**
   * Contact updateManyAndReturn
   */
  export type ContactUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * The data used to update Contacts.
     */
    data: XOR<ContactUpdateManyMutationInput, ContactUncheckedUpdateManyInput>
    /**
     * Filter which Contacts to update
     */
    where?: ContactWhereInput
    /**
     * Limit how many Contacts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Contact upsert
   */
  export type ContactUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInclude<ExtArgs> | null
    /**
     * The filter to search for the Contact to update in case it exists.
     */
    where: ContactWhereUniqueInput
    /**
     * In case the Contact found by the `where` argument doesn't exist, create a new Contact with this data.
     */
    create: XOR<ContactCreateInput, ContactUncheckedCreateInput>
    /**
     * In case the Contact was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ContactUpdateInput, ContactUncheckedUpdateInput>
  }

  /**
   * Contact delete
   */
  export type ContactDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInclude<ExtArgs> | null
    /**
     * Filter which Contact to delete.
     */
    where: ContactWhereUniqueInput
  }

  /**
   * Contact deleteMany
   */
  export type ContactDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Contacts to delete
     */
    where?: ContactWhereInput
    /**
     * Limit how many Contacts to delete.
     */
    limit?: number
  }

  /**
   * Contact.user
   */
  export type Contact$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Contact without action
   */
  export type ContactDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contact
     */
    select?: ContactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Contact
     */
    omit?: ContactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInclude<ExtArgs> | null
  }


  /**
   * Model TaskUpdate
   */

  export type AggregateTaskUpdate = {
    _count: TaskUpdateCountAggregateOutputType | null
    _min: TaskUpdateMinAggregateOutputType | null
    _max: TaskUpdateMaxAggregateOutputType | null
  }

  export type TaskUpdateMinAggregateOutputType = {
    id: string | null
    taskId: string | null
    source: string | null
    content: string | null
    createdAt: Date | null
  }

  export type TaskUpdateMaxAggregateOutputType = {
    id: string | null
    taskId: string | null
    source: string | null
    content: string | null
    createdAt: Date | null
  }

  export type TaskUpdateCountAggregateOutputType = {
    id: number
    taskId: number
    source: number
    content: number
    createdAt: number
    _all: number
  }


  export type TaskUpdateMinAggregateInputType = {
    id?: true
    taskId?: true
    source?: true
    content?: true
    createdAt?: true
  }

  export type TaskUpdateMaxAggregateInputType = {
    id?: true
    taskId?: true
    source?: true
    content?: true
    createdAt?: true
  }

  export type TaskUpdateCountAggregateInputType = {
    id?: true
    taskId?: true
    source?: true
    content?: true
    createdAt?: true
    _all?: true
  }

  export type TaskUpdateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TaskUpdate to aggregate.
     */
    where?: TaskUpdateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskUpdates to fetch.
     */
    orderBy?: TaskUpdateOrderByWithRelationInput | TaskUpdateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TaskUpdateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskUpdates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskUpdates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TaskUpdates
    **/
    _count?: true | TaskUpdateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TaskUpdateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TaskUpdateMaxAggregateInputType
  }

  export type GetTaskUpdateAggregateType<T extends TaskUpdateAggregateArgs> = {
        [P in keyof T & keyof AggregateTaskUpdate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTaskUpdate[P]>
      : GetScalarType<T[P], AggregateTaskUpdate[P]>
  }




  export type TaskUpdateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskUpdateWhereInput
    orderBy?: TaskUpdateOrderByWithAggregationInput | TaskUpdateOrderByWithAggregationInput[]
    by: TaskUpdateScalarFieldEnum[] | TaskUpdateScalarFieldEnum
    having?: TaskUpdateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TaskUpdateCountAggregateInputType | true
    _min?: TaskUpdateMinAggregateInputType
    _max?: TaskUpdateMaxAggregateInputType
  }

  export type TaskUpdateGroupByOutputType = {
    id: string
    taskId: string
    source: string
    content: string
    createdAt: Date
    _count: TaskUpdateCountAggregateOutputType | null
    _min: TaskUpdateMinAggregateOutputType | null
    _max: TaskUpdateMaxAggregateOutputType | null
  }

  type GetTaskUpdateGroupByPayload<T extends TaskUpdateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TaskUpdateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TaskUpdateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TaskUpdateGroupByOutputType[P]>
            : GetScalarType<T[P], TaskUpdateGroupByOutputType[P]>
        }
      >
    >


  export type TaskUpdateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    taskId?: boolean
    source?: boolean
    content?: boolean
    createdAt?: boolean
    task?: boolean | TaskDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["taskUpdate"]>

  export type TaskUpdateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    taskId?: boolean
    source?: boolean
    content?: boolean
    createdAt?: boolean
    task?: boolean | TaskDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["taskUpdate"]>

  export type TaskUpdateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    taskId?: boolean
    source?: boolean
    content?: boolean
    createdAt?: boolean
    task?: boolean | TaskDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["taskUpdate"]>

  export type TaskUpdateSelectScalar = {
    id?: boolean
    taskId?: boolean
    source?: boolean
    content?: boolean
    createdAt?: boolean
  }

  export type TaskUpdateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "taskId" | "source" | "content" | "createdAt", ExtArgs["result"]["taskUpdate"]>
  export type TaskUpdateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    task?: boolean | TaskDefaultArgs<ExtArgs>
  }
  export type TaskUpdateIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    task?: boolean | TaskDefaultArgs<ExtArgs>
  }
  export type TaskUpdateIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    task?: boolean | TaskDefaultArgs<ExtArgs>
  }

  export type $TaskUpdatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TaskUpdate"
    objects: {
      task: Prisma.$TaskPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      taskId: string
      source: string
      content: string
      createdAt: Date
    }, ExtArgs["result"]["taskUpdate"]>
    composites: {}
  }

  type TaskUpdateGetPayload<S extends boolean | null | undefined | TaskUpdateDefaultArgs> = $Result.GetResult<Prisma.$TaskUpdatePayload, S>

  type TaskUpdateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TaskUpdateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TaskUpdateCountAggregateInputType | true
    }

  export interface TaskUpdateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TaskUpdate'], meta: { name: 'TaskUpdate' } }
    /**
     * Find zero or one TaskUpdate that matches the filter.
     * @param {TaskUpdateFindUniqueArgs} args - Arguments to find a TaskUpdate
     * @example
     * // Get one TaskUpdate
     * const taskUpdate = await prisma.taskUpdate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TaskUpdateFindUniqueArgs>(args: SelectSubset<T, TaskUpdateFindUniqueArgs<ExtArgs>>): Prisma__TaskUpdateClient<$Result.GetResult<Prisma.$TaskUpdatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TaskUpdate that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TaskUpdateFindUniqueOrThrowArgs} args - Arguments to find a TaskUpdate
     * @example
     * // Get one TaskUpdate
     * const taskUpdate = await prisma.taskUpdate.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TaskUpdateFindUniqueOrThrowArgs>(args: SelectSubset<T, TaskUpdateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TaskUpdateClient<$Result.GetResult<Prisma.$TaskUpdatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TaskUpdate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskUpdateFindFirstArgs} args - Arguments to find a TaskUpdate
     * @example
     * // Get one TaskUpdate
     * const taskUpdate = await prisma.taskUpdate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TaskUpdateFindFirstArgs>(args?: SelectSubset<T, TaskUpdateFindFirstArgs<ExtArgs>>): Prisma__TaskUpdateClient<$Result.GetResult<Prisma.$TaskUpdatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TaskUpdate that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskUpdateFindFirstOrThrowArgs} args - Arguments to find a TaskUpdate
     * @example
     * // Get one TaskUpdate
     * const taskUpdate = await prisma.taskUpdate.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TaskUpdateFindFirstOrThrowArgs>(args?: SelectSubset<T, TaskUpdateFindFirstOrThrowArgs<ExtArgs>>): Prisma__TaskUpdateClient<$Result.GetResult<Prisma.$TaskUpdatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TaskUpdates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskUpdateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TaskUpdates
     * const taskUpdates = await prisma.taskUpdate.findMany()
     * 
     * // Get first 10 TaskUpdates
     * const taskUpdates = await prisma.taskUpdate.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const taskUpdateWithIdOnly = await prisma.taskUpdate.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TaskUpdateFindManyArgs>(args?: SelectSubset<T, TaskUpdateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskUpdatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TaskUpdate.
     * @param {TaskUpdateCreateArgs} args - Arguments to create a TaskUpdate.
     * @example
     * // Create one TaskUpdate
     * const TaskUpdate = await prisma.taskUpdate.create({
     *   data: {
     *     // ... data to create a TaskUpdate
     *   }
     * })
     * 
     */
    create<T extends TaskUpdateCreateArgs>(args: SelectSubset<T, TaskUpdateCreateArgs<ExtArgs>>): Prisma__TaskUpdateClient<$Result.GetResult<Prisma.$TaskUpdatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TaskUpdates.
     * @param {TaskUpdateCreateManyArgs} args - Arguments to create many TaskUpdates.
     * @example
     * // Create many TaskUpdates
     * const taskUpdate = await prisma.taskUpdate.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TaskUpdateCreateManyArgs>(args?: SelectSubset<T, TaskUpdateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TaskUpdates and returns the data saved in the database.
     * @param {TaskUpdateCreateManyAndReturnArgs} args - Arguments to create many TaskUpdates.
     * @example
     * // Create many TaskUpdates
     * const taskUpdate = await prisma.taskUpdate.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TaskUpdates and only return the `id`
     * const taskUpdateWithIdOnly = await prisma.taskUpdate.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TaskUpdateCreateManyAndReturnArgs>(args?: SelectSubset<T, TaskUpdateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskUpdatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TaskUpdate.
     * @param {TaskUpdateDeleteArgs} args - Arguments to delete one TaskUpdate.
     * @example
     * // Delete one TaskUpdate
     * const TaskUpdate = await prisma.taskUpdate.delete({
     *   where: {
     *     // ... filter to delete one TaskUpdate
     *   }
     * })
     * 
     */
    delete<T extends TaskUpdateDeleteArgs>(args: SelectSubset<T, TaskUpdateDeleteArgs<ExtArgs>>): Prisma__TaskUpdateClient<$Result.GetResult<Prisma.$TaskUpdatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TaskUpdate.
     * @param {TaskUpdateUpdateArgs} args - Arguments to update one TaskUpdate.
     * @example
     * // Update one TaskUpdate
     * const taskUpdate = await prisma.taskUpdate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TaskUpdateUpdateArgs>(args: SelectSubset<T, TaskUpdateUpdateArgs<ExtArgs>>): Prisma__TaskUpdateClient<$Result.GetResult<Prisma.$TaskUpdatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TaskUpdates.
     * @param {TaskUpdateDeleteManyArgs} args - Arguments to filter TaskUpdates to delete.
     * @example
     * // Delete a few TaskUpdates
     * const { count } = await prisma.taskUpdate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TaskUpdateDeleteManyArgs>(args?: SelectSubset<T, TaskUpdateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TaskUpdates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskUpdateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TaskUpdates
     * const taskUpdate = await prisma.taskUpdate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TaskUpdateUpdateManyArgs>(args: SelectSubset<T, TaskUpdateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TaskUpdates and returns the data updated in the database.
     * @param {TaskUpdateUpdateManyAndReturnArgs} args - Arguments to update many TaskUpdates.
     * @example
     * // Update many TaskUpdates
     * const taskUpdate = await prisma.taskUpdate.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TaskUpdates and only return the `id`
     * const taskUpdateWithIdOnly = await prisma.taskUpdate.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TaskUpdateUpdateManyAndReturnArgs>(args: SelectSubset<T, TaskUpdateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskUpdatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TaskUpdate.
     * @param {TaskUpdateUpsertArgs} args - Arguments to update or create a TaskUpdate.
     * @example
     * // Update or create a TaskUpdate
     * const taskUpdate = await prisma.taskUpdate.upsert({
     *   create: {
     *     // ... data to create a TaskUpdate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TaskUpdate we want to update
     *   }
     * })
     */
    upsert<T extends TaskUpdateUpsertArgs>(args: SelectSubset<T, TaskUpdateUpsertArgs<ExtArgs>>): Prisma__TaskUpdateClient<$Result.GetResult<Prisma.$TaskUpdatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TaskUpdates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskUpdateCountArgs} args - Arguments to filter TaskUpdates to count.
     * @example
     * // Count the number of TaskUpdates
     * const count = await prisma.taskUpdate.count({
     *   where: {
     *     // ... the filter for the TaskUpdates we want to count
     *   }
     * })
    **/
    count<T extends TaskUpdateCountArgs>(
      args?: Subset<T, TaskUpdateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TaskUpdateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TaskUpdate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskUpdateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TaskUpdateAggregateArgs>(args: Subset<T, TaskUpdateAggregateArgs>): Prisma.PrismaPromise<GetTaskUpdateAggregateType<T>>

    /**
     * Group by TaskUpdate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskUpdateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TaskUpdateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TaskUpdateGroupByArgs['orderBy'] }
        : { orderBy?: TaskUpdateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TaskUpdateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskUpdateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TaskUpdate model
   */
  readonly fields: TaskUpdateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TaskUpdate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TaskUpdateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    task<T extends TaskDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TaskDefaultArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TaskUpdate model
   */
  interface TaskUpdateFieldRefs {
    readonly id: FieldRef<"TaskUpdate", 'String'>
    readonly taskId: FieldRef<"TaskUpdate", 'String'>
    readonly source: FieldRef<"TaskUpdate", 'String'>
    readonly content: FieldRef<"TaskUpdate", 'String'>
    readonly createdAt: FieldRef<"TaskUpdate", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TaskUpdate findUnique
   */
  export type TaskUpdateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskUpdate
     */
    select?: TaskUpdateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskUpdate
     */
    omit?: TaskUpdateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskUpdateInclude<ExtArgs> | null
    /**
     * Filter, which TaskUpdate to fetch.
     */
    where: TaskUpdateWhereUniqueInput
  }

  /**
   * TaskUpdate findUniqueOrThrow
   */
  export type TaskUpdateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskUpdate
     */
    select?: TaskUpdateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskUpdate
     */
    omit?: TaskUpdateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskUpdateInclude<ExtArgs> | null
    /**
     * Filter, which TaskUpdate to fetch.
     */
    where: TaskUpdateWhereUniqueInput
  }

  /**
   * TaskUpdate findFirst
   */
  export type TaskUpdateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskUpdate
     */
    select?: TaskUpdateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskUpdate
     */
    omit?: TaskUpdateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskUpdateInclude<ExtArgs> | null
    /**
     * Filter, which TaskUpdate to fetch.
     */
    where?: TaskUpdateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskUpdates to fetch.
     */
    orderBy?: TaskUpdateOrderByWithRelationInput | TaskUpdateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TaskUpdates.
     */
    cursor?: TaskUpdateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskUpdates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskUpdates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TaskUpdates.
     */
    distinct?: TaskUpdateScalarFieldEnum | TaskUpdateScalarFieldEnum[]
  }

  /**
   * TaskUpdate findFirstOrThrow
   */
  export type TaskUpdateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskUpdate
     */
    select?: TaskUpdateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskUpdate
     */
    omit?: TaskUpdateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskUpdateInclude<ExtArgs> | null
    /**
     * Filter, which TaskUpdate to fetch.
     */
    where?: TaskUpdateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskUpdates to fetch.
     */
    orderBy?: TaskUpdateOrderByWithRelationInput | TaskUpdateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TaskUpdates.
     */
    cursor?: TaskUpdateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskUpdates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskUpdates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TaskUpdates.
     */
    distinct?: TaskUpdateScalarFieldEnum | TaskUpdateScalarFieldEnum[]
  }

  /**
   * TaskUpdate findMany
   */
  export type TaskUpdateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskUpdate
     */
    select?: TaskUpdateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskUpdate
     */
    omit?: TaskUpdateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskUpdateInclude<ExtArgs> | null
    /**
     * Filter, which TaskUpdates to fetch.
     */
    where?: TaskUpdateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskUpdates to fetch.
     */
    orderBy?: TaskUpdateOrderByWithRelationInput | TaskUpdateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TaskUpdates.
     */
    cursor?: TaskUpdateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskUpdates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskUpdates.
     */
    skip?: number
    distinct?: TaskUpdateScalarFieldEnum | TaskUpdateScalarFieldEnum[]
  }

  /**
   * TaskUpdate create
   */
  export type TaskUpdateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskUpdate
     */
    select?: TaskUpdateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskUpdate
     */
    omit?: TaskUpdateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskUpdateInclude<ExtArgs> | null
    /**
     * The data needed to create a TaskUpdate.
     */
    data: XOR<TaskUpdateCreateInput, TaskUpdateUncheckedCreateInput>
  }

  /**
   * TaskUpdate createMany
   */
  export type TaskUpdateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TaskUpdates.
     */
    data: TaskUpdateCreateManyInput | TaskUpdateCreateManyInput[]
  }

  /**
   * TaskUpdate createManyAndReturn
   */
  export type TaskUpdateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskUpdate
     */
    select?: TaskUpdateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TaskUpdate
     */
    omit?: TaskUpdateOmit<ExtArgs> | null
    /**
     * The data used to create many TaskUpdates.
     */
    data: TaskUpdateCreateManyInput | TaskUpdateCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskUpdateIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TaskUpdate update
   */
  export type TaskUpdateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskUpdate
     */
    select?: TaskUpdateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskUpdate
     */
    omit?: TaskUpdateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskUpdateInclude<ExtArgs> | null
    /**
     * The data needed to update a TaskUpdate.
     */
    data: XOR<TaskUpdateUpdateInput, TaskUpdateUncheckedUpdateInput>
    /**
     * Choose, which TaskUpdate to update.
     */
    where: TaskUpdateWhereUniqueInput
  }

  /**
   * TaskUpdate updateMany
   */
  export type TaskUpdateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TaskUpdates.
     */
    data: XOR<TaskUpdateUpdateManyMutationInput, TaskUpdateUncheckedUpdateManyInput>
    /**
     * Filter which TaskUpdates to update
     */
    where?: TaskUpdateWhereInput
    /**
     * Limit how many TaskUpdates to update.
     */
    limit?: number
  }

  /**
   * TaskUpdate updateManyAndReturn
   */
  export type TaskUpdateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskUpdate
     */
    select?: TaskUpdateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TaskUpdate
     */
    omit?: TaskUpdateOmit<ExtArgs> | null
    /**
     * The data used to update TaskUpdates.
     */
    data: XOR<TaskUpdateUpdateManyMutationInput, TaskUpdateUncheckedUpdateManyInput>
    /**
     * Filter which TaskUpdates to update
     */
    where?: TaskUpdateWhereInput
    /**
     * Limit how many TaskUpdates to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskUpdateIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TaskUpdate upsert
   */
  export type TaskUpdateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskUpdate
     */
    select?: TaskUpdateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskUpdate
     */
    omit?: TaskUpdateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskUpdateInclude<ExtArgs> | null
    /**
     * The filter to search for the TaskUpdate to update in case it exists.
     */
    where: TaskUpdateWhereUniqueInput
    /**
     * In case the TaskUpdate found by the `where` argument doesn't exist, create a new TaskUpdate with this data.
     */
    create: XOR<TaskUpdateCreateInput, TaskUpdateUncheckedCreateInput>
    /**
     * In case the TaskUpdate was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TaskUpdateUpdateInput, TaskUpdateUncheckedUpdateInput>
  }

  /**
   * TaskUpdate delete
   */
  export type TaskUpdateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskUpdate
     */
    select?: TaskUpdateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskUpdate
     */
    omit?: TaskUpdateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskUpdateInclude<ExtArgs> | null
    /**
     * Filter which TaskUpdate to delete.
     */
    where: TaskUpdateWhereUniqueInput
  }

  /**
   * TaskUpdate deleteMany
   */
  export type TaskUpdateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TaskUpdates to delete
     */
    where?: TaskUpdateWhereInput
    /**
     * Limit how many TaskUpdates to delete.
     */
    limit?: number
  }

  /**
   * TaskUpdate without action
   */
  export type TaskUpdateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskUpdate
     */
    select?: TaskUpdateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskUpdate
     */
    omit?: TaskUpdateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskUpdateInclude<ExtArgs> | null
  }


  /**
   * Model TaskAuditLog
   */

  export type AggregateTaskAuditLog = {
    _count: TaskAuditLogCountAggregateOutputType | null
    _min: TaskAuditLogMinAggregateOutputType | null
    _max: TaskAuditLogMaxAggregateOutputType | null
  }

  export type TaskAuditLogMinAggregateOutputType = {
    id: string | null
    taskId: string | null
    userId: string | null
    action: string | null
    field: string | null
    oldValue: string | null
    newValue: string | null
    createdAt: Date | null
  }

  export type TaskAuditLogMaxAggregateOutputType = {
    id: string | null
    taskId: string | null
    userId: string | null
    action: string | null
    field: string | null
    oldValue: string | null
    newValue: string | null
    createdAt: Date | null
  }

  export type TaskAuditLogCountAggregateOutputType = {
    id: number
    taskId: number
    userId: number
    action: number
    field: number
    oldValue: number
    newValue: number
    createdAt: number
    _all: number
  }


  export type TaskAuditLogMinAggregateInputType = {
    id?: true
    taskId?: true
    userId?: true
    action?: true
    field?: true
    oldValue?: true
    newValue?: true
    createdAt?: true
  }

  export type TaskAuditLogMaxAggregateInputType = {
    id?: true
    taskId?: true
    userId?: true
    action?: true
    field?: true
    oldValue?: true
    newValue?: true
    createdAt?: true
  }

  export type TaskAuditLogCountAggregateInputType = {
    id?: true
    taskId?: true
    userId?: true
    action?: true
    field?: true
    oldValue?: true
    newValue?: true
    createdAt?: true
    _all?: true
  }

  export type TaskAuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TaskAuditLog to aggregate.
     */
    where?: TaskAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskAuditLogs to fetch.
     */
    orderBy?: TaskAuditLogOrderByWithRelationInput | TaskAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TaskAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TaskAuditLogs
    **/
    _count?: true | TaskAuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TaskAuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TaskAuditLogMaxAggregateInputType
  }

  export type GetTaskAuditLogAggregateType<T extends TaskAuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateTaskAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTaskAuditLog[P]>
      : GetScalarType<T[P], AggregateTaskAuditLog[P]>
  }




  export type TaskAuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskAuditLogWhereInput
    orderBy?: TaskAuditLogOrderByWithAggregationInput | TaskAuditLogOrderByWithAggregationInput[]
    by: TaskAuditLogScalarFieldEnum[] | TaskAuditLogScalarFieldEnum
    having?: TaskAuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TaskAuditLogCountAggregateInputType | true
    _min?: TaskAuditLogMinAggregateInputType
    _max?: TaskAuditLogMaxAggregateInputType
  }

  export type TaskAuditLogGroupByOutputType = {
    id: string
    taskId: string
    userId: string | null
    action: string
    field: string | null
    oldValue: string | null
    newValue: string | null
    createdAt: Date
    _count: TaskAuditLogCountAggregateOutputType | null
    _min: TaskAuditLogMinAggregateOutputType | null
    _max: TaskAuditLogMaxAggregateOutputType | null
  }

  type GetTaskAuditLogGroupByPayload<T extends TaskAuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TaskAuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TaskAuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TaskAuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], TaskAuditLogGroupByOutputType[P]>
        }
      >
    >


  export type TaskAuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    taskId?: boolean
    userId?: boolean
    action?: boolean
    field?: boolean
    oldValue?: boolean
    newValue?: boolean
    createdAt?: boolean
    task?: boolean | TaskDefaultArgs<ExtArgs>
    user?: boolean | TaskAuditLog$userArgs<ExtArgs>
  }, ExtArgs["result"]["taskAuditLog"]>

  export type TaskAuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    taskId?: boolean
    userId?: boolean
    action?: boolean
    field?: boolean
    oldValue?: boolean
    newValue?: boolean
    createdAt?: boolean
    task?: boolean | TaskDefaultArgs<ExtArgs>
    user?: boolean | TaskAuditLog$userArgs<ExtArgs>
  }, ExtArgs["result"]["taskAuditLog"]>

  export type TaskAuditLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    taskId?: boolean
    userId?: boolean
    action?: boolean
    field?: boolean
    oldValue?: boolean
    newValue?: boolean
    createdAt?: boolean
    task?: boolean | TaskDefaultArgs<ExtArgs>
    user?: boolean | TaskAuditLog$userArgs<ExtArgs>
  }, ExtArgs["result"]["taskAuditLog"]>

  export type TaskAuditLogSelectScalar = {
    id?: boolean
    taskId?: boolean
    userId?: boolean
    action?: boolean
    field?: boolean
    oldValue?: boolean
    newValue?: boolean
    createdAt?: boolean
  }

  export type TaskAuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "taskId" | "userId" | "action" | "field" | "oldValue" | "newValue" | "createdAt", ExtArgs["result"]["taskAuditLog"]>
  export type TaskAuditLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    task?: boolean | TaskDefaultArgs<ExtArgs>
    user?: boolean | TaskAuditLog$userArgs<ExtArgs>
  }
  export type TaskAuditLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    task?: boolean | TaskDefaultArgs<ExtArgs>
    user?: boolean | TaskAuditLog$userArgs<ExtArgs>
  }
  export type TaskAuditLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    task?: boolean | TaskDefaultArgs<ExtArgs>
    user?: boolean | TaskAuditLog$userArgs<ExtArgs>
  }

  export type $TaskAuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TaskAuditLog"
    objects: {
      task: Prisma.$TaskPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      taskId: string
      userId: string | null
      action: string
      field: string | null
      oldValue: string | null
      newValue: string | null
      createdAt: Date
    }, ExtArgs["result"]["taskAuditLog"]>
    composites: {}
  }

  type TaskAuditLogGetPayload<S extends boolean | null | undefined | TaskAuditLogDefaultArgs> = $Result.GetResult<Prisma.$TaskAuditLogPayload, S>

  type TaskAuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TaskAuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TaskAuditLogCountAggregateInputType | true
    }

  export interface TaskAuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TaskAuditLog'], meta: { name: 'TaskAuditLog' } }
    /**
     * Find zero or one TaskAuditLog that matches the filter.
     * @param {TaskAuditLogFindUniqueArgs} args - Arguments to find a TaskAuditLog
     * @example
     * // Get one TaskAuditLog
     * const taskAuditLog = await prisma.taskAuditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TaskAuditLogFindUniqueArgs>(args: SelectSubset<T, TaskAuditLogFindUniqueArgs<ExtArgs>>): Prisma__TaskAuditLogClient<$Result.GetResult<Prisma.$TaskAuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TaskAuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TaskAuditLogFindUniqueOrThrowArgs} args - Arguments to find a TaskAuditLog
     * @example
     * // Get one TaskAuditLog
     * const taskAuditLog = await prisma.taskAuditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TaskAuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, TaskAuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TaskAuditLogClient<$Result.GetResult<Prisma.$TaskAuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TaskAuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskAuditLogFindFirstArgs} args - Arguments to find a TaskAuditLog
     * @example
     * // Get one TaskAuditLog
     * const taskAuditLog = await prisma.taskAuditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TaskAuditLogFindFirstArgs>(args?: SelectSubset<T, TaskAuditLogFindFirstArgs<ExtArgs>>): Prisma__TaskAuditLogClient<$Result.GetResult<Prisma.$TaskAuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TaskAuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskAuditLogFindFirstOrThrowArgs} args - Arguments to find a TaskAuditLog
     * @example
     * // Get one TaskAuditLog
     * const taskAuditLog = await prisma.taskAuditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TaskAuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, TaskAuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__TaskAuditLogClient<$Result.GetResult<Prisma.$TaskAuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TaskAuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskAuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TaskAuditLogs
     * const taskAuditLogs = await prisma.taskAuditLog.findMany()
     * 
     * // Get first 10 TaskAuditLogs
     * const taskAuditLogs = await prisma.taskAuditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const taskAuditLogWithIdOnly = await prisma.taskAuditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TaskAuditLogFindManyArgs>(args?: SelectSubset<T, TaskAuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskAuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TaskAuditLog.
     * @param {TaskAuditLogCreateArgs} args - Arguments to create a TaskAuditLog.
     * @example
     * // Create one TaskAuditLog
     * const TaskAuditLog = await prisma.taskAuditLog.create({
     *   data: {
     *     // ... data to create a TaskAuditLog
     *   }
     * })
     * 
     */
    create<T extends TaskAuditLogCreateArgs>(args: SelectSubset<T, TaskAuditLogCreateArgs<ExtArgs>>): Prisma__TaskAuditLogClient<$Result.GetResult<Prisma.$TaskAuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TaskAuditLogs.
     * @param {TaskAuditLogCreateManyArgs} args - Arguments to create many TaskAuditLogs.
     * @example
     * // Create many TaskAuditLogs
     * const taskAuditLog = await prisma.taskAuditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TaskAuditLogCreateManyArgs>(args?: SelectSubset<T, TaskAuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TaskAuditLogs and returns the data saved in the database.
     * @param {TaskAuditLogCreateManyAndReturnArgs} args - Arguments to create many TaskAuditLogs.
     * @example
     * // Create many TaskAuditLogs
     * const taskAuditLog = await prisma.taskAuditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TaskAuditLogs and only return the `id`
     * const taskAuditLogWithIdOnly = await prisma.taskAuditLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TaskAuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, TaskAuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskAuditLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TaskAuditLog.
     * @param {TaskAuditLogDeleteArgs} args - Arguments to delete one TaskAuditLog.
     * @example
     * // Delete one TaskAuditLog
     * const TaskAuditLog = await prisma.taskAuditLog.delete({
     *   where: {
     *     // ... filter to delete one TaskAuditLog
     *   }
     * })
     * 
     */
    delete<T extends TaskAuditLogDeleteArgs>(args: SelectSubset<T, TaskAuditLogDeleteArgs<ExtArgs>>): Prisma__TaskAuditLogClient<$Result.GetResult<Prisma.$TaskAuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TaskAuditLog.
     * @param {TaskAuditLogUpdateArgs} args - Arguments to update one TaskAuditLog.
     * @example
     * // Update one TaskAuditLog
     * const taskAuditLog = await prisma.taskAuditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TaskAuditLogUpdateArgs>(args: SelectSubset<T, TaskAuditLogUpdateArgs<ExtArgs>>): Prisma__TaskAuditLogClient<$Result.GetResult<Prisma.$TaskAuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TaskAuditLogs.
     * @param {TaskAuditLogDeleteManyArgs} args - Arguments to filter TaskAuditLogs to delete.
     * @example
     * // Delete a few TaskAuditLogs
     * const { count } = await prisma.taskAuditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TaskAuditLogDeleteManyArgs>(args?: SelectSubset<T, TaskAuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TaskAuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskAuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TaskAuditLogs
     * const taskAuditLog = await prisma.taskAuditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TaskAuditLogUpdateManyArgs>(args: SelectSubset<T, TaskAuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TaskAuditLogs and returns the data updated in the database.
     * @param {TaskAuditLogUpdateManyAndReturnArgs} args - Arguments to update many TaskAuditLogs.
     * @example
     * // Update many TaskAuditLogs
     * const taskAuditLog = await prisma.taskAuditLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TaskAuditLogs and only return the `id`
     * const taskAuditLogWithIdOnly = await prisma.taskAuditLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TaskAuditLogUpdateManyAndReturnArgs>(args: SelectSubset<T, TaskAuditLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskAuditLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TaskAuditLog.
     * @param {TaskAuditLogUpsertArgs} args - Arguments to update or create a TaskAuditLog.
     * @example
     * // Update or create a TaskAuditLog
     * const taskAuditLog = await prisma.taskAuditLog.upsert({
     *   create: {
     *     // ... data to create a TaskAuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TaskAuditLog we want to update
     *   }
     * })
     */
    upsert<T extends TaskAuditLogUpsertArgs>(args: SelectSubset<T, TaskAuditLogUpsertArgs<ExtArgs>>): Prisma__TaskAuditLogClient<$Result.GetResult<Prisma.$TaskAuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TaskAuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskAuditLogCountArgs} args - Arguments to filter TaskAuditLogs to count.
     * @example
     * // Count the number of TaskAuditLogs
     * const count = await prisma.taskAuditLog.count({
     *   where: {
     *     // ... the filter for the TaskAuditLogs we want to count
     *   }
     * })
    **/
    count<T extends TaskAuditLogCountArgs>(
      args?: Subset<T, TaskAuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TaskAuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TaskAuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskAuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TaskAuditLogAggregateArgs>(args: Subset<T, TaskAuditLogAggregateArgs>): Prisma.PrismaPromise<GetTaskAuditLogAggregateType<T>>

    /**
     * Group by TaskAuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskAuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TaskAuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TaskAuditLogGroupByArgs['orderBy'] }
        : { orderBy?: TaskAuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TaskAuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TaskAuditLog model
   */
  readonly fields: TaskAuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TaskAuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TaskAuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    task<T extends TaskDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TaskDefaultArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends TaskAuditLog$userArgs<ExtArgs> = {}>(args?: Subset<T, TaskAuditLog$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TaskAuditLog model
   */
  interface TaskAuditLogFieldRefs {
    readonly id: FieldRef<"TaskAuditLog", 'String'>
    readonly taskId: FieldRef<"TaskAuditLog", 'String'>
    readonly userId: FieldRef<"TaskAuditLog", 'String'>
    readonly action: FieldRef<"TaskAuditLog", 'String'>
    readonly field: FieldRef<"TaskAuditLog", 'String'>
    readonly oldValue: FieldRef<"TaskAuditLog", 'String'>
    readonly newValue: FieldRef<"TaskAuditLog", 'String'>
    readonly createdAt: FieldRef<"TaskAuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TaskAuditLog findUnique
   */
  export type TaskAuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskAuditLog
     */
    select?: TaskAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskAuditLog
     */
    omit?: TaskAuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which TaskAuditLog to fetch.
     */
    where: TaskAuditLogWhereUniqueInput
  }

  /**
   * TaskAuditLog findUniqueOrThrow
   */
  export type TaskAuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskAuditLog
     */
    select?: TaskAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskAuditLog
     */
    omit?: TaskAuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which TaskAuditLog to fetch.
     */
    where: TaskAuditLogWhereUniqueInput
  }

  /**
   * TaskAuditLog findFirst
   */
  export type TaskAuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskAuditLog
     */
    select?: TaskAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskAuditLog
     */
    omit?: TaskAuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which TaskAuditLog to fetch.
     */
    where?: TaskAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskAuditLogs to fetch.
     */
    orderBy?: TaskAuditLogOrderByWithRelationInput | TaskAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TaskAuditLogs.
     */
    cursor?: TaskAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TaskAuditLogs.
     */
    distinct?: TaskAuditLogScalarFieldEnum | TaskAuditLogScalarFieldEnum[]
  }

  /**
   * TaskAuditLog findFirstOrThrow
   */
  export type TaskAuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskAuditLog
     */
    select?: TaskAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskAuditLog
     */
    omit?: TaskAuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which TaskAuditLog to fetch.
     */
    where?: TaskAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskAuditLogs to fetch.
     */
    orderBy?: TaskAuditLogOrderByWithRelationInput | TaskAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TaskAuditLogs.
     */
    cursor?: TaskAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TaskAuditLogs.
     */
    distinct?: TaskAuditLogScalarFieldEnum | TaskAuditLogScalarFieldEnum[]
  }

  /**
   * TaskAuditLog findMany
   */
  export type TaskAuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskAuditLog
     */
    select?: TaskAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskAuditLog
     */
    omit?: TaskAuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which TaskAuditLogs to fetch.
     */
    where?: TaskAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskAuditLogs to fetch.
     */
    orderBy?: TaskAuditLogOrderByWithRelationInput | TaskAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TaskAuditLogs.
     */
    cursor?: TaskAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskAuditLogs.
     */
    skip?: number
    distinct?: TaskAuditLogScalarFieldEnum | TaskAuditLogScalarFieldEnum[]
  }

  /**
   * TaskAuditLog create
   */
  export type TaskAuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskAuditLog
     */
    select?: TaskAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskAuditLog
     */
    omit?: TaskAuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskAuditLogInclude<ExtArgs> | null
    /**
     * The data needed to create a TaskAuditLog.
     */
    data: XOR<TaskAuditLogCreateInput, TaskAuditLogUncheckedCreateInput>
  }

  /**
   * TaskAuditLog createMany
   */
  export type TaskAuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TaskAuditLogs.
     */
    data: TaskAuditLogCreateManyInput | TaskAuditLogCreateManyInput[]
  }

  /**
   * TaskAuditLog createManyAndReturn
   */
  export type TaskAuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskAuditLog
     */
    select?: TaskAuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TaskAuditLog
     */
    omit?: TaskAuditLogOmit<ExtArgs> | null
    /**
     * The data used to create many TaskAuditLogs.
     */
    data: TaskAuditLogCreateManyInput | TaskAuditLogCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskAuditLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TaskAuditLog update
   */
  export type TaskAuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskAuditLog
     */
    select?: TaskAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskAuditLog
     */
    omit?: TaskAuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskAuditLogInclude<ExtArgs> | null
    /**
     * The data needed to update a TaskAuditLog.
     */
    data: XOR<TaskAuditLogUpdateInput, TaskAuditLogUncheckedUpdateInput>
    /**
     * Choose, which TaskAuditLog to update.
     */
    where: TaskAuditLogWhereUniqueInput
  }

  /**
   * TaskAuditLog updateMany
   */
  export type TaskAuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TaskAuditLogs.
     */
    data: XOR<TaskAuditLogUpdateManyMutationInput, TaskAuditLogUncheckedUpdateManyInput>
    /**
     * Filter which TaskAuditLogs to update
     */
    where?: TaskAuditLogWhereInput
    /**
     * Limit how many TaskAuditLogs to update.
     */
    limit?: number
  }

  /**
   * TaskAuditLog updateManyAndReturn
   */
  export type TaskAuditLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskAuditLog
     */
    select?: TaskAuditLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TaskAuditLog
     */
    omit?: TaskAuditLogOmit<ExtArgs> | null
    /**
     * The data used to update TaskAuditLogs.
     */
    data: XOR<TaskAuditLogUpdateManyMutationInput, TaskAuditLogUncheckedUpdateManyInput>
    /**
     * Filter which TaskAuditLogs to update
     */
    where?: TaskAuditLogWhereInput
    /**
     * Limit how many TaskAuditLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskAuditLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TaskAuditLog upsert
   */
  export type TaskAuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskAuditLog
     */
    select?: TaskAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskAuditLog
     */
    omit?: TaskAuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskAuditLogInclude<ExtArgs> | null
    /**
     * The filter to search for the TaskAuditLog to update in case it exists.
     */
    where: TaskAuditLogWhereUniqueInput
    /**
     * In case the TaskAuditLog found by the `where` argument doesn't exist, create a new TaskAuditLog with this data.
     */
    create: XOR<TaskAuditLogCreateInput, TaskAuditLogUncheckedCreateInput>
    /**
     * In case the TaskAuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TaskAuditLogUpdateInput, TaskAuditLogUncheckedUpdateInput>
  }

  /**
   * TaskAuditLog delete
   */
  export type TaskAuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskAuditLog
     */
    select?: TaskAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskAuditLog
     */
    omit?: TaskAuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskAuditLogInclude<ExtArgs> | null
    /**
     * Filter which TaskAuditLog to delete.
     */
    where: TaskAuditLogWhereUniqueInput
  }

  /**
   * TaskAuditLog deleteMany
   */
  export type TaskAuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TaskAuditLogs to delete
     */
    where?: TaskAuditLogWhereInput
    /**
     * Limit how many TaskAuditLogs to delete.
     */
    limit?: number
  }

  /**
   * TaskAuditLog.user
   */
  export type TaskAuditLog$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * TaskAuditLog without action
   */
  export type TaskAuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskAuditLog
     */
    select?: TaskAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskAuditLog
     */
    omit?: TaskAuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskAuditLogInclude<ExtArgs> | null
  }


  /**
   * Model DataSource
   */

  export type AggregateDataSource = {
    _count: DataSourceCountAggregateOutputType | null
    _avg: DataSourceAvgAggregateOutputType | null
    _sum: DataSourceSumAggregateOutputType | null
    _min: DataSourceMinAggregateOutputType | null
    _max: DataSourceMaxAggregateOutputType | null
  }

  export type DataSourceAvgAggregateOutputType = {
    fileSize: number | null
    rowCount: number | null
  }

  export type DataSourceSumAggregateOutputType = {
    fileSize: number | null
    rowCount: number | null
  }

  export type DataSourceMinAggregateOutputType = {
    id: string | null
    fileName: string | null
    originalName: string | null
    fileSize: number | null
    rowCount: number | null
    columnMapping: string | null
    uploadedById: string | null
    uploadedAt: Date | null
  }

  export type DataSourceMaxAggregateOutputType = {
    id: string | null
    fileName: string | null
    originalName: string | null
    fileSize: number | null
    rowCount: number | null
    columnMapping: string | null
    uploadedById: string | null
    uploadedAt: Date | null
  }

  export type DataSourceCountAggregateOutputType = {
    id: number
    fileName: number
    originalName: number
    fileSize: number
    rowCount: number
    columnMapping: number
    uploadedById: number
    uploadedAt: number
    _all: number
  }


  export type DataSourceAvgAggregateInputType = {
    fileSize?: true
    rowCount?: true
  }

  export type DataSourceSumAggregateInputType = {
    fileSize?: true
    rowCount?: true
  }

  export type DataSourceMinAggregateInputType = {
    id?: true
    fileName?: true
    originalName?: true
    fileSize?: true
    rowCount?: true
    columnMapping?: true
    uploadedById?: true
    uploadedAt?: true
  }

  export type DataSourceMaxAggregateInputType = {
    id?: true
    fileName?: true
    originalName?: true
    fileSize?: true
    rowCount?: true
    columnMapping?: true
    uploadedById?: true
    uploadedAt?: true
  }

  export type DataSourceCountAggregateInputType = {
    id?: true
    fileName?: true
    originalName?: true
    fileSize?: true
    rowCount?: true
    columnMapping?: true
    uploadedById?: true
    uploadedAt?: true
    _all?: true
  }

  export type DataSourceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DataSource to aggregate.
     */
    where?: DataSourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DataSources to fetch.
     */
    orderBy?: DataSourceOrderByWithRelationInput | DataSourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DataSourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DataSources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DataSources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DataSources
    **/
    _count?: true | DataSourceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DataSourceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DataSourceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DataSourceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DataSourceMaxAggregateInputType
  }

  export type GetDataSourceAggregateType<T extends DataSourceAggregateArgs> = {
        [P in keyof T & keyof AggregateDataSource]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDataSource[P]>
      : GetScalarType<T[P], AggregateDataSource[P]>
  }




  export type DataSourceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DataSourceWhereInput
    orderBy?: DataSourceOrderByWithAggregationInput | DataSourceOrderByWithAggregationInput[]
    by: DataSourceScalarFieldEnum[] | DataSourceScalarFieldEnum
    having?: DataSourceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DataSourceCountAggregateInputType | true
    _avg?: DataSourceAvgAggregateInputType
    _sum?: DataSourceSumAggregateInputType
    _min?: DataSourceMinAggregateInputType
    _max?: DataSourceMaxAggregateInputType
  }

  export type DataSourceGroupByOutputType = {
    id: string
    fileName: string
    originalName: string
    fileSize: number
    rowCount: number
    columnMapping: string | null
    uploadedById: string | null
    uploadedAt: Date
    _count: DataSourceCountAggregateOutputType | null
    _avg: DataSourceAvgAggregateOutputType | null
    _sum: DataSourceSumAggregateOutputType | null
    _min: DataSourceMinAggregateOutputType | null
    _max: DataSourceMaxAggregateOutputType | null
  }

  type GetDataSourceGroupByPayload<T extends DataSourceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DataSourceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DataSourceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DataSourceGroupByOutputType[P]>
            : GetScalarType<T[P], DataSourceGroupByOutputType[P]>
        }
      >
    >


  export type DataSourceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileName?: boolean
    originalName?: boolean
    fileSize?: boolean
    rowCount?: boolean
    columnMapping?: boolean
    uploadedById?: boolean
    uploadedAt?: boolean
    tasks?: boolean | DataSource$tasksArgs<ExtArgs>
    _count?: boolean | DataSourceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dataSource"]>

  export type DataSourceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileName?: boolean
    originalName?: boolean
    fileSize?: boolean
    rowCount?: boolean
    columnMapping?: boolean
    uploadedById?: boolean
    uploadedAt?: boolean
  }, ExtArgs["result"]["dataSource"]>

  export type DataSourceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileName?: boolean
    originalName?: boolean
    fileSize?: boolean
    rowCount?: boolean
    columnMapping?: boolean
    uploadedById?: boolean
    uploadedAt?: boolean
  }, ExtArgs["result"]["dataSource"]>

  export type DataSourceSelectScalar = {
    id?: boolean
    fileName?: boolean
    originalName?: boolean
    fileSize?: boolean
    rowCount?: boolean
    columnMapping?: boolean
    uploadedById?: boolean
    uploadedAt?: boolean
  }

  export type DataSourceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "fileName" | "originalName" | "fileSize" | "rowCount" | "columnMapping" | "uploadedById" | "uploadedAt", ExtArgs["result"]["dataSource"]>
  export type DataSourceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tasks?: boolean | DataSource$tasksArgs<ExtArgs>
    _count?: boolean | DataSourceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DataSourceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type DataSourceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $DataSourcePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DataSource"
    objects: {
      tasks: Prisma.$TaskPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fileName: string
      originalName: string
      fileSize: number
      rowCount: number
      columnMapping: string | null
      uploadedById: string | null
      uploadedAt: Date
    }, ExtArgs["result"]["dataSource"]>
    composites: {}
  }

  type DataSourceGetPayload<S extends boolean | null | undefined | DataSourceDefaultArgs> = $Result.GetResult<Prisma.$DataSourcePayload, S>

  type DataSourceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DataSourceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DataSourceCountAggregateInputType | true
    }

  export interface DataSourceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DataSource'], meta: { name: 'DataSource' } }
    /**
     * Find zero or one DataSource that matches the filter.
     * @param {DataSourceFindUniqueArgs} args - Arguments to find a DataSource
     * @example
     * // Get one DataSource
     * const dataSource = await prisma.dataSource.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DataSourceFindUniqueArgs>(args: SelectSubset<T, DataSourceFindUniqueArgs<ExtArgs>>): Prisma__DataSourceClient<$Result.GetResult<Prisma.$DataSourcePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DataSource that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DataSourceFindUniqueOrThrowArgs} args - Arguments to find a DataSource
     * @example
     * // Get one DataSource
     * const dataSource = await prisma.dataSource.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DataSourceFindUniqueOrThrowArgs>(args: SelectSubset<T, DataSourceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DataSourceClient<$Result.GetResult<Prisma.$DataSourcePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DataSource that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataSourceFindFirstArgs} args - Arguments to find a DataSource
     * @example
     * // Get one DataSource
     * const dataSource = await prisma.dataSource.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DataSourceFindFirstArgs>(args?: SelectSubset<T, DataSourceFindFirstArgs<ExtArgs>>): Prisma__DataSourceClient<$Result.GetResult<Prisma.$DataSourcePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DataSource that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataSourceFindFirstOrThrowArgs} args - Arguments to find a DataSource
     * @example
     * // Get one DataSource
     * const dataSource = await prisma.dataSource.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DataSourceFindFirstOrThrowArgs>(args?: SelectSubset<T, DataSourceFindFirstOrThrowArgs<ExtArgs>>): Prisma__DataSourceClient<$Result.GetResult<Prisma.$DataSourcePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DataSources that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataSourceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DataSources
     * const dataSources = await prisma.dataSource.findMany()
     * 
     * // Get first 10 DataSources
     * const dataSources = await prisma.dataSource.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dataSourceWithIdOnly = await prisma.dataSource.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DataSourceFindManyArgs>(args?: SelectSubset<T, DataSourceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DataSourcePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DataSource.
     * @param {DataSourceCreateArgs} args - Arguments to create a DataSource.
     * @example
     * // Create one DataSource
     * const DataSource = await prisma.dataSource.create({
     *   data: {
     *     // ... data to create a DataSource
     *   }
     * })
     * 
     */
    create<T extends DataSourceCreateArgs>(args: SelectSubset<T, DataSourceCreateArgs<ExtArgs>>): Prisma__DataSourceClient<$Result.GetResult<Prisma.$DataSourcePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DataSources.
     * @param {DataSourceCreateManyArgs} args - Arguments to create many DataSources.
     * @example
     * // Create many DataSources
     * const dataSource = await prisma.dataSource.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DataSourceCreateManyArgs>(args?: SelectSubset<T, DataSourceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DataSources and returns the data saved in the database.
     * @param {DataSourceCreateManyAndReturnArgs} args - Arguments to create many DataSources.
     * @example
     * // Create many DataSources
     * const dataSource = await prisma.dataSource.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DataSources and only return the `id`
     * const dataSourceWithIdOnly = await prisma.dataSource.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DataSourceCreateManyAndReturnArgs>(args?: SelectSubset<T, DataSourceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DataSourcePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DataSource.
     * @param {DataSourceDeleteArgs} args - Arguments to delete one DataSource.
     * @example
     * // Delete one DataSource
     * const DataSource = await prisma.dataSource.delete({
     *   where: {
     *     // ... filter to delete one DataSource
     *   }
     * })
     * 
     */
    delete<T extends DataSourceDeleteArgs>(args: SelectSubset<T, DataSourceDeleteArgs<ExtArgs>>): Prisma__DataSourceClient<$Result.GetResult<Prisma.$DataSourcePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DataSource.
     * @param {DataSourceUpdateArgs} args - Arguments to update one DataSource.
     * @example
     * // Update one DataSource
     * const dataSource = await prisma.dataSource.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DataSourceUpdateArgs>(args: SelectSubset<T, DataSourceUpdateArgs<ExtArgs>>): Prisma__DataSourceClient<$Result.GetResult<Prisma.$DataSourcePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DataSources.
     * @param {DataSourceDeleteManyArgs} args - Arguments to filter DataSources to delete.
     * @example
     * // Delete a few DataSources
     * const { count } = await prisma.dataSource.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DataSourceDeleteManyArgs>(args?: SelectSubset<T, DataSourceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DataSources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataSourceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DataSources
     * const dataSource = await prisma.dataSource.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DataSourceUpdateManyArgs>(args: SelectSubset<T, DataSourceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DataSources and returns the data updated in the database.
     * @param {DataSourceUpdateManyAndReturnArgs} args - Arguments to update many DataSources.
     * @example
     * // Update many DataSources
     * const dataSource = await prisma.dataSource.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DataSources and only return the `id`
     * const dataSourceWithIdOnly = await prisma.dataSource.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DataSourceUpdateManyAndReturnArgs>(args: SelectSubset<T, DataSourceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DataSourcePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DataSource.
     * @param {DataSourceUpsertArgs} args - Arguments to update or create a DataSource.
     * @example
     * // Update or create a DataSource
     * const dataSource = await prisma.dataSource.upsert({
     *   create: {
     *     // ... data to create a DataSource
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DataSource we want to update
     *   }
     * })
     */
    upsert<T extends DataSourceUpsertArgs>(args: SelectSubset<T, DataSourceUpsertArgs<ExtArgs>>): Prisma__DataSourceClient<$Result.GetResult<Prisma.$DataSourcePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DataSources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataSourceCountArgs} args - Arguments to filter DataSources to count.
     * @example
     * // Count the number of DataSources
     * const count = await prisma.dataSource.count({
     *   where: {
     *     // ... the filter for the DataSources we want to count
     *   }
     * })
    **/
    count<T extends DataSourceCountArgs>(
      args?: Subset<T, DataSourceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DataSourceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DataSource.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataSourceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DataSourceAggregateArgs>(args: Subset<T, DataSourceAggregateArgs>): Prisma.PrismaPromise<GetDataSourceAggregateType<T>>

    /**
     * Group by DataSource.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataSourceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DataSourceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DataSourceGroupByArgs['orderBy'] }
        : { orderBy?: DataSourceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DataSourceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDataSourceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DataSource model
   */
  readonly fields: DataSourceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DataSource.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DataSourceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tasks<T extends DataSource$tasksArgs<ExtArgs> = {}>(args?: Subset<T, DataSource$tasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DataSource model
   */
  interface DataSourceFieldRefs {
    readonly id: FieldRef<"DataSource", 'String'>
    readonly fileName: FieldRef<"DataSource", 'String'>
    readonly originalName: FieldRef<"DataSource", 'String'>
    readonly fileSize: FieldRef<"DataSource", 'Int'>
    readonly rowCount: FieldRef<"DataSource", 'Int'>
    readonly columnMapping: FieldRef<"DataSource", 'String'>
    readonly uploadedById: FieldRef<"DataSource", 'String'>
    readonly uploadedAt: FieldRef<"DataSource", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DataSource findUnique
   */
  export type DataSourceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataSource
     */
    select?: DataSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataSource
     */
    omit?: DataSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataSourceInclude<ExtArgs> | null
    /**
     * Filter, which DataSource to fetch.
     */
    where: DataSourceWhereUniqueInput
  }

  /**
   * DataSource findUniqueOrThrow
   */
  export type DataSourceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataSource
     */
    select?: DataSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataSource
     */
    omit?: DataSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataSourceInclude<ExtArgs> | null
    /**
     * Filter, which DataSource to fetch.
     */
    where: DataSourceWhereUniqueInput
  }

  /**
   * DataSource findFirst
   */
  export type DataSourceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataSource
     */
    select?: DataSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataSource
     */
    omit?: DataSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataSourceInclude<ExtArgs> | null
    /**
     * Filter, which DataSource to fetch.
     */
    where?: DataSourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DataSources to fetch.
     */
    orderBy?: DataSourceOrderByWithRelationInput | DataSourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DataSources.
     */
    cursor?: DataSourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DataSources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DataSources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DataSources.
     */
    distinct?: DataSourceScalarFieldEnum | DataSourceScalarFieldEnum[]
  }

  /**
   * DataSource findFirstOrThrow
   */
  export type DataSourceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataSource
     */
    select?: DataSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataSource
     */
    omit?: DataSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataSourceInclude<ExtArgs> | null
    /**
     * Filter, which DataSource to fetch.
     */
    where?: DataSourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DataSources to fetch.
     */
    orderBy?: DataSourceOrderByWithRelationInput | DataSourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DataSources.
     */
    cursor?: DataSourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DataSources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DataSources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DataSources.
     */
    distinct?: DataSourceScalarFieldEnum | DataSourceScalarFieldEnum[]
  }

  /**
   * DataSource findMany
   */
  export type DataSourceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataSource
     */
    select?: DataSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataSource
     */
    omit?: DataSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataSourceInclude<ExtArgs> | null
    /**
     * Filter, which DataSources to fetch.
     */
    where?: DataSourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DataSources to fetch.
     */
    orderBy?: DataSourceOrderByWithRelationInput | DataSourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DataSources.
     */
    cursor?: DataSourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DataSources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DataSources.
     */
    skip?: number
    distinct?: DataSourceScalarFieldEnum | DataSourceScalarFieldEnum[]
  }

  /**
   * DataSource create
   */
  export type DataSourceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataSource
     */
    select?: DataSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataSource
     */
    omit?: DataSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataSourceInclude<ExtArgs> | null
    /**
     * The data needed to create a DataSource.
     */
    data: XOR<DataSourceCreateInput, DataSourceUncheckedCreateInput>
  }

  /**
   * DataSource createMany
   */
  export type DataSourceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DataSources.
     */
    data: DataSourceCreateManyInput | DataSourceCreateManyInput[]
  }

  /**
   * DataSource createManyAndReturn
   */
  export type DataSourceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataSource
     */
    select?: DataSourceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DataSource
     */
    omit?: DataSourceOmit<ExtArgs> | null
    /**
     * The data used to create many DataSources.
     */
    data: DataSourceCreateManyInput | DataSourceCreateManyInput[]
  }

  /**
   * DataSource update
   */
  export type DataSourceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataSource
     */
    select?: DataSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataSource
     */
    omit?: DataSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataSourceInclude<ExtArgs> | null
    /**
     * The data needed to update a DataSource.
     */
    data: XOR<DataSourceUpdateInput, DataSourceUncheckedUpdateInput>
    /**
     * Choose, which DataSource to update.
     */
    where: DataSourceWhereUniqueInput
  }

  /**
   * DataSource updateMany
   */
  export type DataSourceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DataSources.
     */
    data: XOR<DataSourceUpdateManyMutationInput, DataSourceUncheckedUpdateManyInput>
    /**
     * Filter which DataSources to update
     */
    where?: DataSourceWhereInput
    /**
     * Limit how many DataSources to update.
     */
    limit?: number
  }

  /**
   * DataSource updateManyAndReturn
   */
  export type DataSourceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataSource
     */
    select?: DataSourceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DataSource
     */
    omit?: DataSourceOmit<ExtArgs> | null
    /**
     * The data used to update DataSources.
     */
    data: XOR<DataSourceUpdateManyMutationInput, DataSourceUncheckedUpdateManyInput>
    /**
     * Filter which DataSources to update
     */
    where?: DataSourceWhereInput
    /**
     * Limit how many DataSources to update.
     */
    limit?: number
  }

  /**
   * DataSource upsert
   */
  export type DataSourceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataSource
     */
    select?: DataSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataSource
     */
    omit?: DataSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataSourceInclude<ExtArgs> | null
    /**
     * The filter to search for the DataSource to update in case it exists.
     */
    where: DataSourceWhereUniqueInput
    /**
     * In case the DataSource found by the `where` argument doesn't exist, create a new DataSource with this data.
     */
    create: XOR<DataSourceCreateInput, DataSourceUncheckedCreateInput>
    /**
     * In case the DataSource was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DataSourceUpdateInput, DataSourceUncheckedUpdateInput>
  }

  /**
   * DataSource delete
   */
  export type DataSourceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataSource
     */
    select?: DataSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataSource
     */
    omit?: DataSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataSourceInclude<ExtArgs> | null
    /**
     * Filter which DataSource to delete.
     */
    where: DataSourceWhereUniqueInput
  }

  /**
   * DataSource deleteMany
   */
  export type DataSourceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DataSources to delete
     */
    where?: DataSourceWhereInput
    /**
     * Limit how many DataSources to delete.
     */
    limit?: number
  }

  /**
   * DataSource.tasks
   */
  export type DataSource$tasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    cursor?: TaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * DataSource without action
   */
  export type DataSourceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataSource
     */
    select?: DataSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataSource
     */
    omit?: DataSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataSourceInclude<ExtArgs> | null
  }


  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  export type NotificationMinAggregateOutputType = {
    id: string | null
    taskId: string | null
    userId: string | null
    type: string | null
    channel: string | null
    subject: string | null
    message: string | null
    status: string | null
    scheduledAt: Date | null
    sentAt: Date | null
    error: string | null
    createdAt: Date | null
  }

  export type NotificationMaxAggregateOutputType = {
    id: string | null
    taskId: string | null
    userId: string | null
    type: string | null
    channel: string | null
    subject: string | null
    message: string | null
    status: string | null
    scheduledAt: Date | null
    sentAt: Date | null
    error: string | null
    createdAt: Date | null
  }

  export type NotificationCountAggregateOutputType = {
    id: number
    taskId: number
    userId: number
    type: number
    channel: number
    subject: number
    message: number
    status: number
    scheduledAt: number
    sentAt: number
    error: number
    createdAt: number
    _all: number
  }


  export type NotificationMinAggregateInputType = {
    id?: true
    taskId?: true
    userId?: true
    type?: true
    channel?: true
    subject?: true
    message?: true
    status?: true
    scheduledAt?: true
    sentAt?: true
    error?: true
    createdAt?: true
  }

  export type NotificationMaxAggregateInputType = {
    id?: true
    taskId?: true
    userId?: true
    type?: true
    channel?: true
    subject?: true
    message?: true
    status?: true
    scheduledAt?: true
    sentAt?: true
    error?: true
    createdAt?: true
  }

  export type NotificationCountAggregateInputType = {
    id?: true
    taskId?: true
    userId?: true
    type?: true
    channel?: true
    subject?: true
    message?: true
    status?: true
    scheduledAt?: true
    sentAt?: true
    error?: true
    createdAt?: true
    _all?: true
  }

  export type NotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notifications
    **/
    _count?: true | NotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationMaxAggregateInputType
  }

  export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>
  }




  export type NotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithAggregationInput | NotificationOrderByWithAggregationInput[]
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum
    having?: NotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationCountAggregateInputType | true
    _min?: NotificationMinAggregateInputType
    _max?: NotificationMaxAggregateInputType
  }

  export type NotificationGroupByOutputType = {
    id: string
    taskId: string | null
    userId: string | null
    type: string
    channel: string
    subject: string
    message: string
    status: string
    scheduledAt: Date | null
    sentAt: Date | null
    error: string | null
    createdAt: Date
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>
        }
      >
    >


  export type NotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    taskId?: boolean
    userId?: boolean
    type?: boolean
    channel?: boolean
    subject?: boolean
    message?: boolean
    status?: boolean
    scheduledAt?: boolean
    sentAt?: boolean
    error?: boolean
    createdAt?: boolean
    task?: boolean | Notification$taskArgs<ExtArgs>
    user?: boolean | Notification$userArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    taskId?: boolean
    userId?: boolean
    type?: boolean
    channel?: boolean
    subject?: boolean
    message?: boolean
    status?: boolean
    scheduledAt?: boolean
    sentAt?: boolean
    error?: boolean
    createdAt?: boolean
    task?: boolean | Notification$taskArgs<ExtArgs>
    user?: boolean | Notification$userArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    taskId?: boolean
    userId?: boolean
    type?: boolean
    channel?: boolean
    subject?: boolean
    message?: boolean
    status?: boolean
    scheduledAt?: boolean
    sentAt?: boolean
    error?: boolean
    createdAt?: boolean
    task?: boolean | Notification$taskArgs<ExtArgs>
    user?: boolean | Notification$userArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectScalar = {
    id?: boolean
    taskId?: boolean
    userId?: boolean
    type?: boolean
    channel?: boolean
    subject?: boolean
    message?: boolean
    status?: boolean
    scheduledAt?: boolean
    sentAt?: boolean
    error?: boolean
    createdAt?: boolean
  }

  export type NotificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "taskId" | "userId" | "type" | "channel" | "subject" | "message" | "status" | "scheduledAt" | "sentAt" | "error" | "createdAt", ExtArgs["result"]["notification"]>
  export type NotificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    task?: boolean | Notification$taskArgs<ExtArgs>
    user?: boolean | Notification$userArgs<ExtArgs>
  }
  export type NotificationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    task?: boolean | Notification$taskArgs<ExtArgs>
    user?: boolean | Notification$userArgs<ExtArgs>
  }
  export type NotificationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    task?: boolean | Notification$taskArgs<ExtArgs>
    user?: boolean | Notification$userArgs<ExtArgs>
  }

  export type $NotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Notification"
    objects: {
      task: Prisma.$TaskPayload<ExtArgs> | null
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      taskId: string | null
      userId: string | null
      type: string
      channel: string
      subject: string
      message: string
      status: string
      scheduledAt: Date | null
      sentAt: Date | null
      error: string | null
      createdAt: Date
    }, ExtArgs["result"]["notification"]>
    composites: {}
  }

  type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = $Result.GetResult<Prisma.$NotificationPayload, S>

  type NotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NotificationCountAggregateInputType | true
    }

  export interface NotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Notification'], meta: { name: 'Notification' } }
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     * 
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationWithIdOnly = await prisma.notification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationFindManyArgs>(args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     * 
     */
    create<T extends NotificationCreateArgs>(args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationCreateManyArgs>(args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Notifications and returns the data saved in the database.
     * @param {NotificationCreateManyAndReturnArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeleteArgs>(args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationUpdateArgs>(args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeleteManyArgs>(args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationUpdateManyArgs>(args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications and returns the data updated in the database.
     * @param {NotificationUpdateManyAndReturnArgs} args - Arguments to update many Notifications.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NotificationUpdateManyAndReturnArgs>(args: SelectSubset<T, NotificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
    **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NotificationAggregateArgs>(args: Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Notification model
   */
  readonly fields: NotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    task<T extends Notification$taskArgs<ExtArgs> = {}>(args?: Subset<T, Notification$taskArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    user<T extends Notification$userArgs<ExtArgs> = {}>(args?: Subset<T, Notification$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Notification model
   */
  interface NotificationFieldRefs {
    readonly id: FieldRef<"Notification", 'String'>
    readonly taskId: FieldRef<"Notification", 'String'>
    readonly userId: FieldRef<"Notification", 'String'>
    readonly type: FieldRef<"Notification", 'String'>
    readonly channel: FieldRef<"Notification", 'String'>
    readonly subject: FieldRef<"Notification", 'String'>
    readonly message: FieldRef<"Notification", 'String'>
    readonly status: FieldRef<"Notification", 'String'>
    readonly scheduledAt: FieldRef<"Notification", 'DateTime'>
    readonly sentAt: FieldRef<"Notification", 'DateTime'>
    readonly error: FieldRef<"Notification", 'String'>
    readonly createdAt: FieldRef<"Notification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification create
   */
  export type NotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
  }

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
  }

  /**
   * Notification createManyAndReturn
   */
  export type NotificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
  }

  /**
   * Notification updateManyAndReturn
   */
  export type NotificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
  }

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to delete.
     */
    limit?: number
  }

  /**
   * Notification.task
   */
  export type Notification$taskArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    where?: TaskWhereInput
  }

  /**
   * Notification.user
   */
  export type Notification$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
  }


  /**
   * Model NotificationRule
   */

  export type AggregateNotificationRule = {
    _count: NotificationRuleCountAggregateOutputType | null
    _avg: NotificationRuleAvgAggregateOutputType | null
    _sum: NotificationRuleSumAggregateOutputType | null
    _min: NotificationRuleMinAggregateOutputType | null
    _max: NotificationRuleMaxAggregateOutputType | null
  }

  export type NotificationRuleAvgAggregateOutputType = {
    daysBeforeDue: number | null
  }

  export type NotificationRuleSumAggregateOutputType = {
    daysBeforeDue: number | null
  }

  export type NotificationRuleMinAggregateOutputType = {
    id: string | null
    name: string | null
    type: string | null
    channel: string | null
    daysBeforeDue: number | null
    notifyOwner: boolean | null
    notifyAssignee: boolean | null
    notifyManager: boolean | null
    subjectTemplate: string | null
    bodyTemplate: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NotificationRuleMaxAggregateOutputType = {
    id: string | null
    name: string | null
    type: string | null
    channel: string | null
    daysBeforeDue: number | null
    notifyOwner: boolean | null
    notifyAssignee: boolean | null
    notifyManager: boolean | null
    subjectTemplate: string | null
    bodyTemplate: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NotificationRuleCountAggregateOutputType = {
    id: number
    name: number
    type: number
    channel: number
    daysBeforeDue: number
    notifyOwner: number
    notifyAssignee: number
    notifyManager: number
    subjectTemplate: number
    bodyTemplate: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type NotificationRuleAvgAggregateInputType = {
    daysBeforeDue?: true
  }

  export type NotificationRuleSumAggregateInputType = {
    daysBeforeDue?: true
  }

  export type NotificationRuleMinAggregateInputType = {
    id?: true
    name?: true
    type?: true
    channel?: true
    daysBeforeDue?: true
    notifyOwner?: true
    notifyAssignee?: true
    notifyManager?: true
    subjectTemplate?: true
    bodyTemplate?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NotificationRuleMaxAggregateInputType = {
    id?: true
    name?: true
    type?: true
    channel?: true
    daysBeforeDue?: true
    notifyOwner?: true
    notifyAssignee?: true
    notifyManager?: true
    subjectTemplate?: true
    bodyTemplate?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NotificationRuleCountAggregateInputType = {
    id?: true
    name?: true
    type?: true
    channel?: true
    daysBeforeDue?: true
    notifyOwner?: true
    notifyAssignee?: true
    notifyManager?: true
    subjectTemplate?: true
    bodyTemplate?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type NotificationRuleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NotificationRule to aggregate.
     */
    where?: NotificationRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationRules to fetch.
     */
    orderBy?: NotificationRuleOrderByWithRelationInput | NotificationRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NotificationRules
    **/
    _count?: true | NotificationRuleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NotificationRuleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NotificationRuleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationRuleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationRuleMaxAggregateInputType
  }

  export type GetNotificationRuleAggregateType<T extends NotificationRuleAggregateArgs> = {
        [P in keyof T & keyof AggregateNotificationRule]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotificationRule[P]>
      : GetScalarType<T[P], AggregateNotificationRule[P]>
  }




  export type NotificationRuleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationRuleWhereInput
    orderBy?: NotificationRuleOrderByWithAggregationInput | NotificationRuleOrderByWithAggregationInput[]
    by: NotificationRuleScalarFieldEnum[] | NotificationRuleScalarFieldEnum
    having?: NotificationRuleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationRuleCountAggregateInputType | true
    _avg?: NotificationRuleAvgAggregateInputType
    _sum?: NotificationRuleSumAggregateInputType
    _min?: NotificationRuleMinAggregateInputType
    _max?: NotificationRuleMaxAggregateInputType
  }

  export type NotificationRuleGroupByOutputType = {
    id: string
    name: string
    type: string
    channel: string
    daysBeforeDue: number | null
    notifyOwner: boolean
    notifyAssignee: boolean
    notifyManager: boolean
    subjectTemplate: string | null
    bodyTemplate: string | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: NotificationRuleCountAggregateOutputType | null
    _avg: NotificationRuleAvgAggregateOutputType | null
    _sum: NotificationRuleSumAggregateOutputType | null
    _min: NotificationRuleMinAggregateOutputType | null
    _max: NotificationRuleMaxAggregateOutputType | null
  }

  type GetNotificationRuleGroupByPayload<T extends NotificationRuleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationRuleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationRuleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationRuleGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationRuleGroupByOutputType[P]>
        }
      >
    >


  export type NotificationRuleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    channel?: boolean
    daysBeforeDue?: boolean
    notifyOwner?: boolean
    notifyAssignee?: boolean
    notifyManager?: boolean
    subjectTemplate?: boolean
    bodyTemplate?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["notificationRule"]>

  export type NotificationRuleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    channel?: boolean
    daysBeforeDue?: boolean
    notifyOwner?: boolean
    notifyAssignee?: boolean
    notifyManager?: boolean
    subjectTemplate?: boolean
    bodyTemplate?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["notificationRule"]>

  export type NotificationRuleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    channel?: boolean
    daysBeforeDue?: boolean
    notifyOwner?: boolean
    notifyAssignee?: boolean
    notifyManager?: boolean
    subjectTemplate?: boolean
    bodyTemplate?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["notificationRule"]>

  export type NotificationRuleSelectScalar = {
    id?: boolean
    name?: boolean
    type?: boolean
    channel?: boolean
    daysBeforeDue?: boolean
    notifyOwner?: boolean
    notifyAssignee?: boolean
    notifyManager?: boolean
    subjectTemplate?: boolean
    bodyTemplate?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type NotificationRuleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "type" | "channel" | "daysBeforeDue" | "notifyOwner" | "notifyAssignee" | "notifyManager" | "subjectTemplate" | "bodyTemplate" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["notificationRule"]>

  export type $NotificationRulePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NotificationRule"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      type: string
      channel: string
      daysBeforeDue: number | null
      notifyOwner: boolean
      notifyAssignee: boolean
      notifyManager: boolean
      subjectTemplate: string | null
      bodyTemplate: string | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["notificationRule"]>
    composites: {}
  }

  type NotificationRuleGetPayload<S extends boolean | null | undefined | NotificationRuleDefaultArgs> = $Result.GetResult<Prisma.$NotificationRulePayload, S>

  type NotificationRuleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NotificationRuleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NotificationRuleCountAggregateInputType | true
    }

  export interface NotificationRuleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NotificationRule'], meta: { name: 'NotificationRule' } }
    /**
     * Find zero or one NotificationRule that matches the filter.
     * @param {NotificationRuleFindUniqueArgs} args - Arguments to find a NotificationRule
     * @example
     * // Get one NotificationRule
     * const notificationRule = await prisma.notificationRule.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationRuleFindUniqueArgs>(args: SelectSubset<T, NotificationRuleFindUniqueArgs<ExtArgs>>): Prisma__NotificationRuleClient<$Result.GetResult<Prisma.$NotificationRulePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one NotificationRule that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NotificationRuleFindUniqueOrThrowArgs} args - Arguments to find a NotificationRule
     * @example
     * // Get one NotificationRule
     * const notificationRule = await prisma.notificationRule.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationRuleFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationRuleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationRuleClient<$Result.GetResult<Prisma.$NotificationRulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NotificationRule that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationRuleFindFirstArgs} args - Arguments to find a NotificationRule
     * @example
     * // Get one NotificationRule
     * const notificationRule = await prisma.notificationRule.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationRuleFindFirstArgs>(args?: SelectSubset<T, NotificationRuleFindFirstArgs<ExtArgs>>): Prisma__NotificationRuleClient<$Result.GetResult<Prisma.$NotificationRulePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NotificationRule that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationRuleFindFirstOrThrowArgs} args - Arguments to find a NotificationRule
     * @example
     * // Get one NotificationRule
     * const notificationRule = await prisma.notificationRule.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationRuleFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationRuleFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationRuleClient<$Result.GetResult<Prisma.$NotificationRulePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more NotificationRules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationRuleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NotificationRules
     * const notificationRules = await prisma.notificationRule.findMany()
     * 
     * // Get first 10 NotificationRules
     * const notificationRules = await prisma.notificationRule.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationRuleWithIdOnly = await prisma.notificationRule.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationRuleFindManyArgs>(args?: SelectSubset<T, NotificationRuleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationRulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a NotificationRule.
     * @param {NotificationRuleCreateArgs} args - Arguments to create a NotificationRule.
     * @example
     * // Create one NotificationRule
     * const NotificationRule = await prisma.notificationRule.create({
     *   data: {
     *     // ... data to create a NotificationRule
     *   }
     * })
     * 
     */
    create<T extends NotificationRuleCreateArgs>(args: SelectSubset<T, NotificationRuleCreateArgs<ExtArgs>>): Prisma__NotificationRuleClient<$Result.GetResult<Prisma.$NotificationRulePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many NotificationRules.
     * @param {NotificationRuleCreateManyArgs} args - Arguments to create many NotificationRules.
     * @example
     * // Create many NotificationRules
     * const notificationRule = await prisma.notificationRule.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationRuleCreateManyArgs>(args?: SelectSubset<T, NotificationRuleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NotificationRules and returns the data saved in the database.
     * @param {NotificationRuleCreateManyAndReturnArgs} args - Arguments to create many NotificationRules.
     * @example
     * // Create many NotificationRules
     * const notificationRule = await prisma.notificationRule.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NotificationRules and only return the `id`
     * const notificationRuleWithIdOnly = await prisma.notificationRule.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationRuleCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationRuleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationRulePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a NotificationRule.
     * @param {NotificationRuleDeleteArgs} args - Arguments to delete one NotificationRule.
     * @example
     * // Delete one NotificationRule
     * const NotificationRule = await prisma.notificationRule.delete({
     *   where: {
     *     // ... filter to delete one NotificationRule
     *   }
     * })
     * 
     */
    delete<T extends NotificationRuleDeleteArgs>(args: SelectSubset<T, NotificationRuleDeleteArgs<ExtArgs>>): Prisma__NotificationRuleClient<$Result.GetResult<Prisma.$NotificationRulePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one NotificationRule.
     * @param {NotificationRuleUpdateArgs} args - Arguments to update one NotificationRule.
     * @example
     * // Update one NotificationRule
     * const notificationRule = await prisma.notificationRule.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationRuleUpdateArgs>(args: SelectSubset<T, NotificationRuleUpdateArgs<ExtArgs>>): Prisma__NotificationRuleClient<$Result.GetResult<Prisma.$NotificationRulePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more NotificationRules.
     * @param {NotificationRuleDeleteManyArgs} args - Arguments to filter NotificationRules to delete.
     * @example
     * // Delete a few NotificationRules
     * const { count } = await prisma.notificationRule.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationRuleDeleteManyArgs>(args?: SelectSubset<T, NotificationRuleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NotificationRules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationRuleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NotificationRules
     * const notificationRule = await prisma.notificationRule.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationRuleUpdateManyArgs>(args: SelectSubset<T, NotificationRuleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NotificationRules and returns the data updated in the database.
     * @param {NotificationRuleUpdateManyAndReturnArgs} args - Arguments to update many NotificationRules.
     * @example
     * // Update many NotificationRules
     * const notificationRule = await prisma.notificationRule.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more NotificationRules and only return the `id`
     * const notificationRuleWithIdOnly = await prisma.notificationRule.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NotificationRuleUpdateManyAndReturnArgs>(args: SelectSubset<T, NotificationRuleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationRulePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one NotificationRule.
     * @param {NotificationRuleUpsertArgs} args - Arguments to update or create a NotificationRule.
     * @example
     * // Update or create a NotificationRule
     * const notificationRule = await prisma.notificationRule.upsert({
     *   create: {
     *     // ... data to create a NotificationRule
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NotificationRule we want to update
     *   }
     * })
     */
    upsert<T extends NotificationRuleUpsertArgs>(args: SelectSubset<T, NotificationRuleUpsertArgs<ExtArgs>>): Prisma__NotificationRuleClient<$Result.GetResult<Prisma.$NotificationRulePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of NotificationRules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationRuleCountArgs} args - Arguments to filter NotificationRules to count.
     * @example
     * // Count the number of NotificationRules
     * const count = await prisma.notificationRule.count({
     *   where: {
     *     // ... the filter for the NotificationRules we want to count
     *   }
     * })
    **/
    count<T extends NotificationRuleCountArgs>(
      args?: Subset<T, NotificationRuleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationRuleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NotificationRule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationRuleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NotificationRuleAggregateArgs>(args: Subset<T, NotificationRuleAggregateArgs>): Prisma.PrismaPromise<GetNotificationRuleAggregateType<T>>

    /**
     * Group by NotificationRule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationRuleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NotificationRuleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationRuleGroupByArgs['orderBy'] }
        : { orderBy?: NotificationRuleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NotificationRuleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationRuleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NotificationRule model
   */
  readonly fields: NotificationRuleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NotificationRule.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationRuleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the NotificationRule model
   */
  interface NotificationRuleFieldRefs {
    readonly id: FieldRef<"NotificationRule", 'String'>
    readonly name: FieldRef<"NotificationRule", 'String'>
    readonly type: FieldRef<"NotificationRule", 'String'>
    readonly channel: FieldRef<"NotificationRule", 'String'>
    readonly daysBeforeDue: FieldRef<"NotificationRule", 'Int'>
    readonly notifyOwner: FieldRef<"NotificationRule", 'Boolean'>
    readonly notifyAssignee: FieldRef<"NotificationRule", 'Boolean'>
    readonly notifyManager: FieldRef<"NotificationRule", 'Boolean'>
    readonly subjectTemplate: FieldRef<"NotificationRule", 'String'>
    readonly bodyTemplate: FieldRef<"NotificationRule", 'String'>
    readonly isActive: FieldRef<"NotificationRule", 'Boolean'>
    readonly createdAt: FieldRef<"NotificationRule", 'DateTime'>
    readonly updatedAt: FieldRef<"NotificationRule", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * NotificationRule findUnique
   */
  export type NotificationRuleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRule
     */
    select?: NotificationRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRule
     */
    omit?: NotificationRuleOmit<ExtArgs> | null
    /**
     * Filter, which NotificationRule to fetch.
     */
    where: NotificationRuleWhereUniqueInput
  }

  /**
   * NotificationRule findUniqueOrThrow
   */
  export type NotificationRuleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRule
     */
    select?: NotificationRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRule
     */
    omit?: NotificationRuleOmit<ExtArgs> | null
    /**
     * Filter, which NotificationRule to fetch.
     */
    where: NotificationRuleWhereUniqueInput
  }

  /**
   * NotificationRule findFirst
   */
  export type NotificationRuleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRule
     */
    select?: NotificationRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRule
     */
    omit?: NotificationRuleOmit<ExtArgs> | null
    /**
     * Filter, which NotificationRule to fetch.
     */
    where?: NotificationRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationRules to fetch.
     */
    orderBy?: NotificationRuleOrderByWithRelationInput | NotificationRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NotificationRules.
     */
    cursor?: NotificationRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NotificationRules.
     */
    distinct?: NotificationRuleScalarFieldEnum | NotificationRuleScalarFieldEnum[]
  }

  /**
   * NotificationRule findFirstOrThrow
   */
  export type NotificationRuleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRule
     */
    select?: NotificationRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRule
     */
    omit?: NotificationRuleOmit<ExtArgs> | null
    /**
     * Filter, which NotificationRule to fetch.
     */
    where?: NotificationRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationRules to fetch.
     */
    orderBy?: NotificationRuleOrderByWithRelationInput | NotificationRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NotificationRules.
     */
    cursor?: NotificationRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NotificationRules.
     */
    distinct?: NotificationRuleScalarFieldEnum | NotificationRuleScalarFieldEnum[]
  }

  /**
   * NotificationRule findMany
   */
  export type NotificationRuleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRule
     */
    select?: NotificationRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRule
     */
    omit?: NotificationRuleOmit<ExtArgs> | null
    /**
     * Filter, which NotificationRules to fetch.
     */
    where?: NotificationRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationRules to fetch.
     */
    orderBy?: NotificationRuleOrderByWithRelationInput | NotificationRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NotificationRules.
     */
    cursor?: NotificationRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationRules.
     */
    skip?: number
    distinct?: NotificationRuleScalarFieldEnum | NotificationRuleScalarFieldEnum[]
  }

  /**
   * NotificationRule create
   */
  export type NotificationRuleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRule
     */
    select?: NotificationRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRule
     */
    omit?: NotificationRuleOmit<ExtArgs> | null
    /**
     * The data needed to create a NotificationRule.
     */
    data: XOR<NotificationRuleCreateInput, NotificationRuleUncheckedCreateInput>
  }

  /**
   * NotificationRule createMany
   */
  export type NotificationRuleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NotificationRules.
     */
    data: NotificationRuleCreateManyInput | NotificationRuleCreateManyInput[]
  }

  /**
   * NotificationRule createManyAndReturn
   */
  export type NotificationRuleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRule
     */
    select?: NotificationRuleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRule
     */
    omit?: NotificationRuleOmit<ExtArgs> | null
    /**
     * The data used to create many NotificationRules.
     */
    data: NotificationRuleCreateManyInput | NotificationRuleCreateManyInput[]
  }

  /**
   * NotificationRule update
   */
  export type NotificationRuleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRule
     */
    select?: NotificationRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRule
     */
    omit?: NotificationRuleOmit<ExtArgs> | null
    /**
     * The data needed to update a NotificationRule.
     */
    data: XOR<NotificationRuleUpdateInput, NotificationRuleUncheckedUpdateInput>
    /**
     * Choose, which NotificationRule to update.
     */
    where: NotificationRuleWhereUniqueInput
  }

  /**
   * NotificationRule updateMany
   */
  export type NotificationRuleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NotificationRules.
     */
    data: XOR<NotificationRuleUpdateManyMutationInput, NotificationRuleUncheckedUpdateManyInput>
    /**
     * Filter which NotificationRules to update
     */
    where?: NotificationRuleWhereInput
    /**
     * Limit how many NotificationRules to update.
     */
    limit?: number
  }

  /**
   * NotificationRule updateManyAndReturn
   */
  export type NotificationRuleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRule
     */
    select?: NotificationRuleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRule
     */
    omit?: NotificationRuleOmit<ExtArgs> | null
    /**
     * The data used to update NotificationRules.
     */
    data: XOR<NotificationRuleUpdateManyMutationInput, NotificationRuleUncheckedUpdateManyInput>
    /**
     * Filter which NotificationRules to update
     */
    where?: NotificationRuleWhereInput
    /**
     * Limit how many NotificationRules to update.
     */
    limit?: number
  }

  /**
   * NotificationRule upsert
   */
  export type NotificationRuleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRule
     */
    select?: NotificationRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRule
     */
    omit?: NotificationRuleOmit<ExtArgs> | null
    /**
     * The filter to search for the NotificationRule to update in case it exists.
     */
    where: NotificationRuleWhereUniqueInput
    /**
     * In case the NotificationRule found by the `where` argument doesn't exist, create a new NotificationRule with this data.
     */
    create: XOR<NotificationRuleCreateInput, NotificationRuleUncheckedCreateInput>
    /**
     * In case the NotificationRule was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationRuleUpdateInput, NotificationRuleUncheckedUpdateInput>
  }

  /**
   * NotificationRule delete
   */
  export type NotificationRuleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRule
     */
    select?: NotificationRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRule
     */
    omit?: NotificationRuleOmit<ExtArgs> | null
    /**
     * Filter which NotificationRule to delete.
     */
    where: NotificationRuleWhereUniqueInput
  }

  /**
   * NotificationRule deleteMany
   */
  export type NotificationRuleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NotificationRules to delete
     */
    where?: NotificationRuleWhereInput
    /**
     * Limit how many NotificationRules to delete.
     */
    limit?: number
  }

  /**
   * NotificationRule without action
   */
  export type NotificationRuleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRule
     */
    select?: NotificationRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRule
     */
    omit?: NotificationRuleOmit<ExtArgs> | null
  }


  /**
   * Model SystemConfig
   */

  export type AggregateSystemConfig = {
    _count: SystemConfigCountAggregateOutputType | null
    _min: SystemConfigMinAggregateOutputType | null
    _max: SystemConfigMaxAggregateOutputType | null
  }

  export type SystemConfigMinAggregateOutputType = {
    id: string | null
    key: string | null
    value: string | null
    updatedAt: Date | null
  }

  export type SystemConfigMaxAggregateOutputType = {
    id: string | null
    key: string | null
    value: string | null
    updatedAt: Date | null
  }

  export type SystemConfigCountAggregateOutputType = {
    id: number
    key: number
    value: number
    updatedAt: number
    _all: number
  }


  export type SystemConfigMinAggregateInputType = {
    id?: true
    key?: true
    value?: true
    updatedAt?: true
  }

  export type SystemConfigMaxAggregateInputType = {
    id?: true
    key?: true
    value?: true
    updatedAt?: true
  }

  export type SystemConfigCountAggregateInputType = {
    id?: true
    key?: true
    value?: true
    updatedAt?: true
    _all?: true
  }

  export type SystemConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SystemConfig to aggregate.
     */
    where?: SystemConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemConfigs to fetch.
     */
    orderBy?: SystemConfigOrderByWithRelationInput | SystemConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SystemConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SystemConfigs
    **/
    _count?: true | SystemConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SystemConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SystemConfigMaxAggregateInputType
  }

  export type GetSystemConfigAggregateType<T extends SystemConfigAggregateArgs> = {
        [P in keyof T & keyof AggregateSystemConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSystemConfig[P]>
      : GetScalarType<T[P], AggregateSystemConfig[P]>
  }




  export type SystemConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SystemConfigWhereInput
    orderBy?: SystemConfigOrderByWithAggregationInput | SystemConfigOrderByWithAggregationInput[]
    by: SystemConfigScalarFieldEnum[] | SystemConfigScalarFieldEnum
    having?: SystemConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SystemConfigCountAggregateInputType | true
    _min?: SystemConfigMinAggregateInputType
    _max?: SystemConfigMaxAggregateInputType
  }

  export type SystemConfigGroupByOutputType = {
    id: string
    key: string
    value: string
    updatedAt: Date
    _count: SystemConfigCountAggregateOutputType | null
    _min: SystemConfigMinAggregateOutputType | null
    _max: SystemConfigMaxAggregateOutputType | null
  }

  type GetSystemConfigGroupByPayload<T extends SystemConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SystemConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SystemConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SystemConfigGroupByOutputType[P]>
            : GetScalarType<T[P], SystemConfigGroupByOutputType[P]>
        }
      >
    >


  export type SystemConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    value?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["systemConfig"]>

  export type SystemConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    value?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["systemConfig"]>

  export type SystemConfigSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    value?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["systemConfig"]>

  export type SystemConfigSelectScalar = {
    id?: boolean
    key?: boolean
    value?: boolean
    updatedAt?: boolean
  }

  export type SystemConfigOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "key" | "value" | "updatedAt", ExtArgs["result"]["systemConfig"]>

  export type $SystemConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SystemConfig"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      key: string
      value: string
      updatedAt: Date
    }, ExtArgs["result"]["systemConfig"]>
    composites: {}
  }

  type SystemConfigGetPayload<S extends boolean | null | undefined | SystemConfigDefaultArgs> = $Result.GetResult<Prisma.$SystemConfigPayload, S>

  type SystemConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SystemConfigFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SystemConfigCountAggregateInputType | true
    }

  export interface SystemConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SystemConfig'], meta: { name: 'SystemConfig' } }
    /**
     * Find zero or one SystemConfig that matches the filter.
     * @param {SystemConfigFindUniqueArgs} args - Arguments to find a SystemConfig
     * @example
     * // Get one SystemConfig
     * const systemConfig = await prisma.systemConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SystemConfigFindUniqueArgs>(args: SelectSubset<T, SystemConfigFindUniqueArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SystemConfig that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SystemConfigFindUniqueOrThrowArgs} args - Arguments to find a SystemConfig
     * @example
     * // Get one SystemConfig
     * const systemConfig = await prisma.systemConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SystemConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, SystemConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SystemConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigFindFirstArgs} args - Arguments to find a SystemConfig
     * @example
     * // Get one SystemConfig
     * const systemConfig = await prisma.systemConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SystemConfigFindFirstArgs>(args?: SelectSubset<T, SystemConfigFindFirstArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SystemConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigFindFirstOrThrowArgs} args - Arguments to find a SystemConfig
     * @example
     * // Get one SystemConfig
     * const systemConfig = await prisma.systemConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SystemConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, SystemConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SystemConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SystemConfigs
     * const systemConfigs = await prisma.systemConfig.findMany()
     * 
     * // Get first 10 SystemConfigs
     * const systemConfigs = await prisma.systemConfig.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const systemConfigWithIdOnly = await prisma.systemConfig.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SystemConfigFindManyArgs>(args?: SelectSubset<T, SystemConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SystemConfig.
     * @param {SystemConfigCreateArgs} args - Arguments to create a SystemConfig.
     * @example
     * // Create one SystemConfig
     * const SystemConfig = await prisma.systemConfig.create({
     *   data: {
     *     // ... data to create a SystemConfig
     *   }
     * })
     * 
     */
    create<T extends SystemConfigCreateArgs>(args: SelectSubset<T, SystemConfigCreateArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SystemConfigs.
     * @param {SystemConfigCreateManyArgs} args - Arguments to create many SystemConfigs.
     * @example
     * // Create many SystemConfigs
     * const systemConfig = await prisma.systemConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SystemConfigCreateManyArgs>(args?: SelectSubset<T, SystemConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SystemConfigs and returns the data saved in the database.
     * @param {SystemConfigCreateManyAndReturnArgs} args - Arguments to create many SystemConfigs.
     * @example
     * // Create many SystemConfigs
     * const systemConfig = await prisma.systemConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SystemConfigs and only return the `id`
     * const systemConfigWithIdOnly = await prisma.systemConfig.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SystemConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, SystemConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SystemConfig.
     * @param {SystemConfigDeleteArgs} args - Arguments to delete one SystemConfig.
     * @example
     * // Delete one SystemConfig
     * const SystemConfig = await prisma.systemConfig.delete({
     *   where: {
     *     // ... filter to delete one SystemConfig
     *   }
     * })
     * 
     */
    delete<T extends SystemConfigDeleteArgs>(args: SelectSubset<T, SystemConfigDeleteArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SystemConfig.
     * @param {SystemConfigUpdateArgs} args - Arguments to update one SystemConfig.
     * @example
     * // Update one SystemConfig
     * const systemConfig = await prisma.systemConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SystemConfigUpdateArgs>(args: SelectSubset<T, SystemConfigUpdateArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SystemConfigs.
     * @param {SystemConfigDeleteManyArgs} args - Arguments to filter SystemConfigs to delete.
     * @example
     * // Delete a few SystemConfigs
     * const { count } = await prisma.systemConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SystemConfigDeleteManyArgs>(args?: SelectSubset<T, SystemConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SystemConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SystemConfigs
     * const systemConfig = await prisma.systemConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SystemConfigUpdateManyArgs>(args: SelectSubset<T, SystemConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SystemConfigs and returns the data updated in the database.
     * @param {SystemConfigUpdateManyAndReturnArgs} args - Arguments to update many SystemConfigs.
     * @example
     * // Update many SystemConfigs
     * const systemConfig = await prisma.systemConfig.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SystemConfigs and only return the `id`
     * const systemConfigWithIdOnly = await prisma.systemConfig.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SystemConfigUpdateManyAndReturnArgs>(args: SelectSubset<T, SystemConfigUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SystemConfig.
     * @param {SystemConfigUpsertArgs} args - Arguments to update or create a SystemConfig.
     * @example
     * // Update or create a SystemConfig
     * const systemConfig = await prisma.systemConfig.upsert({
     *   create: {
     *     // ... data to create a SystemConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SystemConfig we want to update
     *   }
     * })
     */
    upsert<T extends SystemConfigUpsertArgs>(args: SelectSubset<T, SystemConfigUpsertArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SystemConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigCountArgs} args - Arguments to filter SystemConfigs to count.
     * @example
     * // Count the number of SystemConfigs
     * const count = await prisma.systemConfig.count({
     *   where: {
     *     // ... the filter for the SystemConfigs we want to count
     *   }
     * })
    **/
    count<T extends SystemConfigCountArgs>(
      args?: Subset<T, SystemConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SystemConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SystemConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SystemConfigAggregateArgs>(args: Subset<T, SystemConfigAggregateArgs>): Prisma.PrismaPromise<GetSystemConfigAggregateType<T>>

    /**
     * Group by SystemConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SystemConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SystemConfigGroupByArgs['orderBy'] }
        : { orderBy?: SystemConfigGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SystemConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSystemConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SystemConfig model
   */
  readonly fields: SystemConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SystemConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SystemConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SystemConfig model
   */
  interface SystemConfigFieldRefs {
    readonly id: FieldRef<"SystemConfig", 'String'>
    readonly key: FieldRef<"SystemConfig", 'String'>
    readonly value: FieldRef<"SystemConfig", 'String'>
    readonly updatedAt: FieldRef<"SystemConfig", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SystemConfig findUnique
   */
  export type SystemConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Filter, which SystemConfig to fetch.
     */
    where: SystemConfigWhereUniqueInput
  }

  /**
   * SystemConfig findUniqueOrThrow
   */
  export type SystemConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Filter, which SystemConfig to fetch.
     */
    where: SystemConfigWhereUniqueInput
  }

  /**
   * SystemConfig findFirst
   */
  export type SystemConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Filter, which SystemConfig to fetch.
     */
    where?: SystemConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemConfigs to fetch.
     */
    orderBy?: SystemConfigOrderByWithRelationInput | SystemConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SystemConfigs.
     */
    cursor?: SystemConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemConfigs.
     */
    distinct?: SystemConfigScalarFieldEnum | SystemConfigScalarFieldEnum[]
  }

  /**
   * SystemConfig findFirstOrThrow
   */
  export type SystemConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Filter, which SystemConfig to fetch.
     */
    where?: SystemConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemConfigs to fetch.
     */
    orderBy?: SystemConfigOrderByWithRelationInput | SystemConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SystemConfigs.
     */
    cursor?: SystemConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemConfigs.
     */
    distinct?: SystemConfigScalarFieldEnum | SystemConfigScalarFieldEnum[]
  }

  /**
   * SystemConfig findMany
   */
  export type SystemConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Filter, which SystemConfigs to fetch.
     */
    where?: SystemConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemConfigs to fetch.
     */
    orderBy?: SystemConfigOrderByWithRelationInput | SystemConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SystemConfigs.
     */
    cursor?: SystemConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemConfigs.
     */
    skip?: number
    distinct?: SystemConfigScalarFieldEnum | SystemConfigScalarFieldEnum[]
  }

  /**
   * SystemConfig create
   */
  export type SystemConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * The data needed to create a SystemConfig.
     */
    data: XOR<SystemConfigCreateInput, SystemConfigUncheckedCreateInput>
  }

  /**
   * SystemConfig createMany
   */
  export type SystemConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SystemConfigs.
     */
    data: SystemConfigCreateManyInput | SystemConfigCreateManyInput[]
  }

  /**
   * SystemConfig createManyAndReturn
   */
  export type SystemConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * The data used to create many SystemConfigs.
     */
    data: SystemConfigCreateManyInput | SystemConfigCreateManyInput[]
  }

  /**
   * SystemConfig update
   */
  export type SystemConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * The data needed to update a SystemConfig.
     */
    data: XOR<SystemConfigUpdateInput, SystemConfigUncheckedUpdateInput>
    /**
     * Choose, which SystemConfig to update.
     */
    where: SystemConfigWhereUniqueInput
  }

  /**
   * SystemConfig updateMany
   */
  export type SystemConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SystemConfigs.
     */
    data: XOR<SystemConfigUpdateManyMutationInput, SystemConfigUncheckedUpdateManyInput>
    /**
     * Filter which SystemConfigs to update
     */
    where?: SystemConfigWhereInput
    /**
     * Limit how many SystemConfigs to update.
     */
    limit?: number
  }

  /**
   * SystemConfig updateManyAndReturn
   */
  export type SystemConfigUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * The data used to update SystemConfigs.
     */
    data: XOR<SystemConfigUpdateManyMutationInput, SystemConfigUncheckedUpdateManyInput>
    /**
     * Filter which SystemConfigs to update
     */
    where?: SystemConfigWhereInput
    /**
     * Limit how many SystemConfigs to update.
     */
    limit?: number
  }

  /**
   * SystemConfig upsert
   */
  export type SystemConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * The filter to search for the SystemConfig to update in case it exists.
     */
    where: SystemConfigWhereUniqueInput
    /**
     * In case the SystemConfig found by the `where` argument doesn't exist, create a new SystemConfig with this data.
     */
    create: XOR<SystemConfigCreateInput, SystemConfigUncheckedCreateInput>
    /**
     * In case the SystemConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SystemConfigUpdateInput, SystemConfigUncheckedUpdateInput>
  }

  /**
   * SystemConfig delete
   */
  export type SystemConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Filter which SystemConfig to delete.
     */
    where: SystemConfigWhereUniqueInput
  }

  /**
   * SystemConfig deleteMany
   */
  export type SystemConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SystemConfigs to delete
     */
    where?: SystemConfigWhereInput
    /**
     * Limit how many SystemConfigs to delete.
     */
    limit?: number
  }

  /**
   * SystemConfig without action
   */
  export type SystemConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
  }


  /**
   * Model AdminSettings
   */

  export type AggregateAdminSettings = {
    _count: AdminSettingsCountAggregateOutputType | null
    _avg: AdminSettingsAvgAggregateOutputType | null
    _sum: AdminSettingsSumAggregateOutputType | null
    _min: AdminSettingsMinAggregateOutputType | null
    _max: AdminSettingsMaxAggregateOutputType | null
  }

  export type AdminSettingsAvgAggregateOutputType = {
    weeklyReportDay: number | null
    reminderDaysBefore: number | null
  }

  export type AdminSettingsSumAggregateOutputType = {
    weeklyReportDay: number | null
    reminderDaysBefore: number | null
  }

  export type AdminSettingsMinAggregateOutputType = {
    id: string | null
    adminEmail: string | null
    dailyDigestEnabled: boolean | null
    dailyDigestTime: string | null
    weeklyReportEnabled: boolean | null
    weeklyReportDay: number | null
    weeklyReportTime: string | null
    inProgressReportEnabled: boolean | null
    inProgressReportFrequency: string | null
    taskReminderEnabled: boolean | null
    overdueReminderEnabled: boolean | null
    customReminderDates: string | null
    reminderDaysBefore: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AdminSettingsMaxAggregateOutputType = {
    id: string | null
    adminEmail: string | null
    dailyDigestEnabled: boolean | null
    dailyDigestTime: string | null
    weeklyReportEnabled: boolean | null
    weeklyReportDay: number | null
    weeklyReportTime: string | null
    inProgressReportEnabled: boolean | null
    inProgressReportFrequency: string | null
    taskReminderEnabled: boolean | null
    overdueReminderEnabled: boolean | null
    customReminderDates: string | null
    reminderDaysBefore: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AdminSettingsCountAggregateOutputType = {
    id: number
    adminEmail: number
    dailyDigestEnabled: number
    dailyDigestTime: number
    weeklyReportEnabled: number
    weeklyReportDay: number
    weeklyReportTime: number
    inProgressReportEnabled: number
    inProgressReportFrequency: number
    taskReminderEnabled: number
    overdueReminderEnabled: number
    customReminderDates: number
    reminderDaysBefore: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AdminSettingsAvgAggregateInputType = {
    weeklyReportDay?: true
    reminderDaysBefore?: true
  }

  export type AdminSettingsSumAggregateInputType = {
    weeklyReportDay?: true
    reminderDaysBefore?: true
  }

  export type AdminSettingsMinAggregateInputType = {
    id?: true
    adminEmail?: true
    dailyDigestEnabled?: true
    dailyDigestTime?: true
    weeklyReportEnabled?: true
    weeklyReportDay?: true
    weeklyReportTime?: true
    inProgressReportEnabled?: true
    inProgressReportFrequency?: true
    taskReminderEnabled?: true
    overdueReminderEnabled?: true
    customReminderDates?: true
    reminderDaysBefore?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AdminSettingsMaxAggregateInputType = {
    id?: true
    adminEmail?: true
    dailyDigestEnabled?: true
    dailyDigestTime?: true
    weeklyReportEnabled?: true
    weeklyReportDay?: true
    weeklyReportTime?: true
    inProgressReportEnabled?: true
    inProgressReportFrequency?: true
    taskReminderEnabled?: true
    overdueReminderEnabled?: true
    customReminderDates?: true
    reminderDaysBefore?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AdminSettingsCountAggregateInputType = {
    id?: true
    adminEmail?: true
    dailyDigestEnabled?: true
    dailyDigestTime?: true
    weeklyReportEnabled?: true
    weeklyReportDay?: true
    weeklyReportTime?: true
    inProgressReportEnabled?: true
    inProgressReportFrequency?: true
    taskReminderEnabled?: true
    overdueReminderEnabled?: true
    customReminderDates?: true
    reminderDaysBefore?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AdminSettingsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdminSettings to aggregate.
     */
    where?: AdminSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminSettings to fetch.
     */
    orderBy?: AdminSettingsOrderByWithRelationInput | AdminSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AdminSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AdminSettings
    **/
    _count?: true | AdminSettingsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AdminSettingsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AdminSettingsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AdminSettingsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AdminSettingsMaxAggregateInputType
  }

  export type GetAdminSettingsAggregateType<T extends AdminSettingsAggregateArgs> = {
        [P in keyof T & keyof AggregateAdminSettings]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAdminSettings[P]>
      : GetScalarType<T[P], AggregateAdminSettings[P]>
  }




  export type AdminSettingsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AdminSettingsWhereInput
    orderBy?: AdminSettingsOrderByWithAggregationInput | AdminSettingsOrderByWithAggregationInput[]
    by: AdminSettingsScalarFieldEnum[] | AdminSettingsScalarFieldEnum
    having?: AdminSettingsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AdminSettingsCountAggregateInputType | true
    _avg?: AdminSettingsAvgAggregateInputType
    _sum?: AdminSettingsSumAggregateInputType
    _min?: AdminSettingsMinAggregateInputType
    _max?: AdminSettingsMaxAggregateInputType
  }

  export type AdminSettingsGroupByOutputType = {
    id: string
    adminEmail: string
    dailyDigestEnabled: boolean
    dailyDigestTime: string
    weeklyReportEnabled: boolean
    weeklyReportDay: number
    weeklyReportTime: string
    inProgressReportEnabled: boolean
    inProgressReportFrequency: string
    taskReminderEnabled: boolean
    overdueReminderEnabled: boolean
    customReminderDates: string | null
    reminderDaysBefore: number
    createdAt: Date
    updatedAt: Date
    _count: AdminSettingsCountAggregateOutputType | null
    _avg: AdminSettingsAvgAggregateOutputType | null
    _sum: AdminSettingsSumAggregateOutputType | null
    _min: AdminSettingsMinAggregateOutputType | null
    _max: AdminSettingsMaxAggregateOutputType | null
  }

  type GetAdminSettingsGroupByPayload<T extends AdminSettingsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AdminSettingsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AdminSettingsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AdminSettingsGroupByOutputType[P]>
            : GetScalarType<T[P], AdminSettingsGroupByOutputType[P]>
        }
      >
    >


  export type AdminSettingsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    adminEmail?: boolean
    dailyDigestEnabled?: boolean
    dailyDigestTime?: boolean
    weeklyReportEnabled?: boolean
    weeklyReportDay?: boolean
    weeklyReportTime?: boolean
    inProgressReportEnabled?: boolean
    inProgressReportFrequency?: boolean
    taskReminderEnabled?: boolean
    overdueReminderEnabled?: boolean
    customReminderDates?: boolean
    reminderDaysBefore?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["adminSettings"]>

  export type AdminSettingsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    adminEmail?: boolean
    dailyDigestEnabled?: boolean
    dailyDigestTime?: boolean
    weeklyReportEnabled?: boolean
    weeklyReportDay?: boolean
    weeklyReportTime?: boolean
    inProgressReportEnabled?: boolean
    inProgressReportFrequency?: boolean
    taskReminderEnabled?: boolean
    overdueReminderEnabled?: boolean
    customReminderDates?: boolean
    reminderDaysBefore?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["adminSettings"]>

  export type AdminSettingsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    adminEmail?: boolean
    dailyDigestEnabled?: boolean
    dailyDigestTime?: boolean
    weeklyReportEnabled?: boolean
    weeklyReportDay?: boolean
    weeklyReportTime?: boolean
    inProgressReportEnabled?: boolean
    inProgressReportFrequency?: boolean
    taskReminderEnabled?: boolean
    overdueReminderEnabled?: boolean
    customReminderDates?: boolean
    reminderDaysBefore?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["adminSettings"]>

  export type AdminSettingsSelectScalar = {
    id?: boolean
    adminEmail?: boolean
    dailyDigestEnabled?: boolean
    dailyDigestTime?: boolean
    weeklyReportEnabled?: boolean
    weeklyReportDay?: boolean
    weeklyReportTime?: boolean
    inProgressReportEnabled?: boolean
    inProgressReportFrequency?: boolean
    taskReminderEnabled?: boolean
    overdueReminderEnabled?: boolean
    customReminderDates?: boolean
    reminderDaysBefore?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AdminSettingsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "adminEmail" | "dailyDigestEnabled" | "dailyDigestTime" | "weeklyReportEnabled" | "weeklyReportDay" | "weeklyReportTime" | "inProgressReportEnabled" | "inProgressReportFrequency" | "taskReminderEnabled" | "overdueReminderEnabled" | "customReminderDates" | "reminderDaysBefore" | "createdAt" | "updatedAt", ExtArgs["result"]["adminSettings"]>

  export type $AdminSettingsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AdminSettings"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      adminEmail: string
      dailyDigestEnabled: boolean
      dailyDigestTime: string
      weeklyReportEnabled: boolean
      weeklyReportDay: number
      weeklyReportTime: string
      inProgressReportEnabled: boolean
      inProgressReportFrequency: string
      taskReminderEnabled: boolean
      overdueReminderEnabled: boolean
      customReminderDates: string | null
      reminderDaysBefore: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["adminSettings"]>
    composites: {}
  }

  type AdminSettingsGetPayload<S extends boolean | null | undefined | AdminSettingsDefaultArgs> = $Result.GetResult<Prisma.$AdminSettingsPayload, S>

  type AdminSettingsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AdminSettingsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AdminSettingsCountAggregateInputType | true
    }

  export interface AdminSettingsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AdminSettings'], meta: { name: 'AdminSettings' } }
    /**
     * Find zero or one AdminSettings that matches the filter.
     * @param {AdminSettingsFindUniqueArgs} args - Arguments to find a AdminSettings
     * @example
     * // Get one AdminSettings
     * const adminSettings = await prisma.adminSettings.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AdminSettingsFindUniqueArgs>(args: SelectSubset<T, AdminSettingsFindUniqueArgs<ExtArgs>>): Prisma__AdminSettingsClient<$Result.GetResult<Prisma.$AdminSettingsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AdminSettings that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AdminSettingsFindUniqueOrThrowArgs} args - Arguments to find a AdminSettings
     * @example
     * // Get one AdminSettings
     * const adminSettings = await prisma.adminSettings.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AdminSettingsFindUniqueOrThrowArgs>(args: SelectSubset<T, AdminSettingsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AdminSettingsClient<$Result.GetResult<Prisma.$AdminSettingsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AdminSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminSettingsFindFirstArgs} args - Arguments to find a AdminSettings
     * @example
     * // Get one AdminSettings
     * const adminSettings = await prisma.adminSettings.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AdminSettingsFindFirstArgs>(args?: SelectSubset<T, AdminSettingsFindFirstArgs<ExtArgs>>): Prisma__AdminSettingsClient<$Result.GetResult<Prisma.$AdminSettingsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AdminSettings that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminSettingsFindFirstOrThrowArgs} args - Arguments to find a AdminSettings
     * @example
     * // Get one AdminSettings
     * const adminSettings = await prisma.adminSettings.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AdminSettingsFindFirstOrThrowArgs>(args?: SelectSubset<T, AdminSettingsFindFirstOrThrowArgs<ExtArgs>>): Prisma__AdminSettingsClient<$Result.GetResult<Prisma.$AdminSettingsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AdminSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminSettingsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AdminSettings
     * const adminSettings = await prisma.adminSettings.findMany()
     * 
     * // Get first 10 AdminSettings
     * const adminSettings = await prisma.adminSettings.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const adminSettingsWithIdOnly = await prisma.adminSettings.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AdminSettingsFindManyArgs>(args?: SelectSubset<T, AdminSettingsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminSettingsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AdminSettings.
     * @param {AdminSettingsCreateArgs} args - Arguments to create a AdminSettings.
     * @example
     * // Create one AdminSettings
     * const AdminSettings = await prisma.adminSettings.create({
     *   data: {
     *     // ... data to create a AdminSettings
     *   }
     * })
     * 
     */
    create<T extends AdminSettingsCreateArgs>(args: SelectSubset<T, AdminSettingsCreateArgs<ExtArgs>>): Prisma__AdminSettingsClient<$Result.GetResult<Prisma.$AdminSettingsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AdminSettings.
     * @param {AdminSettingsCreateManyArgs} args - Arguments to create many AdminSettings.
     * @example
     * // Create many AdminSettings
     * const adminSettings = await prisma.adminSettings.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AdminSettingsCreateManyArgs>(args?: SelectSubset<T, AdminSettingsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AdminSettings and returns the data saved in the database.
     * @param {AdminSettingsCreateManyAndReturnArgs} args - Arguments to create many AdminSettings.
     * @example
     * // Create many AdminSettings
     * const adminSettings = await prisma.adminSettings.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AdminSettings and only return the `id`
     * const adminSettingsWithIdOnly = await prisma.adminSettings.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AdminSettingsCreateManyAndReturnArgs>(args?: SelectSubset<T, AdminSettingsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminSettingsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AdminSettings.
     * @param {AdminSettingsDeleteArgs} args - Arguments to delete one AdminSettings.
     * @example
     * // Delete one AdminSettings
     * const AdminSettings = await prisma.adminSettings.delete({
     *   where: {
     *     // ... filter to delete one AdminSettings
     *   }
     * })
     * 
     */
    delete<T extends AdminSettingsDeleteArgs>(args: SelectSubset<T, AdminSettingsDeleteArgs<ExtArgs>>): Prisma__AdminSettingsClient<$Result.GetResult<Prisma.$AdminSettingsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AdminSettings.
     * @param {AdminSettingsUpdateArgs} args - Arguments to update one AdminSettings.
     * @example
     * // Update one AdminSettings
     * const adminSettings = await prisma.adminSettings.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AdminSettingsUpdateArgs>(args: SelectSubset<T, AdminSettingsUpdateArgs<ExtArgs>>): Prisma__AdminSettingsClient<$Result.GetResult<Prisma.$AdminSettingsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AdminSettings.
     * @param {AdminSettingsDeleteManyArgs} args - Arguments to filter AdminSettings to delete.
     * @example
     * // Delete a few AdminSettings
     * const { count } = await prisma.adminSettings.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AdminSettingsDeleteManyArgs>(args?: SelectSubset<T, AdminSettingsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AdminSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminSettingsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AdminSettings
     * const adminSettings = await prisma.adminSettings.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AdminSettingsUpdateManyArgs>(args: SelectSubset<T, AdminSettingsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AdminSettings and returns the data updated in the database.
     * @param {AdminSettingsUpdateManyAndReturnArgs} args - Arguments to update many AdminSettings.
     * @example
     * // Update many AdminSettings
     * const adminSettings = await prisma.adminSettings.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AdminSettings and only return the `id`
     * const adminSettingsWithIdOnly = await prisma.adminSettings.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AdminSettingsUpdateManyAndReturnArgs>(args: SelectSubset<T, AdminSettingsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminSettingsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AdminSettings.
     * @param {AdminSettingsUpsertArgs} args - Arguments to update or create a AdminSettings.
     * @example
     * // Update or create a AdminSettings
     * const adminSettings = await prisma.adminSettings.upsert({
     *   create: {
     *     // ... data to create a AdminSettings
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AdminSettings we want to update
     *   }
     * })
     */
    upsert<T extends AdminSettingsUpsertArgs>(args: SelectSubset<T, AdminSettingsUpsertArgs<ExtArgs>>): Prisma__AdminSettingsClient<$Result.GetResult<Prisma.$AdminSettingsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AdminSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminSettingsCountArgs} args - Arguments to filter AdminSettings to count.
     * @example
     * // Count the number of AdminSettings
     * const count = await prisma.adminSettings.count({
     *   where: {
     *     // ... the filter for the AdminSettings we want to count
     *   }
     * })
    **/
    count<T extends AdminSettingsCountArgs>(
      args?: Subset<T, AdminSettingsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AdminSettingsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AdminSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminSettingsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AdminSettingsAggregateArgs>(args: Subset<T, AdminSettingsAggregateArgs>): Prisma.PrismaPromise<GetAdminSettingsAggregateType<T>>

    /**
     * Group by AdminSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminSettingsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AdminSettingsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AdminSettingsGroupByArgs['orderBy'] }
        : { orderBy?: AdminSettingsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AdminSettingsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdminSettingsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AdminSettings model
   */
  readonly fields: AdminSettingsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AdminSettings.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AdminSettingsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AdminSettings model
   */
  interface AdminSettingsFieldRefs {
    readonly id: FieldRef<"AdminSettings", 'String'>
    readonly adminEmail: FieldRef<"AdminSettings", 'String'>
    readonly dailyDigestEnabled: FieldRef<"AdminSettings", 'Boolean'>
    readonly dailyDigestTime: FieldRef<"AdminSettings", 'String'>
    readonly weeklyReportEnabled: FieldRef<"AdminSettings", 'Boolean'>
    readonly weeklyReportDay: FieldRef<"AdminSettings", 'Int'>
    readonly weeklyReportTime: FieldRef<"AdminSettings", 'String'>
    readonly inProgressReportEnabled: FieldRef<"AdminSettings", 'Boolean'>
    readonly inProgressReportFrequency: FieldRef<"AdminSettings", 'String'>
    readonly taskReminderEnabled: FieldRef<"AdminSettings", 'Boolean'>
    readonly overdueReminderEnabled: FieldRef<"AdminSettings", 'Boolean'>
    readonly customReminderDates: FieldRef<"AdminSettings", 'String'>
    readonly reminderDaysBefore: FieldRef<"AdminSettings", 'Int'>
    readonly createdAt: FieldRef<"AdminSettings", 'DateTime'>
    readonly updatedAt: FieldRef<"AdminSettings", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AdminSettings findUnique
   */
  export type AdminSettingsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminSettings
     */
    select?: AdminSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminSettings
     */
    omit?: AdminSettingsOmit<ExtArgs> | null
    /**
     * Filter, which AdminSettings to fetch.
     */
    where: AdminSettingsWhereUniqueInput
  }

  /**
   * AdminSettings findUniqueOrThrow
   */
  export type AdminSettingsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminSettings
     */
    select?: AdminSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminSettings
     */
    omit?: AdminSettingsOmit<ExtArgs> | null
    /**
     * Filter, which AdminSettings to fetch.
     */
    where: AdminSettingsWhereUniqueInput
  }

  /**
   * AdminSettings findFirst
   */
  export type AdminSettingsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminSettings
     */
    select?: AdminSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminSettings
     */
    omit?: AdminSettingsOmit<ExtArgs> | null
    /**
     * Filter, which AdminSettings to fetch.
     */
    where?: AdminSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminSettings to fetch.
     */
    orderBy?: AdminSettingsOrderByWithRelationInput | AdminSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdminSettings.
     */
    cursor?: AdminSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdminSettings.
     */
    distinct?: AdminSettingsScalarFieldEnum | AdminSettingsScalarFieldEnum[]
  }

  /**
   * AdminSettings findFirstOrThrow
   */
  export type AdminSettingsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminSettings
     */
    select?: AdminSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminSettings
     */
    omit?: AdminSettingsOmit<ExtArgs> | null
    /**
     * Filter, which AdminSettings to fetch.
     */
    where?: AdminSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminSettings to fetch.
     */
    orderBy?: AdminSettingsOrderByWithRelationInput | AdminSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdminSettings.
     */
    cursor?: AdminSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdminSettings.
     */
    distinct?: AdminSettingsScalarFieldEnum | AdminSettingsScalarFieldEnum[]
  }

  /**
   * AdminSettings findMany
   */
  export type AdminSettingsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminSettings
     */
    select?: AdminSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminSettings
     */
    omit?: AdminSettingsOmit<ExtArgs> | null
    /**
     * Filter, which AdminSettings to fetch.
     */
    where?: AdminSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminSettings to fetch.
     */
    orderBy?: AdminSettingsOrderByWithRelationInput | AdminSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AdminSettings.
     */
    cursor?: AdminSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminSettings.
     */
    skip?: number
    distinct?: AdminSettingsScalarFieldEnum | AdminSettingsScalarFieldEnum[]
  }

  /**
   * AdminSettings create
   */
  export type AdminSettingsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminSettings
     */
    select?: AdminSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminSettings
     */
    omit?: AdminSettingsOmit<ExtArgs> | null
    /**
     * The data needed to create a AdminSettings.
     */
    data: XOR<AdminSettingsCreateInput, AdminSettingsUncheckedCreateInput>
  }

  /**
   * AdminSettings createMany
   */
  export type AdminSettingsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AdminSettings.
     */
    data: AdminSettingsCreateManyInput | AdminSettingsCreateManyInput[]
  }

  /**
   * AdminSettings createManyAndReturn
   */
  export type AdminSettingsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminSettings
     */
    select?: AdminSettingsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AdminSettings
     */
    omit?: AdminSettingsOmit<ExtArgs> | null
    /**
     * The data used to create many AdminSettings.
     */
    data: AdminSettingsCreateManyInput | AdminSettingsCreateManyInput[]
  }

  /**
   * AdminSettings update
   */
  export type AdminSettingsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminSettings
     */
    select?: AdminSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminSettings
     */
    omit?: AdminSettingsOmit<ExtArgs> | null
    /**
     * The data needed to update a AdminSettings.
     */
    data: XOR<AdminSettingsUpdateInput, AdminSettingsUncheckedUpdateInput>
    /**
     * Choose, which AdminSettings to update.
     */
    where: AdminSettingsWhereUniqueInput
  }

  /**
   * AdminSettings updateMany
   */
  export type AdminSettingsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AdminSettings.
     */
    data: XOR<AdminSettingsUpdateManyMutationInput, AdminSettingsUncheckedUpdateManyInput>
    /**
     * Filter which AdminSettings to update
     */
    where?: AdminSettingsWhereInput
    /**
     * Limit how many AdminSettings to update.
     */
    limit?: number
  }

  /**
   * AdminSettings updateManyAndReturn
   */
  export type AdminSettingsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminSettings
     */
    select?: AdminSettingsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AdminSettings
     */
    omit?: AdminSettingsOmit<ExtArgs> | null
    /**
     * The data used to update AdminSettings.
     */
    data: XOR<AdminSettingsUpdateManyMutationInput, AdminSettingsUncheckedUpdateManyInput>
    /**
     * Filter which AdminSettings to update
     */
    where?: AdminSettingsWhereInput
    /**
     * Limit how many AdminSettings to update.
     */
    limit?: number
  }

  /**
   * AdminSettings upsert
   */
  export type AdminSettingsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminSettings
     */
    select?: AdminSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminSettings
     */
    omit?: AdminSettingsOmit<ExtArgs> | null
    /**
     * The filter to search for the AdminSettings to update in case it exists.
     */
    where: AdminSettingsWhereUniqueInput
    /**
     * In case the AdminSettings found by the `where` argument doesn't exist, create a new AdminSettings with this data.
     */
    create: XOR<AdminSettingsCreateInput, AdminSettingsUncheckedCreateInput>
    /**
     * In case the AdminSettings was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AdminSettingsUpdateInput, AdminSettingsUncheckedUpdateInput>
  }

  /**
   * AdminSettings delete
   */
  export type AdminSettingsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminSettings
     */
    select?: AdminSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminSettings
     */
    omit?: AdminSettingsOmit<ExtArgs> | null
    /**
     * Filter which AdminSettings to delete.
     */
    where: AdminSettingsWhereUniqueInput
  }

  /**
   * AdminSettings deleteMany
   */
  export type AdminSettingsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdminSettings to delete
     */
    where?: AdminSettingsWhereInput
    /**
     * Limit how many AdminSettings to delete.
     */
    limit?: number
  }

  /**
   * AdminSettings without action
   */
  export type AdminSettingsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminSettings
     */
    select?: AdminSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminSettings
     */
    omit?: AdminSettingsOmit<ExtArgs> | null
  }


  /**
   * Model ScheduledReminder
   */

  export type AggregateScheduledReminder = {
    _count: ScheduledReminderCountAggregateOutputType | null
    _avg: ScheduledReminderAvgAggregateOutputType | null
    _sum: ScheduledReminderSumAggregateOutputType | null
    _min: ScheduledReminderMinAggregateOutputType | null
    _max: ScheduledReminderMaxAggregateOutputType | null
  }

  export type ScheduledReminderAvgAggregateOutputType = {
    emailsSent: number | null
    emailsFailed: number | null
  }

  export type ScheduledReminderSumAggregateOutputType = {
    emailsSent: number | null
    emailsFailed: number | null
  }

  export type ScheduledReminderMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    reminderDate: Date | null
    reminderTime: string | null
    sendToAdmin: boolean | null
    sendToOwners: boolean | null
    taskIds: string | null
    isActive: boolean | null
    isSent: boolean | null
    sentAt: Date | null
    emailsSent: number | null
    emailsFailed: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ScheduledReminderMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    reminderDate: Date | null
    reminderTime: string | null
    sendToAdmin: boolean | null
    sendToOwners: boolean | null
    taskIds: string | null
    isActive: boolean | null
    isSent: boolean | null
    sentAt: Date | null
    emailsSent: number | null
    emailsFailed: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ScheduledReminderCountAggregateOutputType = {
    id: number
    title: number
    description: number
    reminderDate: number
    reminderTime: number
    sendToAdmin: number
    sendToOwners: number
    taskIds: number
    isActive: number
    isSent: number
    sentAt: number
    emailsSent: number
    emailsFailed: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ScheduledReminderAvgAggregateInputType = {
    emailsSent?: true
    emailsFailed?: true
  }

  export type ScheduledReminderSumAggregateInputType = {
    emailsSent?: true
    emailsFailed?: true
  }

  export type ScheduledReminderMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    reminderDate?: true
    reminderTime?: true
    sendToAdmin?: true
    sendToOwners?: true
    taskIds?: true
    isActive?: true
    isSent?: true
    sentAt?: true
    emailsSent?: true
    emailsFailed?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ScheduledReminderMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    reminderDate?: true
    reminderTime?: true
    sendToAdmin?: true
    sendToOwners?: true
    taskIds?: true
    isActive?: true
    isSent?: true
    sentAt?: true
    emailsSent?: true
    emailsFailed?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ScheduledReminderCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    reminderDate?: true
    reminderTime?: true
    sendToAdmin?: true
    sendToOwners?: true
    taskIds?: true
    isActive?: true
    isSent?: true
    sentAt?: true
    emailsSent?: true
    emailsFailed?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ScheduledReminderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ScheduledReminder to aggregate.
     */
    where?: ScheduledReminderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScheduledReminders to fetch.
     */
    orderBy?: ScheduledReminderOrderByWithRelationInput | ScheduledReminderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ScheduledReminderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScheduledReminders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScheduledReminders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ScheduledReminders
    **/
    _count?: true | ScheduledReminderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ScheduledReminderAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ScheduledReminderSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ScheduledReminderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ScheduledReminderMaxAggregateInputType
  }

  export type GetScheduledReminderAggregateType<T extends ScheduledReminderAggregateArgs> = {
        [P in keyof T & keyof AggregateScheduledReminder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateScheduledReminder[P]>
      : GetScalarType<T[P], AggregateScheduledReminder[P]>
  }




  export type ScheduledReminderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScheduledReminderWhereInput
    orderBy?: ScheduledReminderOrderByWithAggregationInput | ScheduledReminderOrderByWithAggregationInput[]
    by: ScheduledReminderScalarFieldEnum[] | ScheduledReminderScalarFieldEnum
    having?: ScheduledReminderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ScheduledReminderCountAggregateInputType | true
    _avg?: ScheduledReminderAvgAggregateInputType
    _sum?: ScheduledReminderSumAggregateInputType
    _min?: ScheduledReminderMinAggregateInputType
    _max?: ScheduledReminderMaxAggregateInputType
  }

  export type ScheduledReminderGroupByOutputType = {
    id: string
    title: string
    description: string | null
    reminderDate: Date
    reminderTime: string
    sendToAdmin: boolean
    sendToOwners: boolean
    taskIds: string | null
    isActive: boolean
    isSent: boolean
    sentAt: Date | null
    emailsSent: number
    emailsFailed: number
    createdAt: Date
    updatedAt: Date
    _count: ScheduledReminderCountAggregateOutputType | null
    _avg: ScheduledReminderAvgAggregateOutputType | null
    _sum: ScheduledReminderSumAggregateOutputType | null
    _min: ScheduledReminderMinAggregateOutputType | null
    _max: ScheduledReminderMaxAggregateOutputType | null
  }

  type GetScheduledReminderGroupByPayload<T extends ScheduledReminderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ScheduledReminderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ScheduledReminderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ScheduledReminderGroupByOutputType[P]>
            : GetScalarType<T[P], ScheduledReminderGroupByOutputType[P]>
        }
      >
    >


  export type ScheduledReminderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    reminderDate?: boolean
    reminderTime?: boolean
    sendToAdmin?: boolean
    sendToOwners?: boolean
    taskIds?: boolean
    isActive?: boolean
    isSent?: boolean
    sentAt?: boolean
    emailsSent?: boolean
    emailsFailed?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["scheduledReminder"]>

  export type ScheduledReminderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    reminderDate?: boolean
    reminderTime?: boolean
    sendToAdmin?: boolean
    sendToOwners?: boolean
    taskIds?: boolean
    isActive?: boolean
    isSent?: boolean
    sentAt?: boolean
    emailsSent?: boolean
    emailsFailed?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["scheduledReminder"]>

  export type ScheduledReminderSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    reminderDate?: boolean
    reminderTime?: boolean
    sendToAdmin?: boolean
    sendToOwners?: boolean
    taskIds?: boolean
    isActive?: boolean
    isSent?: boolean
    sentAt?: boolean
    emailsSent?: boolean
    emailsFailed?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["scheduledReminder"]>

  export type ScheduledReminderSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    reminderDate?: boolean
    reminderTime?: boolean
    sendToAdmin?: boolean
    sendToOwners?: boolean
    taskIds?: boolean
    isActive?: boolean
    isSent?: boolean
    sentAt?: boolean
    emailsSent?: boolean
    emailsFailed?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ScheduledReminderOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "reminderDate" | "reminderTime" | "sendToAdmin" | "sendToOwners" | "taskIds" | "isActive" | "isSent" | "sentAt" | "emailsSent" | "emailsFailed" | "createdAt" | "updatedAt", ExtArgs["result"]["scheduledReminder"]>

  export type $ScheduledReminderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ScheduledReminder"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string | null
      reminderDate: Date
      reminderTime: string
      sendToAdmin: boolean
      sendToOwners: boolean
      taskIds: string | null
      isActive: boolean
      isSent: boolean
      sentAt: Date | null
      emailsSent: number
      emailsFailed: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["scheduledReminder"]>
    composites: {}
  }

  type ScheduledReminderGetPayload<S extends boolean | null | undefined | ScheduledReminderDefaultArgs> = $Result.GetResult<Prisma.$ScheduledReminderPayload, S>

  type ScheduledReminderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ScheduledReminderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ScheduledReminderCountAggregateInputType | true
    }

  export interface ScheduledReminderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ScheduledReminder'], meta: { name: 'ScheduledReminder' } }
    /**
     * Find zero or one ScheduledReminder that matches the filter.
     * @param {ScheduledReminderFindUniqueArgs} args - Arguments to find a ScheduledReminder
     * @example
     * // Get one ScheduledReminder
     * const scheduledReminder = await prisma.scheduledReminder.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ScheduledReminderFindUniqueArgs>(args: SelectSubset<T, ScheduledReminderFindUniqueArgs<ExtArgs>>): Prisma__ScheduledReminderClient<$Result.GetResult<Prisma.$ScheduledReminderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ScheduledReminder that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ScheduledReminderFindUniqueOrThrowArgs} args - Arguments to find a ScheduledReminder
     * @example
     * // Get one ScheduledReminder
     * const scheduledReminder = await prisma.scheduledReminder.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ScheduledReminderFindUniqueOrThrowArgs>(args: SelectSubset<T, ScheduledReminderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ScheduledReminderClient<$Result.GetResult<Prisma.$ScheduledReminderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ScheduledReminder that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduledReminderFindFirstArgs} args - Arguments to find a ScheduledReminder
     * @example
     * // Get one ScheduledReminder
     * const scheduledReminder = await prisma.scheduledReminder.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ScheduledReminderFindFirstArgs>(args?: SelectSubset<T, ScheduledReminderFindFirstArgs<ExtArgs>>): Prisma__ScheduledReminderClient<$Result.GetResult<Prisma.$ScheduledReminderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ScheduledReminder that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduledReminderFindFirstOrThrowArgs} args - Arguments to find a ScheduledReminder
     * @example
     * // Get one ScheduledReminder
     * const scheduledReminder = await prisma.scheduledReminder.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ScheduledReminderFindFirstOrThrowArgs>(args?: SelectSubset<T, ScheduledReminderFindFirstOrThrowArgs<ExtArgs>>): Prisma__ScheduledReminderClient<$Result.GetResult<Prisma.$ScheduledReminderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ScheduledReminders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduledReminderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ScheduledReminders
     * const scheduledReminders = await prisma.scheduledReminder.findMany()
     * 
     * // Get first 10 ScheduledReminders
     * const scheduledReminders = await prisma.scheduledReminder.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const scheduledReminderWithIdOnly = await prisma.scheduledReminder.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ScheduledReminderFindManyArgs>(args?: SelectSubset<T, ScheduledReminderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScheduledReminderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ScheduledReminder.
     * @param {ScheduledReminderCreateArgs} args - Arguments to create a ScheduledReminder.
     * @example
     * // Create one ScheduledReminder
     * const ScheduledReminder = await prisma.scheduledReminder.create({
     *   data: {
     *     // ... data to create a ScheduledReminder
     *   }
     * })
     * 
     */
    create<T extends ScheduledReminderCreateArgs>(args: SelectSubset<T, ScheduledReminderCreateArgs<ExtArgs>>): Prisma__ScheduledReminderClient<$Result.GetResult<Prisma.$ScheduledReminderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ScheduledReminders.
     * @param {ScheduledReminderCreateManyArgs} args - Arguments to create many ScheduledReminders.
     * @example
     * // Create many ScheduledReminders
     * const scheduledReminder = await prisma.scheduledReminder.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ScheduledReminderCreateManyArgs>(args?: SelectSubset<T, ScheduledReminderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ScheduledReminders and returns the data saved in the database.
     * @param {ScheduledReminderCreateManyAndReturnArgs} args - Arguments to create many ScheduledReminders.
     * @example
     * // Create many ScheduledReminders
     * const scheduledReminder = await prisma.scheduledReminder.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ScheduledReminders and only return the `id`
     * const scheduledReminderWithIdOnly = await prisma.scheduledReminder.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ScheduledReminderCreateManyAndReturnArgs>(args?: SelectSubset<T, ScheduledReminderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScheduledReminderPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ScheduledReminder.
     * @param {ScheduledReminderDeleteArgs} args - Arguments to delete one ScheduledReminder.
     * @example
     * // Delete one ScheduledReminder
     * const ScheduledReminder = await prisma.scheduledReminder.delete({
     *   where: {
     *     // ... filter to delete one ScheduledReminder
     *   }
     * })
     * 
     */
    delete<T extends ScheduledReminderDeleteArgs>(args: SelectSubset<T, ScheduledReminderDeleteArgs<ExtArgs>>): Prisma__ScheduledReminderClient<$Result.GetResult<Prisma.$ScheduledReminderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ScheduledReminder.
     * @param {ScheduledReminderUpdateArgs} args - Arguments to update one ScheduledReminder.
     * @example
     * // Update one ScheduledReminder
     * const scheduledReminder = await prisma.scheduledReminder.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ScheduledReminderUpdateArgs>(args: SelectSubset<T, ScheduledReminderUpdateArgs<ExtArgs>>): Prisma__ScheduledReminderClient<$Result.GetResult<Prisma.$ScheduledReminderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ScheduledReminders.
     * @param {ScheduledReminderDeleteManyArgs} args - Arguments to filter ScheduledReminders to delete.
     * @example
     * // Delete a few ScheduledReminders
     * const { count } = await prisma.scheduledReminder.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ScheduledReminderDeleteManyArgs>(args?: SelectSubset<T, ScheduledReminderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ScheduledReminders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduledReminderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ScheduledReminders
     * const scheduledReminder = await prisma.scheduledReminder.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ScheduledReminderUpdateManyArgs>(args: SelectSubset<T, ScheduledReminderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ScheduledReminders and returns the data updated in the database.
     * @param {ScheduledReminderUpdateManyAndReturnArgs} args - Arguments to update many ScheduledReminders.
     * @example
     * // Update many ScheduledReminders
     * const scheduledReminder = await prisma.scheduledReminder.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ScheduledReminders and only return the `id`
     * const scheduledReminderWithIdOnly = await prisma.scheduledReminder.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ScheduledReminderUpdateManyAndReturnArgs>(args: SelectSubset<T, ScheduledReminderUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScheduledReminderPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ScheduledReminder.
     * @param {ScheduledReminderUpsertArgs} args - Arguments to update or create a ScheduledReminder.
     * @example
     * // Update or create a ScheduledReminder
     * const scheduledReminder = await prisma.scheduledReminder.upsert({
     *   create: {
     *     // ... data to create a ScheduledReminder
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ScheduledReminder we want to update
     *   }
     * })
     */
    upsert<T extends ScheduledReminderUpsertArgs>(args: SelectSubset<T, ScheduledReminderUpsertArgs<ExtArgs>>): Prisma__ScheduledReminderClient<$Result.GetResult<Prisma.$ScheduledReminderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ScheduledReminders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduledReminderCountArgs} args - Arguments to filter ScheduledReminders to count.
     * @example
     * // Count the number of ScheduledReminders
     * const count = await prisma.scheduledReminder.count({
     *   where: {
     *     // ... the filter for the ScheduledReminders we want to count
     *   }
     * })
    **/
    count<T extends ScheduledReminderCountArgs>(
      args?: Subset<T, ScheduledReminderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ScheduledReminderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ScheduledReminder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduledReminderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ScheduledReminderAggregateArgs>(args: Subset<T, ScheduledReminderAggregateArgs>): Prisma.PrismaPromise<GetScheduledReminderAggregateType<T>>

    /**
     * Group by ScheduledReminder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduledReminderGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ScheduledReminderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ScheduledReminderGroupByArgs['orderBy'] }
        : { orderBy?: ScheduledReminderGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ScheduledReminderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetScheduledReminderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ScheduledReminder model
   */
  readonly fields: ScheduledReminderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ScheduledReminder.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ScheduledReminderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ScheduledReminder model
   */
  interface ScheduledReminderFieldRefs {
    readonly id: FieldRef<"ScheduledReminder", 'String'>
    readonly title: FieldRef<"ScheduledReminder", 'String'>
    readonly description: FieldRef<"ScheduledReminder", 'String'>
    readonly reminderDate: FieldRef<"ScheduledReminder", 'DateTime'>
    readonly reminderTime: FieldRef<"ScheduledReminder", 'String'>
    readonly sendToAdmin: FieldRef<"ScheduledReminder", 'Boolean'>
    readonly sendToOwners: FieldRef<"ScheduledReminder", 'Boolean'>
    readonly taskIds: FieldRef<"ScheduledReminder", 'String'>
    readonly isActive: FieldRef<"ScheduledReminder", 'Boolean'>
    readonly isSent: FieldRef<"ScheduledReminder", 'Boolean'>
    readonly sentAt: FieldRef<"ScheduledReminder", 'DateTime'>
    readonly emailsSent: FieldRef<"ScheduledReminder", 'Int'>
    readonly emailsFailed: FieldRef<"ScheduledReminder", 'Int'>
    readonly createdAt: FieldRef<"ScheduledReminder", 'DateTime'>
    readonly updatedAt: FieldRef<"ScheduledReminder", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ScheduledReminder findUnique
   */
  export type ScheduledReminderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduledReminder
     */
    select?: ScheduledReminderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScheduledReminder
     */
    omit?: ScheduledReminderOmit<ExtArgs> | null
    /**
     * Filter, which ScheduledReminder to fetch.
     */
    where: ScheduledReminderWhereUniqueInput
  }

  /**
   * ScheduledReminder findUniqueOrThrow
   */
  export type ScheduledReminderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduledReminder
     */
    select?: ScheduledReminderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScheduledReminder
     */
    omit?: ScheduledReminderOmit<ExtArgs> | null
    /**
     * Filter, which ScheduledReminder to fetch.
     */
    where: ScheduledReminderWhereUniqueInput
  }

  /**
   * ScheduledReminder findFirst
   */
  export type ScheduledReminderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduledReminder
     */
    select?: ScheduledReminderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScheduledReminder
     */
    omit?: ScheduledReminderOmit<ExtArgs> | null
    /**
     * Filter, which ScheduledReminder to fetch.
     */
    where?: ScheduledReminderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScheduledReminders to fetch.
     */
    orderBy?: ScheduledReminderOrderByWithRelationInput | ScheduledReminderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ScheduledReminders.
     */
    cursor?: ScheduledReminderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScheduledReminders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScheduledReminders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ScheduledReminders.
     */
    distinct?: ScheduledReminderScalarFieldEnum | ScheduledReminderScalarFieldEnum[]
  }

  /**
   * ScheduledReminder findFirstOrThrow
   */
  export type ScheduledReminderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduledReminder
     */
    select?: ScheduledReminderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScheduledReminder
     */
    omit?: ScheduledReminderOmit<ExtArgs> | null
    /**
     * Filter, which ScheduledReminder to fetch.
     */
    where?: ScheduledReminderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScheduledReminders to fetch.
     */
    orderBy?: ScheduledReminderOrderByWithRelationInput | ScheduledReminderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ScheduledReminders.
     */
    cursor?: ScheduledReminderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScheduledReminders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScheduledReminders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ScheduledReminders.
     */
    distinct?: ScheduledReminderScalarFieldEnum | ScheduledReminderScalarFieldEnum[]
  }

  /**
   * ScheduledReminder findMany
   */
  export type ScheduledReminderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduledReminder
     */
    select?: ScheduledReminderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScheduledReminder
     */
    omit?: ScheduledReminderOmit<ExtArgs> | null
    /**
     * Filter, which ScheduledReminders to fetch.
     */
    where?: ScheduledReminderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScheduledReminders to fetch.
     */
    orderBy?: ScheduledReminderOrderByWithRelationInput | ScheduledReminderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ScheduledReminders.
     */
    cursor?: ScheduledReminderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScheduledReminders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScheduledReminders.
     */
    skip?: number
    distinct?: ScheduledReminderScalarFieldEnum | ScheduledReminderScalarFieldEnum[]
  }

  /**
   * ScheduledReminder create
   */
  export type ScheduledReminderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduledReminder
     */
    select?: ScheduledReminderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScheduledReminder
     */
    omit?: ScheduledReminderOmit<ExtArgs> | null
    /**
     * The data needed to create a ScheduledReminder.
     */
    data: XOR<ScheduledReminderCreateInput, ScheduledReminderUncheckedCreateInput>
  }

  /**
   * ScheduledReminder createMany
   */
  export type ScheduledReminderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ScheduledReminders.
     */
    data: ScheduledReminderCreateManyInput | ScheduledReminderCreateManyInput[]
  }

  /**
   * ScheduledReminder createManyAndReturn
   */
  export type ScheduledReminderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduledReminder
     */
    select?: ScheduledReminderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ScheduledReminder
     */
    omit?: ScheduledReminderOmit<ExtArgs> | null
    /**
     * The data used to create many ScheduledReminders.
     */
    data: ScheduledReminderCreateManyInput | ScheduledReminderCreateManyInput[]
  }

  /**
   * ScheduledReminder update
   */
  export type ScheduledReminderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduledReminder
     */
    select?: ScheduledReminderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScheduledReminder
     */
    omit?: ScheduledReminderOmit<ExtArgs> | null
    /**
     * The data needed to update a ScheduledReminder.
     */
    data: XOR<ScheduledReminderUpdateInput, ScheduledReminderUncheckedUpdateInput>
    /**
     * Choose, which ScheduledReminder to update.
     */
    where: ScheduledReminderWhereUniqueInput
  }

  /**
   * ScheduledReminder updateMany
   */
  export type ScheduledReminderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ScheduledReminders.
     */
    data: XOR<ScheduledReminderUpdateManyMutationInput, ScheduledReminderUncheckedUpdateManyInput>
    /**
     * Filter which ScheduledReminders to update
     */
    where?: ScheduledReminderWhereInput
    /**
     * Limit how many ScheduledReminders to update.
     */
    limit?: number
  }

  /**
   * ScheduledReminder updateManyAndReturn
   */
  export type ScheduledReminderUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduledReminder
     */
    select?: ScheduledReminderSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ScheduledReminder
     */
    omit?: ScheduledReminderOmit<ExtArgs> | null
    /**
     * The data used to update ScheduledReminders.
     */
    data: XOR<ScheduledReminderUpdateManyMutationInput, ScheduledReminderUncheckedUpdateManyInput>
    /**
     * Filter which ScheduledReminders to update
     */
    where?: ScheduledReminderWhereInput
    /**
     * Limit how many ScheduledReminders to update.
     */
    limit?: number
  }

  /**
   * ScheduledReminder upsert
   */
  export type ScheduledReminderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduledReminder
     */
    select?: ScheduledReminderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScheduledReminder
     */
    omit?: ScheduledReminderOmit<ExtArgs> | null
    /**
     * The filter to search for the ScheduledReminder to update in case it exists.
     */
    where: ScheduledReminderWhereUniqueInput
    /**
     * In case the ScheduledReminder found by the `where` argument doesn't exist, create a new ScheduledReminder with this data.
     */
    create: XOR<ScheduledReminderCreateInput, ScheduledReminderUncheckedCreateInput>
    /**
     * In case the ScheduledReminder was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ScheduledReminderUpdateInput, ScheduledReminderUncheckedUpdateInput>
  }

  /**
   * ScheduledReminder delete
   */
  export type ScheduledReminderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduledReminder
     */
    select?: ScheduledReminderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScheduledReminder
     */
    omit?: ScheduledReminderOmit<ExtArgs> | null
    /**
     * Filter which ScheduledReminder to delete.
     */
    where: ScheduledReminderWhereUniqueInput
  }

  /**
   * ScheduledReminder deleteMany
   */
  export type ScheduledReminderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ScheduledReminders to delete
     */
    where?: ScheduledReminderWhereInput
    /**
     * Limit how many ScheduledReminders to delete.
     */
    limit?: number
  }

  /**
   * ScheduledReminder without action
   */
  export type ScheduledReminderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduledReminder
     */
    select?: ScheduledReminderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScheduledReminder
     */
    omit?: ScheduledReminderOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    username: 'username',
    name: 'name',
    role: 'role',
    department: 'department',
    phone: 'phone',
    avatar: 'avatar',
    isActive: 'isActive',
    receiveTaskReminders: 'receiveTaskReminders',
    receiveDailyDigest: 'receiveDailyDigest',
    receiveWeeklyReport: 'receiveWeeklyReport',
    reminderDaysBefore: 'reminderDaysBefore',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const TaskScalarFieldEnum: {
    id: 'id',
    taskId: 'taskId',
    title: 'title',
    description: 'description',
    sentdmMessageId: 'sentdmMessageId',
    lastReminderSentAt: 'lastReminderSentAt',
    ownerId: 'ownerId',
    assigneeId: 'assigneeId',
    department: 'department',
    priority: 'priority',
    status: 'status',
    strategicPillar: 'strategicPillar',
    completion: 'completion',
    riskIndicator: 'riskIndicator',
    startDate: 'startDate',
    dueDate: 'dueDate',
    completedAt: 'completedAt',
    notes: 'notes',
    nextStep: 'nextStep',
    ceoNotes: 'ceoNotes',
    sourceMonth: 'sourceMonth',
    source: 'source',
    dataSourceId: 'dataSourceId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TaskScalarFieldEnum = (typeof TaskScalarFieldEnum)[keyof typeof TaskScalarFieldEnum]


  export const ContactScalarFieldEnum: {
    id: 'id',
    name: 'name',
    phone: 'phone',
    email: 'email',
    userId: 'userId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ContactScalarFieldEnum = (typeof ContactScalarFieldEnum)[keyof typeof ContactScalarFieldEnum]


  export const TaskUpdateScalarFieldEnum: {
    id: 'id',
    taskId: 'taskId',
    source: 'source',
    content: 'content',
    createdAt: 'createdAt'
  };

  export type TaskUpdateScalarFieldEnum = (typeof TaskUpdateScalarFieldEnum)[keyof typeof TaskUpdateScalarFieldEnum]


  export const TaskAuditLogScalarFieldEnum: {
    id: 'id',
    taskId: 'taskId',
    userId: 'userId',
    action: 'action',
    field: 'field',
    oldValue: 'oldValue',
    newValue: 'newValue',
    createdAt: 'createdAt'
  };

  export type TaskAuditLogScalarFieldEnum = (typeof TaskAuditLogScalarFieldEnum)[keyof typeof TaskAuditLogScalarFieldEnum]


  export const DataSourceScalarFieldEnum: {
    id: 'id',
    fileName: 'fileName',
    originalName: 'originalName',
    fileSize: 'fileSize',
    rowCount: 'rowCount',
    columnMapping: 'columnMapping',
    uploadedById: 'uploadedById',
    uploadedAt: 'uploadedAt'
  };

  export type DataSourceScalarFieldEnum = (typeof DataSourceScalarFieldEnum)[keyof typeof DataSourceScalarFieldEnum]


  export const NotificationScalarFieldEnum: {
    id: 'id',
    taskId: 'taskId',
    userId: 'userId',
    type: 'type',
    channel: 'channel',
    subject: 'subject',
    message: 'message',
    status: 'status',
    scheduledAt: 'scheduledAt',
    sentAt: 'sentAt',
    error: 'error',
    createdAt: 'createdAt'
  };

  export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum]


  export const NotificationRuleScalarFieldEnum: {
    id: 'id',
    name: 'name',
    type: 'type',
    channel: 'channel',
    daysBeforeDue: 'daysBeforeDue',
    notifyOwner: 'notifyOwner',
    notifyAssignee: 'notifyAssignee',
    notifyManager: 'notifyManager',
    subjectTemplate: 'subjectTemplate',
    bodyTemplate: 'bodyTemplate',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type NotificationRuleScalarFieldEnum = (typeof NotificationRuleScalarFieldEnum)[keyof typeof NotificationRuleScalarFieldEnum]


  export const SystemConfigScalarFieldEnum: {
    id: 'id',
    key: 'key',
    value: 'value',
    updatedAt: 'updatedAt'
  };

  export type SystemConfigScalarFieldEnum = (typeof SystemConfigScalarFieldEnum)[keyof typeof SystemConfigScalarFieldEnum]


  export const AdminSettingsScalarFieldEnum: {
    id: 'id',
    adminEmail: 'adminEmail',
    dailyDigestEnabled: 'dailyDigestEnabled',
    dailyDigestTime: 'dailyDigestTime',
    weeklyReportEnabled: 'weeklyReportEnabled',
    weeklyReportDay: 'weeklyReportDay',
    weeklyReportTime: 'weeklyReportTime',
    inProgressReportEnabled: 'inProgressReportEnabled',
    inProgressReportFrequency: 'inProgressReportFrequency',
    taskReminderEnabled: 'taskReminderEnabled',
    overdueReminderEnabled: 'overdueReminderEnabled',
    customReminderDates: 'customReminderDates',
    reminderDaysBefore: 'reminderDaysBefore',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AdminSettingsScalarFieldEnum = (typeof AdminSettingsScalarFieldEnum)[keyof typeof AdminSettingsScalarFieldEnum]


  export const ScheduledReminderScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    reminderDate: 'reminderDate',
    reminderTime: 'reminderTime',
    sendToAdmin: 'sendToAdmin',
    sendToOwners: 'sendToOwners',
    taskIds: 'taskIds',
    isActive: 'isActive',
    isSent: 'isSent',
    sentAt: 'sentAt',
    emailsSent: 'emailsSent',
    emailsFailed: 'emailsFailed',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ScheduledReminderScalarFieldEnum = (typeof ScheduledReminderScalarFieldEnum)[keyof typeof ScheduledReminderScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    username?: StringNullableFilter<"User"> | string | null
    name?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    department?: StringNullableFilter<"User"> | string | null
    phone?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    isActive?: BoolFilter<"User"> | boolean
    receiveTaskReminders?: BoolFilter<"User"> | boolean
    receiveDailyDigest?: BoolFilter<"User"> | boolean
    receiveWeeklyReport?: BoolFilter<"User"> | boolean
    reminderDaysBefore?: IntFilter<"User"> | number
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    ownedTasks?: TaskListRelationFilter
    assignedTasks?: TaskListRelationFilter
    auditLogs?: TaskAuditLogListRelationFilter
    notifications?: NotificationListRelationFilter
    contact?: XOR<ContactNullableScalarRelationFilter, ContactWhereInput> | null
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    role?: SortOrder
    department?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    isActive?: SortOrder
    receiveTaskReminders?: SortOrder
    receiveDailyDigest?: SortOrder
    receiveWeeklyReport?: SortOrder
    reminderDaysBefore?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ownedTasks?: TaskOrderByRelationAggregateInput
    assignedTasks?: TaskOrderByRelationAggregateInput
    auditLogs?: TaskAuditLogOrderByRelationAggregateInput
    notifications?: NotificationOrderByRelationAggregateInput
    contact?: ContactOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    username?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    department?: StringNullableFilter<"User"> | string | null
    phone?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    isActive?: BoolFilter<"User"> | boolean
    receiveTaskReminders?: BoolFilter<"User"> | boolean
    receiveDailyDigest?: BoolFilter<"User"> | boolean
    receiveWeeklyReport?: BoolFilter<"User"> | boolean
    reminderDaysBefore?: IntFilter<"User"> | number
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    ownedTasks?: TaskListRelationFilter
    assignedTasks?: TaskListRelationFilter
    auditLogs?: TaskAuditLogListRelationFilter
    notifications?: NotificationListRelationFilter
    contact?: XOR<ContactNullableScalarRelationFilter, ContactWhereInput> | null
  }, "id" | "email" | "username">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    role?: SortOrder
    department?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    isActive?: SortOrder
    receiveTaskReminders?: SortOrder
    receiveDailyDigest?: SortOrder
    receiveWeeklyReport?: SortOrder
    reminderDaysBefore?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    username?: StringNullableWithAggregatesFilter<"User"> | string | null
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: StringWithAggregatesFilter<"User"> | string
    department?: StringNullableWithAggregatesFilter<"User"> | string | null
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    avatar?: StringNullableWithAggregatesFilter<"User"> | string | null
    isActive?: BoolWithAggregatesFilter<"User"> | boolean
    receiveTaskReminders?: BoolWithAggregatesFilter<"User"> | boolean
    receiveDailyDigest?: BoolWithAggregatesFilter<"User"> | boolean
    receiveWeeklyReport?: BoolWithAggregatesFilter<"User"> | boolean
    reminderDaysBefore?: IntWithAggregatesFilter<"User"> | number
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type TaskWhereInput = {
    AND?: TaskWhereInput | TaskWhereInput[]
    OR?: TaskWhereInput[]
    NOT?: TaskWhereInput | TaskWhereInput[]
    id?: StringFilter<"Task"> | string
    taskId?: StringNullableFilter<"Task"> | string | null
    title?: StringFilter<"Task"> | string
    description?: StringNullableFilter<"Task"> | string | null
    sentdmMessageId?: StringNullableFilter<"Task"> | string | null
    lastReminderSentAt?: DateTimeNullableFilter<"Task"> | Date | string | null
    ownerId?: StringNullableFilter<"Task"> | string | null
    assigneeId?: StringNullableFilter<"Task"> | string | null
    department?: StringNullableFilter<"Task"> | string | null
    priority?: StringFilter<"Task"> | string
    status?: StringFilter<"Task"> | string
    strategicPillar?: StringNullableFilter<"Task"> | string | null
    completion?: FloatFilter<"Task"> | number
    riskIndicator?: StringNullableFilter<"Task"> | string | null
    startDate?: DateTimeNullableFilter<"Task"> | Date | string | null
    dueDate?: DateTimeNullableFilter<"Task"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"Task"> | Date | string | null
    notes?: StringNullableFilter<"Task"> | string | null
    nextStep?: StringNullableFilter<"Task"> | string | null
    ceoNotes?: StringNullableFilter<"Task"> | string | null
    sourceMonth?: StringNullableFilter<"Task"> | string | null
    source?: StringNullableFilter<"Task"> | string | null
    dataSourceId?: StringNullableFilter<"Task"> | string | null
    createdAt?: DateTimeFilter<"Task"> | Date | string
    updatedAt?: DateTimeFilter<"Task"> | Date | string
    owner?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    assignee?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    dataSource?: XOR<DataSourceNullableScalarRelationFilter, DataSourceWhereInput> | null
    auditLogs?: TaskAuditLogListRelationFilter
    notifications?: NotificationListRelationFilter
    updates?: TaskUpdateListRelationFilter
  }

  export type TaskOrderByWithRelationInput = {
    id?: SortOrder
    taskId?: SortOrderInput | SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    sentdmMessageId?: SortOrderInput | SortOrder
    lastReminderSentAt?: SortOrderInput | SortOrder
    ownerId?: SortOrderInput | SortOrder
    assigneeId?: SortOrderInput | SortOrder
    department?: SortOrderInput | SortOrder
    priority?: SortOrder
    status?: SortOrder
    strategicPillar?: SortOrderInput | SortOrder
    completion?: SortOrder
    riskIndicator?: SortOrderInput | SortOrder
    startDate?: SortOrderInput | SortOrder
    dueDate?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    nextStep?: SortOrderInput | SortOrder
    ceoNotes?: SortOrderInput | SortOrder
    sourceMonth?: SortOrderInput | SortOrder
    source?: SortOrderInput | SortOrder
    dataSourceId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    owner?: UserOrderByWithRelationInput
    assignee?: UserOrderByWithRelationInput
    dataSource?: DataSourceOrderByWithRelationInput
    auditLogs?: TaskAuditLogOrderByRelationAggregateInput
    notifications?: NotificationOrderByRelationAggregateInput
    updates?: TaskUpdateOrderByRelationAggregateInput
  }

  export type TaskWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TaskWhereInput | TaskWhereInput[]
    OR?: TaskWhereInput[]
    NOT?: TaskWhereInput | TaskWhereInput[]
    taskId?: StringNullableFilter<"Task"> | string | null
    title?: StringFilter<"Task"> | string
    description?: StringNullableFilter<"Task"> | string | null
    sentdmMessageId?: StringNullableFilter<"Task"> | string | null
    lastReminderSentAt?: DateTimeNullableFilter<"Task"> | Date | string | null
    ownerId?: StringNullableFilter<"Task"> | string | null
    assigneeId?: StringNullableFilter<"Task"> | string | null
    department?: StringNullableFilter<"Task"> | string | null
    priority?: StringFilter<"Task"> | string
    status?: StringFilter<"Task"> | string
    strategicPillar?: StringNullableFilter<"Task"> | string | null
    completion?: FloatFilter<"Task"> | number
    riskIndicator?: StringNullableFilter<"Task"> | string | null
    startDate?: DateTimeNullableFilter<"Task"> | Date | string | null
    dueDate?: DateTimeNullableFilter<"Task"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"Task"> | Date | string | null
    notes?: StringNullableFilter<"Task"> | string | null
    nextStep?: StringNullableFilter<"Task"> | string | null
    ceoNotes?: StringNullableFilter<"Task"> | string | null
    sourceMonth?: StringNullableFilter<"Task"> | string | null
    source?: StringNullableFilter<"Task"> | string | null
    dataSourceId?: StringNullableFilter<"Task"> | string | null
    createdAt?: DateTimeFilter<"Task"> | Date | string
    updatedAt?: DateTimeFilter<"Task"> | Date | string
    owner?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    assignee?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    dataSource?: XOR<DataSourceNullableScalarRelationFilter, DataSourceWhereInput> | null
    auditLogs?: TaskAuditLogListRelationFilter
    notifications?: NotificationListRelationFilter
    updates?: TaskUpdateListRelationFilter
  }, "id">

  export type TaskOrderByWithAggregationInput = {
    id?: SortOrder
    taskId?: SortOrderInput | SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    sentdmMessageId?: SortOrderInput | SortOrder
    lastReminderSentAt?: SortOrderInput | SortOrder
    ownerId?: SortOrderInput | SortOrder
    assigneeId?: SortOrderInput | SortOrder
    department?: SortOrderInput | SortOrder
    priority?: SortOrder
    status?: SortOrder
    strategicPillar?: SortOrderInput | SortOrder
    completion?: SortOrder
    riskIndicator?: SortOrderInput | SortOrder
    startDate?: SortOrderInput | SortOrder
    dueDate?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    nextStep?: SortOrderInput | SortOrder
    ceoNotes?: SortOrderInput | SortOrder
    sourceMonth?: SortOrderInput | SortOrder
    source?: SortOrderInput | SortOrder
    dataSourceId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TaskCountOrderByAggregateInput
    _avg?: TaskAvgOrderByAggregateInput
    _max?: TaskMaxOrderByAggregateInput
    _min?: TaskMinOrderByAggregateInput
    _sum?: TaskSumOrderByAggregateInput
  }

  export type TaskScalarWhereWithAggregatesInput = {
    AND?: TaskScalarWhereWithAggregatesInput | TaskScalarWhereWithAggregatesInput[]
    OR?: TaskScalarWhereWithAggregatesInput[]
    NOT?: TaskScalarWhereWithAggregatesInput | TaskScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Task"> | string
    taskId?: StringNullableWithAggregatesFilter<"Task"> | string | null
    title?: StringWithAggregatesFilter<"Task"> | string
    description?: StringNullableWithAggregatesFilter<"Task"> | string | null
    sentdmMessageId?: StringNullableWithAggregatesFilter<"Task"> | string | null
    lastReminderSentAt?: DateTimeNullableWithAggregatesFilter<"Task"> | Date | string | null
    ownerId?: StringNullableWithAggregatesFilter<"Task"> | string | null
    assigneeId?: StringNullableWithAggregatesFilter<"Task"> | string | null
    department?: StringNullableWithAggregatesFilter<"Task"> | string | null
    priority?: StringWithAggregatesFilter<"Task"> | string
    status?: StringWithAggregatesFilter<"Task"> | string
    strategicPillar?: StringNullableWithAggregatesFilter<"Task"> | string | null
    completion?: FloatWithAggregatesFilter<"Task"> | number
    riskIndicator?: StringNullableWithAggregatesFilter<"Task"> | string | null
    startDate?: DateTimeNullableWithAggregatesFilter<"Task"> | Date | string | null
    dueDate?: DateTimeNullableWithAggregatesFilter<"Task"> | Date | string | null
    completedAt?: DateTimeNullableWithAggregatesFilter<"Task"> | Date | string | null
    notes?: StringNullableWithAggregatesFilter<"Task"> | string | null
    nextStep?: StringNullableWithAggregatesFilter<"Task"> | string | null
    ceoNotes?: StringNullableWithAggregatesFilter<"Task"> | string | null
    sourceMonth?: StringNullableWithAggregatesFilter<"Task"> | string | null
    source?: StringNullableWithAggregatesFilter<"Task"> | string | null
    dataSourceId?: StringNullableWithAggregatesFilter<"Task"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Task"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Task"> | Date | string
  }

  export type ContactWhereInput = {
    AND?: ContactWhereInput | ContactWhereInput[]
    OR?: ContactWhereInput[]
    NOT?: ContactWhereInput | ContactWhereInput[]
    id?: StringFilter<"Contact"> | string
    name?: StringFilter<"Contact"> | string
    phone?: StringNullableFilter<"Contact"> | string | null
    email?: StringNullableFilter<"Contact"> | string | null
    userId?: StringNullableFilter<"Contact"> | string | null
    createdAt?: DateTimeFilter<"Contact"> | Date | string
    updatedAt?: DateTimeFilter<"Contact"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type ContactOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type ContactWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: ContactWhereInput | ContactWhereInput[]
    OR?: ContactWhereInput[]
    NOT?: ContactWhereInput | ContactWhereInput[]
    name?: StringFilter<"Contact"> | string
    phone?: StringNullableFilter<"Contact"> | string | null
    email?: StringNullableFilter<"Contact"> | string | null
    createdAt?: DateTimeFilter<"Contact"> | Date | string
    updatedAt?: DateTimeFilter<"Contact"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id" | "userId">

  export type ContactOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ContactCountOrderByAggregateInput
    _max?: ContactMaxOrderByAggregateInput
    _min?: ContactMinOrderByAggregateInput
  }

  export type ContactScalarWhereWithAggregatesInput = {
    AND?: ContactScalarWhereWithAggregatesInput | ContactScalarWhereWithAggregatesInput[]
    OR?: ContactScalarWhereWithAggregatesInput[]
    NOT?: ContactScalarWhereWithAggregatesInput | ContactScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Contact"> | string
    name?: StringWithAggregatesFilter<"Contact"> | string
    phone?: StringNullableWithAggregatesFilter<"Contact"> | string | null
    email?: StringNullableWithAggregatesFilter<"Contact"> | string | null
    userId?: StringNullableWithAggregatesFilter<"Contact"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Contact"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Contact"> | Date | string
  }

  export type TaskUpdateWhereInput = {
    AND?: TaskUpdateWhereInput | TaskUpdateWhereInput[]
    OR?: TaskUpdateWhereInput[]
    NOT?: TaskUpdateWhereInput | TaskUpdateWhereInput[]
    id?: StringFilter<"TaskUpdate"> | string
    taskId?: StringFilter<"TaskUpdate"> | string
    source?: StringFilter<"TaskUpdate"> | string
    content?: StringFilter<"TaskUpdate"> | string
    createdAt?: DateTimeFilter<"TaskUpdate"> | Date | string
    task?: XOR<TaskScalarRelationFilter, TaskWhereInput>
  }

  export type TaskUpdateOrderByWithRelationInput = {
    id?: SortOrder
    taskId?: SortOrder
    source?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    task?: TaskOrderByWithRelationInput
  }

  export type TaskUpdateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TaskUpdateWhereInput | TaskUpdateWhereInput[]
    OR?: TaskUpdateWhereInput[]
    NOT?: TaskUpdateWhereInput | TaskUpdateWhereInput[]
    taskId?: StringFilter<"TaskUpdate"> | string
    source?: StringFilter<"TaskUpdate"> | string
    content?: StringFilter<"TaskUpdate"> | string
    createdAt?: DateTimeFilter<"TaskUpdate"> | Date | string
    task?: XOR<TaskScalarRelationFilter, TaskWhereInput>
  }, "id">

  export type TaskUpdateOrderByWithAggregationInput = {
    id?: SortOrder
    taskId?: SortOrder
    source?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    _count?: TaskUpdateCountOrderByAggregateInput
    _max?: TaskUpdateMaxOrderByAggregateInput
    _min?: TaskUpdateMinOrderByAggregateInput
  }

  export type TaskUpdateScalarWhereWithAggregatesInput = {
    AND?: TaskUpdateScalarWhereWithAggregatesInput | TaskUpdateScalarWhereWithAggregatesInput[]
    OR?: TaskUpdateScalarWhereWithAggregatesInput[]
    NOT?: TaskUpdateScalarWhereWithAggregatesInput | TaskUpdateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TaskUpdate"> | string
    taskId?: StringWithAggregatesFilter<"TaskUpdate"> | string
    source?: StringWithAggregatesFilter<"TaskUpdate"> | string
    content?: StringWithAggregatesFilter<"TaskUpdate"> | string
    createdAt?: DateTimeWithAggregatesFilter<"TaskUpdate"> | Date | string
  }

  export type TaskAuditLogWhereInput = {
    AND?: TaskAuditLogWhereInput | TaskAuditLogWhereInput[]
    OR?: TaskAuditLogWhereInput[]
    NOT?: TaskAuditLogWhereInput | TaskAuditLogWhereInput[]
    id?: StringFilter<"TaskAuditLog"> | string
    taskId?: StringFilter<"TaskAuditLog"> | string
    userId?: StringNullableFilter<"TaskAuditLog"> | string | null
    action?: StringFilter<"TaskAuditLog"> | string
    field?: StringNullableFilter<"TaskAuditLog"> | string | null
    oldValue?: StringNullableFilter<"TaskAuditLog"> | string | null
    newValue?: StringNullableFilter<"TaskAuditLog"> | string | null
    createdAt?: DateTimeFilter<"TaskAuditLog"> | Date | string
    task?: XOR<TaskScalarRelationFilter, TaskWhereInput>
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type TaskAuditLogOrderByWithRelationInput = {
    id?: SortOrder
    taskId?: SortOrder
    userId?: SortOrderInput | SortOrder
    action?: SortOrder
    field?: SortOrderInput | SortOrder
    oldValue?: SortOrderInput | SortOrder
    newValue?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    task?: TaskOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type TaskAuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TaskAuditLogWhereInput | TaskAuditLogWhereInput[]
    OR?: TaskAuditLogWhereInput[]
    NOT?: TaskAuditLogWhereInput | TaskAuditLogWhereInput[]
    taskId?: StringFilter<"TaskAuditLog"> | string
    userId?: StringNullableFilter<"TaskAuditLog"> | string | null
    action?: StringFilter<"TaskAuditLog"> | string
    field?: StringNullableFilter<"TaskAuditLog"> | string | null
    oldValue?: StringNullableFilter<"TaskAuditLog"> | string | null
    newValue?: StringNullableFilter<"TaskAuditLog"> | string | null
    createdAt?: DateTimeFilter<"TaskAuditLog"> | Date | string
    task?: XOR<TaskScalarRelationFilter, TaskWhereInput>
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type TaskAuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    taskId?: SortOrder
    userId?: SortOrderInput | SortOrder
    action?: SortOrder
    field?: SortOrderInput | SortOrder
    oldValue?: SortOrderInput | SortOrder
    newValue?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: TaskAuditLogCountOrderByAggregateInput
    _max?: TaskAuditLogMaxOrderByAggregateInput
    _min?: TaskAuditLogMinOrderByAggregateInput
  }

  export type TaskAuditLogScalarWhereWithAggregatesInput = {
    AND?: TaskAuditLogScalarWhereWithAggregatesInput | TaskAuditLogScalarWhereWithAggregatesInput[]
    OR?: TaskAuditLogScalarWhereWithAggregatesInput[]
    NOT?: TaskAuditLogScalarWhereWithAggregatesInput | TaskAuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TaskAuditLog"> | string
    taskId?: StringWithAggregatesFilter<"TaskAuditLog"> | string
    userId?: StringNullableWithAggregatesFilter<"TaskAuditLog"> | string | null
    action?: StringWithAggregatesFilter<"TaskAuditLog"> | string
    field?: StringNullableWithAggregatesFilter<"TaskAuditLog"> | string | null
    oldValue?: StringNullableWithAggregatesFilter<"TaskAuditLog"> | string | null
    newValue?: StringNullableWithAggregatesFilter<"TaskAuditLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"TaskAuditLog"> | Date | string
  }

  export type DataSourceWhereInput = {
    AND?: DataSourceWhereInput | DataSourceWhereInput[]
    OR?: DataSourceWhereInput[]
    NOT?: DataSourceWhereInput | DataSourceWhereInput[]
    id?: StringFilter<"DataSource"> | string
    fileName?: StringFilter<"DataSource"> | string
    originalName?: StringFilter<"DataSource"> | string
    fileSize?: IntFilter<"DataSource"> | number
    rowCount?: IntFilter<"DataSource"> | number
    columnMapping?: StringNullableFilter<"DataSource"> | string | null
    uploadedById?: StringNullableFilter<"DataSource"> | string | null
    uploadedAt?: DateTimeFilter<"DataSource"> | Date | string
    tasks?: TaskListRelationFilter
  }

  export type DataSourceOrderByWithRelationInput = {
    id?: SortOrder
    fileName?: SortOrder
    originalName?: SortOrder
    fileSize?: SortOrder
    rowCount?: SortOrder
    columnMapping?: SortOrderInput | SortOrder
    uploadedById?: SortOrderInput | SortOrder
    uploadedAt?: SortOrder
    tasks?: TaskOrderByRelationAggregateInput
  }

  export type DataSourceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DataSourceWhereInput | DataSourceWhereInput[]
    OR?: DataSourceWhereInput[]
    NOT?: DataSourceWhereInput | DataSourceWhereInput[]
    fileName?: StringFilter<"DataSource"> | string
    originalName?: StringFilter<"DataSource"> | string
    fileSize?: IntFilter<"DataSource"> | number
    rowCount?: IntFilter<"DataSource"> | number
    columnMapping?: StringNullableFilter<"DataSource"> | string | null
    uploadedById?: StringNullableFilter<"DataSource"> | string | null
    uploadedAt?: DateTimeFilter<"DataSource"> | Date | string
    tasks?: TaskListRelationFilter
  }, "id">

  export type DataSourceOrderByWithAggregationInput = {
    id?: SortOrder
    fileName?: SortOrder
    originalName?: SortOrder
    fileSize?: SortOrder
    rowCount?: SortOrder
    columnMapping?: SortOrderInput | SortOrder
    uploadedById?: SortOrderInput | SortOrder
    uploadedAt?: SortOrder
    _count?: DataSourceCountOrderByAggregateInput
    _avg?: DataSourceAvgOrderByAggregateInput
    _max?: DataSourceMaxOrderByAggregateInput
    _min?: DataSourceMinOrderByAggregateInput
    _sum?: DataSourceSumOrderByAggregateInput
  }

  export type DataSourceScalarWhereWithAggregatesInput = {
    AND?: DataSourceScalarWhereWithAggregatesInput | DataSourceScalarWhereWithAggregatesInput[]
    OR?: DataSourceScalarWhereWithAggregatesInput[]
    NOT?: DataSourceScalarWhereWithAggregatesInput | DataSourceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DataSource"> | string
    fileName?: StringWithAggregatesFilter<"DataSource"> | string
    originalName?: StringWithAggregatesFilter<"DataSource"> | string
    fileSize?: IntWithAggregatesFilter<"DataSource"> | number
    rowCount?: IntWithAggregatesFilter<"DataSource"> | number
    columnMapping?: StringNullableWithAggregatesFilter<"DataSource"> | string | null
    uploadedById?: StringNullableWithAggregatesFilter<"DataSource"> | string | null
    uploadedAt?: DateTimeWithAggregatesFilter<"DataSource"> | Date | string
  }

  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    id?: StringFilter<"Notification"> | string
    taskId?: StringNullableFilter<"Notification"> | string | null
    userId?: StringNullableFilter<"Notification"> | string | null
    type?: StringFilter<"Notification"> | string
    channel?: StringFilter<"Notification"> | string
    subject?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    status?: StringFilter<"Notification"> | string
    scheduledAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    sentAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    error?: StringNullableFilter<"Notification"> | string | null
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    task?: XOR<TaskNullableScalarRelationFilter, TaskWhereInput> | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type NotificationOrderByWithRelationInput = {
    id?: SortOrder
    taskId?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    type?: SortOrder
    channel?: SortOrder
    subject?: SortOrder
    message?: SortOrder
    status?: SortOrder
    scheduledAt?: SortOrderInput | SortOrder
    sentAt?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    task?: TaskOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    taskId?: StringNullableFilter<"Notification"> | string | null
    userId?: StringNullableFilter<"Notification"> | string | null
    type?: StringFilter<"Notification"> | string
    channel?: StringFilter<"Notification"> | string
    subject?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    status?: StringFilter<"Notification"> | string
    scheduledAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    sentAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    error?: StringNullableFilter<"Notification"> | string | null
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    task?: XOR<TaskNullableScalarRelationFilter, TaskWhereInput> | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type NotificationOrderByWithAggregationInput = {
    id?: SortOrder
    taskId?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    type?: SortOrder
    channel?: SortOrder
    subject?: SortOrder
    message?: SortOrder
    status?: SortOrder
    scheduledAt?: SortOrderInput | SortOrder
    sentAt?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: NotificationCountOrderByAggregateInput
    _max?: NotificationMaxOrderByAggregateInput
    _min?: NotificationMinOrderByAggregateInput
  }

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    OR?: NotificationScalarWhereWithAggregatesInput[]
    NOT?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Notification"> | string
    taskId?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    userId?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    type?: StringWithAggregatesFilter<"Notification"> | string
    channel?: StringWithAggregatesFilter<"Notification"> | string
    subject?: StringWithAggregatesFilter<"Notification"> | string
    message?: StringWithAggregatesFilter<"Notification"> | string
    status?: StringWithAggregatesFilter<"Notification"> | string
    scheduledAt?: DateTimeNullableWithAggregatesFilter<"Notification"> | Date | string | null
    sentAt?: DateTimeNullableWithAggregatesFilter<"Notification"> | Date | string | null
    error?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
  }

  export type NotificationRuleWhereInput = {
    AND?: NotificationRuleWhereInput | NotificationRuleWhereInput[]
    OR?: NotificationRuleWhereInput[]
    NOT?: NotificationRuleWhereInput | NotificationRuleWhereInput[]
    id?: StringFilter<"NotificationRule"> | string
    name?: StringFilter<"NotificationRule"> | string
    type?: StringFilter<"NotificationRule"> | string
    channel?: StringFilter<"NotificationRule"> | string
    daysBeforeDue?: IntNullableFilter<"NotificationRule"> | number | null
    notifyOwner?: BoolFilter<"NotificationRule"> | boolean
    notifyAssignee?: BoolFilter<"NotificationRule"> | boolean
    notifyManager?: BoolFilter<"NotificationRule"> | boolean
    subjectTemplate?: StringNullableFilter<"NotificationRule"> | string | null
    bodyTemplate?: StringNullableFilter<"NotificationRule"> | string | null
    isActive?: BoolFilter<"NotificationRule"> | boolean
    createdAt?: DateTimeFilter<"NotificationRule"> | Date | string
    updatedAt?: DateTimeFilter<"NotificationRule"> | Date | string
  }

  export type NotificationRuleOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    channel?: SortOrder
    daysBeforeDue?: SortOrderInput | SortOrder
    notifyOwner?: SortOrder
    notifyAssignee?: SortOrder
    notifyManager?: SortOrder
    subjectTemplate?: SortOrderInput | SortOrder
    bodyTemplate?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NotificationRuleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NotificationRuleWhereInput | NotificationRuleWhereInput[]
    OR?: NotificationRuleWhereInput[]
    NOT?: NotificationRuleWhereInput | NotificationRuleWhereInput[]
    name?: StringFilter<"NotificationRule"> | string
    type?: StringFilter<"NotificationRule"> | string
    channel?: StringFilter<"NotificationRule"> | string
    daysBeforeDue?: IntNullableFilter<"NotificationRule"> | number | null
    notifyOwner?: BoolFilter<"NotificationRule"> | boolean
    notifyAssignee?: BoolFilter<"NotificationRule"> | boolean
    notifyManager?: BoolFilter<"NotificationRule"> | boolean
    subjectTemplate?: StringNullableFilter<"NotificationRule"> | string | null
    bodyTemplate?: StringNullableFilter<"NotificationRule"> | string | null
    isActive?: BoolFilter<"NotificationRule"> | boolean
    createdAt?: DateTimeFilter<"NotificationRule"> | Date | string
    updatedAt?: DateTimeFilter<"NotificationRule"> | Date | string
  }, "id">

  export type NotificationRuleOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    channel?: SortOrder
    daysBeforeDue?: SortOrderInput | SortOrder
    notifyOwner?: SortOrder
    notifyAssignee?: SortOrder
    notifyManager?: SortOrder
    subjectTemplate?: SortOrderInput | SortOrder
    bodyTemplate?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: NotificationRuleCountOrderByAggregateInput
    _avg?: NotificationRuleAvgOrderByAggregateInput
    _max?: NotificationRuleMaxOrderByAggregateInput
    _min?: NotificationRuleMinOrderByAggregateInput
    _sum?: NotificationRuleSumOrderByAggregateInput
  }

  export type NotificationRuleScalarWhereWithAggregatesInput = {
    AND?: NotificationRuleScalarWhereWithAggregatesInput | NotificationRuleScalarWhereWithAggregatesInput[]
    OR?: NotificationRuleScalarWhereWithAggregatesInput[]
    NOT?: NotificationRuleScalarWhereWithAggregatesInput | NotificationRuleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"NotificationRule"> | string
    name?: StringWithAggregatesFilter<"NotificationRule"> | string
    type?: StringWithAggregatesFilter<"NotificationRule"> | string
    channel?: StringWithAggregatesFilter<"NotificationRule"> | string
    daysBeforeDue?: IntNullableWithAggregatesFilter<"NotificationRule"> | number | null
    notifyOwner?: BoolWithAggregatesFilter<"NotificationRule"> | boolean
    notifyAssignee?: BoolWithAggregatesFilter<"NotificationRule"> | boolean
    notifyManager?: BoolWithAggregatesFilter<"NotificationRule"> | boolean
    subjectTemplate?: StringNullableWithAggregatesFilter<"NotificationRule"> | string | null
    bodyTemplate?: StringNullableWithAggregatesFilter<"NotificationRule"> | string | null
    isActive?: BoolWithAggregatesFilter<"NotificationRule"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"NotificationRule"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"NotificationRule"> | Date | string
  }

  export type SystemConfigWhereInput = {
    AND?: SystemConfigWhereInput | SystemConfigWhereInput[]
    OR?: SystemConfigWhereInput[]
    NOT?: SystemConfigWhereInput | SystemConfigWhereInput[]
    id?: StringFilter<"SystemConfig"> | string
    key?: StringFilter<"SystemConfig"> | string
    value?: StringFilter<"SystemConfig"> | string
    updatedAt?: DateTimeFilter<"SystemConfig"> | Date | string
  }

  export type SystemConfigOrderByWithRelationInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
  }

  export type SystemConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    key?: string
    AND?: SystemConfigWhereInput | SystemConfigWhereInput[]
    OR?: SystemConfigWhereInput[]
    NOT?: SystemConfigWhereInput | SystemConfigWhereInput[]
    value?: StringFilter<"SystemConfig"> | string
    updatedAt?: DateTimeFilter<"SystemConfig"> | Date | string
  }, "id" | "key">

  export type SystemConfigOrderByWithAggregationInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
    _count?: SystemConfigCountOrderByAggregateInput
    _max?: SystemConfigMaxOrderByAggregateInput
    _min?: SystemConfigMinOrderByAggregateInput
  }

  export type SystemConfigScalarWhereWithAggregatesInput = {
    AND?: SystemConfigScalarWhereWithAggregatesInput | SystemConfigScalarWhereWithAggregatesInput[]
    OR?: SystemConfigScalarWhereWithAggregatesInput[]
    NOT?: SystemConfigScalarWhereWithAggregatesInput | SystemConfigScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SystemConfig"> | string
    key?: StringWithAggregatesFilter<"SystemConfig"> | string
    value?: StringWithAggregatesFilter<"SystemConfig"> | string
    updatedAt?: DateTimeWithAggregatesFilter<"SystemConfig"> | Date | string
  }

  export type AdminSettingsWhereInput = {
    AND?: AdminSettingsWhereInput | AdminSettingsWhereInput[]
    OR?: AdminSettingsWhereInput[]
    NOT?: AdminSettingsWhereInput | AdminSettingsWhereInput[]
    id?: StringFilter<"AdminSettings"> | string
    adminEmail?: StringFilter<"AdminSettings"> | string
    dailyDigestEnabled?: BoolFilter<"AdminSettings"> | boolean
    dailyDigestTime?: StringFilter<"AdminSettings"> | string
    weeklyReportEnabled?: BoolFilter<"AdminSettings"> | boolean
    weeklyReportDay?: IntFilter<"AdminSettings"> | number
    weeklyReportTime?: StringFilter<"AdminSettings"> | string
    inProgressReportEnabled?: BoolFilter<"AdminSettings"> | boolean
    inProgressReportFrequency?: StringFilter<"AdminSettings"> | string
    taskReminderEnabled?: BoolFilter<"AdminSettings"> | boolean
    overdueReminderEnabled?: BoolFilter<"AdminSettings"> | boolean
    customReminderDates?: StringNullableFilter<"AdminSettings"> | string | null
    reminderDaysBefore?: IntFilter<"AdminSettings"> | number
    createdAt?: DateTimeFilter<"AdminSettings"> | Date | string
    updatedAt?: DateTimeFilter<"AdminSettings"> | Date | string
  }

  export type AdminSettingsOrderByWithRelationInput = {
    id?: SortOrder
    adminEmail?: SortOrder
    dailyDigestEnabled?: SortOrder
    dailyDigestTime?: SortOrder
    weeklyReportEnabled?: SortOrder
    weeklyReportDay?: SortOrder
    weeklyReportTime?: SortOrder
    inProgressReportEnabled?: SortOrder
    inProgressReportFrequency?: SortOrder
    taskReminderEnabled?: SortOrder
    overdueReminderEnabled?: SortOrder
    customReminderDates?: SortOrderInput | SortOrder
    reminderDaysBefore?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminSettingsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AdminSettingsWhereInput | AdminSettingsWhereInput[]
    OR?: AdminSettingsWhereInput[]
    NOT?: AdminSettingsWhereInput | AdminSettingsWhereInput[]
    adminEmail?: StringFilter<"AdminSettings"> | string
    dailyDigestEnabled?: BoolFilter<"AdminSettings"> | boolean
    dailyDigestTime?: StringFilter<"AdminSettings"> | string
    weeklyReportEnabled?: BoolFilter<"AdminSettings"> | boolean
    weeklyReportDay?: IntFilter<"AdminSettings"> | number
    weeklyReportTime?: StringFilter<"AdminSettings"> | string
    inProgressReportEnabled?: BoolFilter<"AdminSettings"> | boolean
    inProgressReportFrequency?: StringFilter<"AdminSettings"> | string
    taskReminderEnabled?: BoolFilter<"AdminSettings"> | boolean
    overdueReminderEnabled?: BoolFilter<"AdminSettings"> | boolean
    customReminderDates?: StringNullableFilter<"AdminSettings"> | string | null
    reminderDaysBefore?: IntFilter<"AdminSettings"> | number
    createdAt?: DateTimeFilter<"AdminSettings"> | Date | string
    updatedAt?: DateTimeFilter<"AdminSettings"> | Date | string
  }, "id">

  export type AdminSettingsOrderByWithAggregationInput = {
    id?: SortOrder
    adminEmail?: SortOrder
    dailyDigestEnabled?: SortOrder
    dailyDigestTime?: SortOrder
    weeklyReportEnabled?: SortOrder
    weeklyReportDay?: SortOrder
    weeklyReportTime?: SortOrder
    inProgressReportEnabled?: SortOrder
    inProgressReportFrequency?: SortOrder
    taskReminderEnabled?: SortOrder
    overdueReminderEnabled?: SortOrder
    customReminderDates?: SortOrderInput | SortOrder
    reminderDaysBefore?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AdminSettingsCountOrderByAggregateInput
    _avg?: AdminSettingsAvgOrderByAggregateInput
    _max?: AdminSettingsMaxOrderByAggregateInput
    _min?: AdminSettingsMinOrderByAggregateInput
    _sum?: AdminSettingsSumOrderByAggregateInput
  }

  export type AdminSettingsScalarWhereWithAggregatesInput = {
    AND?: AdminSettingsScalarWhereWithAggregatesInput | AdminSettingsScalarWhereWithAggregatesInput[]
    OR?: AdminSettingsScalarWhereWithAggregatesInput[]
    NOT?: AdminSettingsScalarWhereWithAggregatesInput | AdminSettingsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AdminSettings"> | string
    adminEmail?: StringWithAggregatesFilter<"AdminSettings"> | string
    dailyDigestEnabled?: BoolWithAggregatesFilter<"AdminSettings"> | boolean
    dailyDigestTime?: StringWithAggregatesFilter<"AdminSettings"> | string
    weeklyReportEnabled?: BoolWithAggregatesFilter<"AdminSettings"> | boolean
    weeklyReportDay?: IntWithAggregatesFilter<"AdminSettings"> | number
    weeklyReportTime?: StringWithAggregatesFilter<"AdminSettings"> | string
    inProgressReportEnabled?: BoolWithAggregatesFilter<"AdminSettings"> | boolean
    inProgressReportFrequency?: StringWithAggregatesFilter<"AdminSettings"> | string
    taskReminderEnabled?: BoolWithAggregatesFilter<"AdminSettings"> | boolean
    overdueReminderEnabled?: BoolWithAggregatesFilter<"AdminSettings"> | boolean
    customReminderDates?: StringNullableWithAggregatesFilter<"AdminSettings"> | string | null
    reminderDaysBefore?: IntWithAggregatesFilter<"AdminSettings"> | number
    createdAt?: DateTimeWithAggregatesFilter<"AdminSettings"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AdminSettings"> | Date | string
  }

  export type ScheduledReminderWhereInput = {
    AND?: ScheduledReminderWhereInput | ScheduledReminderWhereInput[]
    OR?: ScheduledReminderWhereInput[]
    NOT?: ScheduledReminderWhereInput | ScheduledReminderWhereInput[]
    id?: StringFilter<"ScheduledReminder"> | string
    title?: StringFilter<"ScheduledReminder"> | string
    description?: StringNullableFilter<"ScheduledReminder"> | string | null
    reminderDate?: DateTimeFilter<"ScheduledReminder"> | Date | string
    reminderTime?: StringFilter<"ScheduledReminder"> | string
    sendToAdmin?: BoolFilter<"ScheduledReminder"> | boolean
    sendToOwners?: BoolFilter<"ScheduledReminder"> | boolean
    taskIds?: StringNullableFilter<"ScheduledReminder"> | string | null
    isActive?: BoolFilter<"ScheduledReminder"> | boolean
    isSent?: BoolFilter<"ScheduledReminder"> | boolean
    sentAt?: DateTimeNullableFilter<"ScheduledReminder"> | Date | string | null
    emailsSent?: IntFilter<"ScheduledReminder"> | number
    emailsFailed?: IntFilter<"ScheduledReminder"> | number
    createdAt?: DateTimeFilter<"ScheduledReminder"> | Date | string
    updatedAt?: DateTimeFilter<"ScheduledReminder"> | Date | string
  }

  export type ScheduledReminderOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    reminderDate?: SortOrder
    reminderTime?: SortOrder
    sendToAdmin?: SortOrder
    sendToOwners?: SortOrder
    taskIds?: SortOrderInput | SortOrder
    isActive?: SortOrder
    isSent?: SortOrder
    sentAt?: SortOrderInput | SortOrder
    emailsSent?: SortOrder
    emailsFailed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ScheduledReminderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ScheduledReminderWhereInput | ScheduledReminderWhereInput[]
    OR?: ScheduledReminderWhereInput[]
    NOT?: ScheduledReminderWhereInput | ScheduledReminderWhereInput[]
    title?: StringFilter<"ScheduledReminder"> | string
    description?: StringNullableFilter<"ScheduledReminder"> | string | null
    reminderDate?: DateTimeFilter<"ScheduledReminder"> | Date | string
    reminderTime?: StringFilter<"ScheduledReminder"> | string
    sendToAdmin?: BoolFilter<"ScheduledReminder"> | boolean
    sendToOwners?: BoolFilter<"ScheduledReminder"> | boolean
    taskIds?: StringNullableFilter<"ScheduledReminder"> | string | null
    isActive?: BoolFilter<"ScheduledReminder"> | boolean
    isSent?: BoolFilter<"ScheduledReminder"> | boolean
    sentAt?: DateTimeNullableFilter<"ScheduledReminder"> | Date | string | null
    emailsSent?: IntFilter<"ScheduledReminder"> | number
    emailsFailed?: IntFilter<"ScheduledReminder"> | number
    createdAt?: DateTimeFilter<"ScheduledReminder"> | Date | string
    updatedAt?: DateTimeFilter<"ScheduledReminder"> | Date | string
  }, "id">

  export type ScheduledReminderOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    reminderDate?: SortOrder
    reminderTime?: SortOrder
    sendToAdmin?: SortOrder
    sendToOwners?: SortOrder
    taskIds?: SortOrderInput | SortOrder
    isActive?: SortOrder
    isSent?: SortOrder
    sentAt?: SortOrderInput | SortOrder
    emailsSent?: SortOrder
    emailsFailed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ScheduledReminderCountOrderByAggregateInput
    _avg?: ScheduledReminderAvgOrderByAggregateInput
    _max?: ScheduledReminderMaxOrderByAggregateInput
    _min?: ScheduledReminderMinOrderByAggregateInput
    _sum?: ScheduledReminderSumOrderByAggregateInput
  }

  export type ScheduledReminderScalarWhereWithAggregatesInput = {
    AND?: ScheduledReminderScalarWhereWithAggregatesInput | ScheduledReminderScalarWhereWithAggregatesInput[]
    OR?: ScheduledReminderScalarWhereWithAggregatesInput[]
    NOT?: ScheduledReminderScalarWhereWithAggregatesInput | ScheduledReminderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ScheduledReminder"> | string
    title?: StringWithAggregatesFilter<"ScheduledReminder"> | string
    description?: StringNullableWithAggregatesFilter<"ScheduledReminder"> | string | null
    reminderDate?: DateTimeWithAggregatesFilter<"ScheduledReminder"> | Date | string
    reminderTime?: StringWithAggregatesFilter<"ScheduledReminder"> | string
    sendToAdmin?: BoolWithAggregatesFilter<"ScheduledReminder"> | boolean
    sendToOwners?: BoolWithAggregatesFilter<"ScheduledReminder"> | boolean
    taskIds?: StringNullableWithAggregatesFilter<"ScheduledReminder"> | string | null
    isActive?: BoolWithAggregatesFilter<"ScheduledReminder"> | boolean
    isSent?: BoolWithAggregatesFilter<"ScheduledReminder"> | boolean
    sentAt?: DateTimeNullableWithAggregatesFilter<"ScheduledReminder"> | Date | string | null
    emailsSent?: IntWithAggregatesFilter<"ScheduledReminder"> | number
    emailsFailed?: IntWithAggregatesFilter<"ScheduledReminder"> | number
    createdAt?: DateTimeWithAggregatesFilter<"ScheduledReminder"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ScheduledReminder"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    username?: string | null
    name?: string | null
    role?: string
    department?: string | null
    phone?: string | null
    avatar?: string | null
    isActive?: boolean
    receiveTaskReminders?: boolean
    receiveDailyDigest?: boolean
    receiveWeeklyReport?: boolean
    reminderDaysBefore?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedTasks?: TaskCreateNestedManyWithoutOwnerInput
    assignedTasks?: TaskCreateNestedManyWithoutAssigneeInput
    auditLogs?: TaskAuditLogCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    contact?: ContactCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    username?: string | null
    name?: string | null
    role?: string
    department?: string | null
    phone?: string | null
    avatar?: string | null
    isActive?: boolean
    receiveTaskReminders?: boolean
    receiveDailyDigest?: boolean
    receiveWeeklyReport?: boolean
    reminderDaysBefore?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedTasks?: TaskUncheckedCreateNestedManyWithoutOwnerInput
    assignedTasks?: TaskUncheckedCreateNestedManyWithoutAssigneeInput
    auditLogs?: TaskAuditLogUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    contact?: ContactUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    receiveTaskReminders?: BoolFieldUpdateOperationsInput | boolean
    receiveDailyDigest?: BoolFieldUpdateOperationsInput | boolean
    receiveWeeklyReport?: BoolFieldUpdateOperationsInput | boolean
    reminderDaysBefore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedTasks?: TaskUpdateManyWithoutOwnerNestedInput
    assignedTasks?: TaskUpdateManyWithoutAssigneeNestedInput
    auditLogs?: TaskAuditLogUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    contact?: ContactUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    receiveTaskReminders?: BoolFieldUpdateOperationsInput | boolean
    receiveDailyDigest?: BoolFieldUpdateOperationsInput | boolean
    receiveWeeklyReport?: BoolFieldUpdateOperationsInput | boolean
    reminderDaysBefore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedTasks?: TaskUncheckedUpdateManyWithoutOwnerNestedInput
    assignedTasks?: TaskUncheckedUpdateManyWithoutAssigneeNestedInput
    auditLogs?: TaskAuditLogUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    contact?: ContactUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    username?: string | null
    name?: string | null
    role?: string
    department?: string | null
    phone?: string | null
    avatar?: string | null
    isActive?: boolean
    receiveTaskReminders?: boolean
    receiveDailyDigest?: boolean
    receiveWeeklyReport?: boolean
    reminderDaysBefore?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    receiveTaskReminders?: BoolFieldUpdateOperationsInput | boolean
    receiveDailyDigest?: BoolFieldUpdateOperationsInput | boolean
    receiveWeeklyReport?: BoolFieldUpdateOperationsInput | boolean
    reminderDaysBefore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    receiveTaskReminders?: BoolFieldUpdateOperationsInput | boolean
    receiveDailyDigest?: BoolFieldUpdateOperationsInput | boolean
    receiveWeeklyReport?: BoolFieldUpdateOperationsInput | boolean
    reminderDaysBefore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskCreateInput = {
    id?: string
    taskId?: string | null
    title: string
    description?: string | null
    sentdmMessageId?: string | null
    lastReminderSentAt?: Date | string | null
    department?: string | null
    priority?: string
    status?: string
    strategicPillar?: string | null
    completion?: number
    riskIndicator?: string | null
    startDate?: Date | string | null
    dueDate?: Date | string | null
    completedAt?: Date | string | null
    notes?: string | null
    nextStep?: string | null
    ceoNotes?: string | null
    sourceMonth?: string | null
    source?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    owner?: UserCreateNestedOneWithoutOwnedTasksInput
    assignee?: UserCreateNestedOneWithoutAssignedTasksInput
    dataSource?: DataSourceCreateNestedOneWithoutTasksInput
    auditLogs?: TaskAuditLogCreateNestedManyWithoutTaskInput
    notifications?: NotificationCreateNestedManyWithoutTaskInput
    updates?: TaskUpdateCreateNestedManyWithoutTaskInput
  }

  export type TaskUncheckedCreateInput = {
    id?: string
    taskId?: string | null
    title: string
    description?: string | null
    sentdmMessageId?: string | null
    lastReminderSentAt?: Date | string | null
    ownerId?: string | null
    assigneeId?: string | null
    department?: string | null
    priority?: string
    status?: string
    strategicPillar?: string | null
    completion?: number
    riskIndicator?: string | null
    startDate?: Date | string | null
    dueDate?: Date | string | null
    completedAt?: Date | string | null
    notes?: string | null
    nextStep?: string | null
    ceoNotes?: string | null
    sourceMonth?: string | null
    source?: string | null
    dataSourceId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    auditLogs?: TaskAuditLogUncheckedCreateNestedManyWithoutTaskInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutTaskInput
    updates?: TaskUpdateUncheckedCreateNestedManyWithoutTaskInput
  }

  export type TaskUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sentdmMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    lastReminderSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    strategicPillar?: NullableStringFieldUpdateOperationsInput | string | null
    completion?: FloatFieldUpdateOperationsInput | number
    riskIndicator?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    nextStep?: NullableStringFieldUpdateOperationsInput | string | null
    ceoNotes?: NullableStringFieldUpdateOperationsInput | string | null
    sourceMonth?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneWithoutOwnedTasksNestedInput
    assignee?: UserUpdateOneWithoutAssignedTasksNestedInput
    dataSource?: DataSourceUpdateOneWithoutTasksNestedInput
    auditLogs?: TaskAuditLogUpdateManyWithoutTaskNestedInput
    notifications?: NotificationUpdateManyWithoutTaskNestedInput
    updates?: TaskUpdateUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sentdmMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    lastReminderSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    assigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    strategicPillar?: NullableStringFieldUpdateOperationsInput | string | null
    completion?: FloatFieldUpdateOperationsInput | number
    riskIndicator?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    nextStep?: NullableStringFieldUpdateOperationsInput | string | null
    ceoNotes?: NullableStringFieldUpdateOperationsInput | string | null
    sourceMonth?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    dataSourceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditLogs?: TaskAuditLogUncheckedUpdateManyWithoutTaskNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutTaskNestedInput
    updates?: TaskUpdateUncheckedUpdateManyWithoutTaskNestedInput
  }

  export type TaskCreateManyInput = {
    id?: string
    taskId?: string | null
    title: string
    description?: string | null
    sentdmMessageId?: string | null
    lastReminderSentAt?: Date | string | null
    ownerId?: string | null
    assigneeId?: string | null
    department?: string | null
    priority?: string
    status?: string
    strategicPillar?: string | null
    completion?: number
    riskIndicator?: string | null
    startDate?: Date | string | null
    dueDate?: Date | string | null
    completedAt?: Date | string | null
    notes?: string | null
    nextStep?: string | null
    ceoNotes?: string | null
    sourceMonth?: string | null
    source?: string | null
    dataSourceId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sentdmMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    lastReminderSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    strategicPillar?: NullableStringFieldUpdateOperationsInput | string | null
    completion?: FloatFieldUpdateOperationsInput | number
    riskIndicator?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    nextStep?: NullableStringFieldUpdateOperationsInput | string | null
    ceoNotes?: NullableStringFieldUpdateOperationsInput | string | null
    sourceMonth?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sentdmMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    lastReminderSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    assigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    strategicPillar?: NullableStringFieldUpdateOperationsInput | string | null
    completion?: FloatFieldUpdateOperationsInput | number
    riskIndicator?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    nextStep?: NullableStringFieldUpdateOperationsInput | string | null
    ceoNotes?: NullableStringFieldUpdateOperationsInput | string | null
    sourceMonth?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    dataSourceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContactCreateInput = {
    id?: string
    name: string
    phone?: string | null
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutContactInput
  }

  export type ContactUncheckedCreateInput = {
    id?: string
    name: string
    phone?: string | null
    email?: string | null
    userId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ContactUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutContactNestedInput
  }

  export type ContactUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContactCreateManyInput = {
    id?: string
    name: string
    phone?: string | null
    email?: string | null
    userId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ContactUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContactUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUpdateCreateInput = {
    id?: string
    source: string
    content: string
    createdAt?: Date | string
    task: TaskCreateNestedOneWithoutUpdatesInput
  }

  export type TaskUpdateUncheckedCreateInput = {
    id?: string
    taskId: string
    source: string
    content: string
    createdAt?: Date | string
  }

  export type TaskUpdateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    task?: TaskUpdateOneRequiredWithoutUpdatesNestedInput
  }

  export type TaskUpdateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUpdateCreateManyInput = {
    id?: string
    taskId: string
    source: string
    content: string
    createdAt?: Date | string
  }

  export type TaskUpdateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUpdateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskAuditLogCreateInput = {
    id?: string
    action: string
    field?: string | null
    oldValue?: string | null
    newValue?: string | null
    createdAt?: Date | string
    task: TaskCreateNestedOneWithoutAuditLogsInput
    user?: UserCreateNestedOneWithoutAuditLogsInput
  }

  export type TaskAuditLogUncheckedCreateInput = {
    id?: string
    taskId: string
    userId?: string | null
    action: string
    field?: string | null
    oldValue?: string | null
    newValue?: string | null
    createdAt?: Date | string
  }

  export type TaskAuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    field?: NullableStringFieldUpdateOperationsInput | string | null
    oldValue?: NullableStringFieldUpdateOperationsInput | string | null
    newValue?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    task?: TaskUpdateOneRequiredWithoutAuditLogsNestedInput
    user?: UserUpdateOneWithoutAuditLogsNestedInput
  }

  export type TaskAuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    field?: NullableStringFieldUpdateOperationsInput | string | null
    oldValue?: NullableStringFieldUpdateOperationsInput | string | null
    newValue?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskAuditLogCreateManyInput = {
    id?: string
    taskId: string
    userId?: string | null
    action: string
    field?: string | null
    oldValue?: string | null
    newValue?: string | null
    createdAt?: Date | string
  }

  export type TaskAuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    field?: NullableStringFieldUpdateOperationsInput | string | null
    oldValue?: NullableStringFieldUpdateOperationsInput | string | null
    newValue?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskAuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    field?: NullableStringFieldUpdateOperationsInput | string | null
    oldValue?: NullableStringFieldUpdateOperationsInput | string | null
    newValue?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DataSourceCreateInput = {
    id?: string
    fileName: string
    originalName: string
    fileSize: number
    rowCount: number
    columnMapping?: string | null
    uploadedById?: string | null
    uploadedAt?: Date | string
    tasks?: TaskCreateNestedManyWithoutDataSourceInput
  }

  export type DataSourceUncheckedCreateInput = {
    id?: string
    fileName: string
    originalName: string
    fileSize: number
    rowCount: number
    columnMapping?: string | null
    uploadedById?: string | null
    uploadedAt?: Date | string
    tasks?: TaskUncheckedCreateNestedManyWithoutDataSourceInput
  }

  export type DataSourceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    rowCount?: IntFieldUpdateOperationsInput | number
    columnMapping?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedById?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: TaskUpdateManyWithoutDataSourceNestedInput
  }

  export type DataSourceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    rowCount?: IntFieldUpdateOperationsInput | number
    columnMapping?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedById?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: TaskUncheckedUpdateManyWithoutDataSourceNestedInput
  }

  export type DataSourceCreateManyInput = {
    id?: string
    fileName: string
    originalName: string
    fileSize: number
    rowCount: number
    columnMapping?: string | null
    uploadedById?: string | null
    uploadedAt?: Date | string
  }

  export type DataSourceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    rowCount?: IntFieldUpdateOperationsInput | number
    columnMapping?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedById?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DataSourceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    rowCount?: IntFieldUpdateOperationsInput | number
    columnMapping?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedById?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateInput = {
    id?: string
    type: string
    channel: string
    subject: string
    message: string
    status?: string
    scheduledAt?: Date | string | null
    sentAt?: Date | string | null
    error?: string | null
    createdAt?: Date | string
    task?: TaskCreateNestedOneWithoutNotificationsInput
    user?: UserCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateInput = {
    id?: string
    taskId?: string | null
    userId?: string | null
    type: string
    channel: string
    subject: string
    message: string
    status?: string
    scheduledAt?: Date | string | null
    sentAt?: Date | string | null
    error?: string | null
    createdAt?: Date | string
  }

  export type NotificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    task?: TaskUpdateOneWithoutNotificationsNestedInput
    user?: UserUpdateOneWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateManyInput = {
    id?: string
    taskId?: string | null
    userId?: string | null
    type: string
    channel: string
    subject: string
    message: string
    status?: string
    scheduledAt?: Date | string | null
    sentAt?: Date | string | null
    error?: string | null
    createdAt?: Date | string
  }

  export type NotificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationRuleCreateInput = {
    id?: string
    name: string
    type: string
    channel?: string
    daysBeforeDue?: number | null
    notifyOwner?: boolean
    notifyAssignee?: boolean
    notifyManager?: boolean
    subjectTemplate?: string | null
    bodyTemplate?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationRuleUncheckedCreateInput = {
    id?: string
    name: string
    type: string
    channel?: string
    daysBeforeDue?: number | null
    notifyOwner?: boolean
    notifyAssignee?: boolean
    notifyManager?: boolean
    subjectTemplate?: string | null
    bodyTemplate?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationRuleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    daysBeforeDue?: NullableIntFieldUpdateOperationsInput | number | null
    notifyOwner?: BoolFieldUpdateOperationsInput | boolean
    notifyAssignee?: BoolFieldUpdateOperationsInput | boolean
    notifyManager?: BoolFieldUpdateOperationsInput | boolean
    subjectTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    bodyTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationRuleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    daysBeforeDue?: NullableIntFieldUpdateOperationsInput | number | null
    notifyOwner?: BoolFieldUpdateOperationsInput | boolean
    notifyAssignee?: BoolFieldUpdateOperationsInput | boolean
    notifyManager?: BoolFieldUpdateOperationsInput | boolean
    subjectTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    bodyTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationRuleCreateManyInput = {
    id?: string
    name: string
    type: string
    channel?: string
    daysBeforeDue?: number | null
    notifyOwner?: boolean
    notifyAssignee?: boolean
    notifyManager?: boolean
    subjectTemplate?: string | null
    bodyTemplate?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationRuleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    daysBeforeDue?: NullableIntFieldUpdateOperationsInput | number | null
    notifyOwner?: BoolFieldUpdateOperationsInput | boolean
    notifyAssignee?: BoolFieldUpdateOperationsInput | boolean
    notifyManager?: BoolFieldUpdateOperationsInput | boolean
    subjectTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    bodyTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationRuleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    daysBeforeDue?: NullableIntFieldUpdateOperationsInput | number | null
    notifyOwner?: BoolFieldUpdateOperationsInput | boolean
    notifyAssignee?: BoolFieldUpdateOperationsInput | boolean
    notifyManager?: BoolFieldUpdateOperationsInput | boolean
    subjectTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    bodyTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemConfigCreateInput = {
    id?: string
    key: string
    value: string
    updatedAt?: Date | string
  }

  export type SystemConfigUncheckedCreateInput = {
    id?: string
    key: string
    value: string
    updatedAt?: Date | string
  }

  export type SystemConfigUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemConfigUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemConfigCreateManyInput = {
    id?: string
    key: string
    value: string
    updatedAt?: Date | string
  }

  export type SystemConfigUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemConfigUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminSettingsCreateInput = {
    id?: string
    adminEmail: string
    dailyDigestEnabled?: boolean
    dailyDigestTime?: string
    weeklyReportEnabled?: boolean
    weeklyReportDay?: number
    weeklyReportTime?: string
    inProgressReportEnabled?: boolean
    inProgressReportFrequency?: string
    taskReminderEnabled?: boolean
    overdueReminderEnabled?: boolean
    customReminderDates?: string | null
    reminderDaysBefore?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AdminSettingsUncheckedCreateInput = {
    id?: string
    adminEmail: string
    dailyDigestEnabled?: boolean
    dailyDigestTime?: string
    weeklyReportEnabled?: boolean
    weeklyReportDay?: number
    weeklyReportTime?: string
    inProgressReportEnabled?: boolean
    inProgressReportFrequency?: string
    taskReminderEnabled?: boolean
    overdueReminderEnabled?: boolean
    customReminderDates?: string | null
    reminderDaysBefore?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AdminSettingsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    dailyDigestEnabled?: BoolFieldUpdateOperationsInput | boolean
    dailyDigestTime?: StringFieldUpdateOperationsInput | string
    weeklyReportEnabled?: BoolFieldUpdateOperationsInput | boolean
    weeklyReportDay?: IntFieldUpdateOperationsInput | number
    weeklyReportTime?: StringFieldUpdateOperationsInput | string
    inProgressReportEnabled?: BoolFieldUpdateOperationsInput | boolean
    inProgressReportFrequency?: StringFieldUpdateOperationsInput | string
    taskReminderEnabled?: BoolFieldUpdateOperationsInput | boolean
    overdueReminderEnabled?: BoolFieldUpdateOperationsInput | boolean
    customReminderDates?: NullableStringFieldUpdateOperationsInput | string | null
    reminderDaysBefore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminSettingsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    dailyDigestEnabled?: BoolFieldUpdateOperationsInput | boolean
    dailyDigestTime?: StringFieldUpdateOperationsInput | string
    weeklyReportEnabled?: BoolFieldUpdateOperationsInput | boolean
    weeklyReportDay?: IntFieldUpdateOperationsInput | number
    weeklyReportTime?: StringFieldUpdateOperationsInput | string
    inProgressReportEnabled?: BoolFieldUpdateOperationsInput | boolean
    inProgressReportFrequency?: StringFieldUpdateOperationsInput | string
    taskReminderEnabled?: BoolFieldUpdateOperationsInput | boolean
    overdueReminderEnabled?: BoolFieldUpdateOperationsInput | boolean
    customReminderDates?: NullableStringFieldUpdateOperationsInput | string | null
    reminderDaysBefore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminSettingsCreateManyInput = {
    id?: string
    adminEmail: string
    dailyDigestEnabled?: boolean
    dailyDigestTime?: string
    weeklyReportEnabled?: boolean
    weeklyReportDay?: number
    weeklyReportTime?: string
    inProgressReportEnabled?: boolean
    inProgressReportFrequency?: string
    taskReminderEnabled?: boolean
    overdueReminderEnabled?: boolean
    customReminderDates?: string | null
    reminderDaysBefore?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AdminSettingsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    dailyDigestEnabled?: BoolFieldUpdateOperationsInput | boolean
    dailyDigestTime?: StringFieldUpdateOperationsInput | string
    weeklyReportEnabled?: BoolFieldUpdateOperationsInput | boolean
    weeklyReportDay?: IntFieldUpdateOperationsInput | number
    weeklyReportTime?: StringFieldUpdateOperationsInput | string
    inProgressReportEnabled?: BoolFieldUpdateOperationsInput | boolean
    inProgressReportFrequency?: StringFieldUpdateOperationsInput | string
    taskReminderEnabled?: BoolFieldUpdateOperationsInput | boolean
    overdueReminderEnabled?: BoolFieldUpdateOperationsInput | boolean
    customReminderDates?: NullableStringFieldUpdateOperationsInput | string | null
    reminderDaysBefore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminSettingsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    dailyDigestEnabled?: BoolFieldUpdateOperationsInput | boolean
    dailyDigestTime?: StringFieldUpdateOperationsInput | string
    weeklyReportEnabled?: BoolFieldUpdateOperationsInput | boolean
    weeklyReportDay?: IntFieldUpdateOperationsInput | number
    weeklyReportTime?: StringFieldUpdateOperationsInput | string
    inProgressReportEnabled?: BoolFieldUpdateOperationsInput | boolean
    inProgressReportFrequency?: StringFieldUpdateOperationsInput | string
    taskReminderEnabled?: BoolFieldUpdateOperationsInput | boolean
    overdueReminderEnabled?: BoolFieldUpdateOperationsInput | boolean
    customReminderDates?: NullableStringFieldUpdateOperationsInput | string | null
    reminderDaysBefore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScheduledReminderCreateInput = {
    id?: string
    title: string
    description?: string | null
    reminderDate: Date | string
    reminderTime?: string
    sendToAdmin?: boolean
    sendToOwners?: boolean
    taskIds?: string | null
    isActive?: boolean
    isSent?: boolean
    sentAt?: Date | string | null
    emailsSent?: number
    emailsFailed?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScheduledReminderUncheckedCreateInput = {
    id?: string
    title: string
    description?: string | null
    reminderDate: Date | string
    reminderTime?: string
    sendToAdmin?: boolean
    sendToOwners?: boolean
    taskIds?: string | null
    isActive?: boolean
    isSent?: boolean
    sentAt?: Date | string | null
    emailsSent?: number
    emailsFailed?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScheduledReminderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    reminderDate?: DateTimeFieldUpdateOperationsInput | Date | string
    reminderTime?: StringFieldUpdateOperationsInput | string
    sendToAdmin?: BoolFieldUpdateOperationsInput | boolean
    sendToOwners?: BoolFieldUpdateOperationsInput | boolean
    taskIds?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isSent?: BoolFieldUpdateOperationsInput | boolean
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailsSent?: IntFieldUpdateOperationsInput | number
    emailsFailed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScheduledReminderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    reminderDate?: DateTimeFieldUpdateOperationsInput | Date | string
    reminderTime?: StringFieldUpdateOperationsInput | string
    sendToAdmin?: BoolFieldUpdateOperationsInput | boolean
    sendToOwners?: BoolFieldUpdateOperationsInput | boolean
    taskIds?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isSent?: BoolFieldUpdateOperationsInput | boolean
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailsSent?: IntFieldUpdateOperationsInput | number
    emailsFailed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScheduledReminderCreateManyInput = {
    id?: string
    title: string
    description?: string | null
    reminderDate: Date | string
    reminderTime?: string
    sendToAdmin?: boolean
    sendToOwners?: boolean
    taskIds?: string | null
    isActive?: boolean
    isSent?: boolean
    sentAt?: Date | string | null
    emailsSent?: number
    emailsFailed?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScheduledReminderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    reminderDate?: DateTimeFieldUpdateOperationsInput | Date | string
    reminderTime?: StringFieldUpdateOperationsInput | string
    sendToAdmin?: BoolFieldUpdateOperationsInput | boolean
    sendToOwners?: BoolFieldUpdateOperationsInput | boolean
    taskIds?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isSent?: BoolFieldUpdateOperationsInput | boolean
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailsSent?: IntFieldUpdateOperationsInput | number
    emailsFailed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScheduledReminderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    reminderDate?: DateTimeFieldUpdateOperationsInput | Date | string
    reminderTime?: StringFieldUpdateOperationsInput | string
    sendToAdmin?: BoolFieldUpdateOperationsInput | boolean
    sendToOwners?: BoolFieldUpdateOperationsInput | boolean
    taskIds?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isSent?: BoolFieldUpdateOperationsInput | boolean
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailsSent?: IntFieldUpdateOperationsInput | number
    emailsFailed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type TaskListRelationFilter = {
    every?: TaskWhereInput
    some?: TaskWhereInput
    none?: TaskWhereInput
  }

  export type TaskAuditLogListRelationFilter = {
    every?: TaskAuditLogWhereInput
    some?: TaskAuditLogWhereInput
    none?: TaskAuditLogWhereInput
  }

  export type NotificationListRelationFilter = {
    every?: NotificationWhereInput
    some?: NotificationWhereInput
    none?: NotificationWhereInput
  }

  export type ContactNullableScalarRelationFilter = {
    is?: ContactWhereInput | null
    isNot?: ContactWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TaskOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TaskAuditLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NotificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    name?: SortOrder
    role?: SortOrder
    department?: SortOrder
    phone?: SortOrder
    avatar?: SortOrder
    isActive?: SortOrder
    receiveTaskReminders?: SortOrder
    receiveDailyDigest?: SortOrder
    receiveWeeklyReport?: SortOrder
    reminderDaysBefore?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    reminderDaysBefore?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    name?: SortOrder
    role?: SortOrder
    department?: SortOrder
    phone?: SortOrder
    avatar?: SortOrder
    isActive?: SortOrder
    receiveTaskReminders?: SortOrder
    receiveDailyDigest?: SortOrder
    receiveWeeklyReport?: SortOrder
    reminderDaysBefore?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    name?: SortOrder
    role?: SortOrder
    department?: SortOrder
    phone?: SortOrder
    avatar?: SortOrder
    isActive?: SortOrder
    receiveTaskReminders?: SortOrder
    receiveDailyDigest?: SortOrder
    receiveWeeklyReport?: SortOrder
    reminderDaysBefore?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    reminderDaysBefore?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type DataSourceNullableScalarRelationFilter = {
    is?: DataSourceWhereInput | null
    isNot?: DataSourceWhereInput | null
  }

  export type TaskUpdateListRelationFilter = {
    every?: TaskUpdateWhereInput
    some?: TaskUpdateWhereInput
    none?: TaskUpdateWhereInput
  }

  export type TaskUpdateOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TaskCountOrderByAggregateInput = {
    id?: SortOrder
    taskId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    sentdmMessageId?: SortOrder
    lastReminderSentAt?: SortOrder
    ownerId?: SortOrder
    assigneeId?: SortOrder
    department?: SortOrder
    priority?: SortOrder
    status?: SortOrder
    strategicPillar?: SortOrder
    completion?: SortOrder
    riskIndicator?: SortOrder
    startDate?: SortOrder
    dueDate?: SortOrder
    completedAt?: SortOrder
    notes?: SortOrder
    nextStep?: SortOrder
    ceoNotes?: SortOrder
    sourceMonth?: SortOrder
    source?: SortOrder
    dataSourceId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TaskAvgOrderByAggregateInput = {
    completion?: SortOrder
  }

  export type TaskMaxOrderByAggregateInput = {
    id?: SortOrder
    taskId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    sentdmMessageId?: SortOrder
    lastReminderSentAt?: SortOrder
    ownerId?: SortOrder
    assigneeId?: SortOrder
    department?: SortOrder
    priority?: SortOrder
    status?: SortOrder
    strategicPillar?: SortOrder
    completion?: SortOrder
    riskIndicator?: SortOrder
    startDate?: SortOrder
    dueDate?: SortOrder
    completedAt?: SortOrder
    notes?: SortOrder
    nextStep?: SortOrder
    ceoNotes?: SortOrder
    sourceMonth?: SortOrder
    source?: SortOrder
    dataSourceId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TaskMinOrderByAggregateInput = {
    id?: SortOrder
    taskId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    sentdmMessageId?: SortOrder
    lastReminderSentAt?: SortOrder
    ownerId?: SortOrder
    assigneeId?: SortOrder
    department?: SortOrder
    priority?: SortOrder
    status?: SortOrder
    strategicPillar?: SortOrder
    completion?: SortOrder
    riskIndicator?: SortOrder
    startDate?: SortOrder
    dueDate?: SortOrder
    completedAt?: SortOrder
    notes?: SortOrder
    nextStep?: SortOrder
    ceoNotes?: SortOrder
    sourceMonth?: SortOrder
    source?: SortOrder
    dataSourceId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TaskSumOrderByAggregateInput = {
    completion?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type ContactCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ContactMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ContactMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TaskScalarRelationFilter = {
    is?: TaskWhereInput
    isNot?: TaskWhereInput
  }

  export type TaskUpdateCountOrderByAggregateInput = {
    id?: SortOrder
    taskId?: SortOrder
    source?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }

  export type TaskUpdateMaxOrderByAggregateInput = {
    id?: SortOrder
    taskId?: SortOrder
    source?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }

  export type TaskUpdateMinOrderByAggregateInput = {
    id?: SortOrder
    taskId?: SortOrder
    source?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }

  export type TaskAuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    taskId?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    field?: SortOrder
    oldValue?: SortOrder
    newValue?: SortOrder
    createdAt?: SortOrder
  }

  export type TaskAuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    taskId?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    field?: SortOrder
    oldValue?: SortOrder
    newValue?: SortOrder
    createdAt?: SortOrder
  }

  export type TaskAuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    taskId?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    field?: SortOrder
    oldValue?: SortOrder
    newValue?: SortOrder
    createdAt?: SortOrder
  }

  export type DataSourceCountOrderByAggregateInput = {
    id?: SortOrder
    fileName?: SortOrder
    originalName?: SortOrder
    fileSize?: SortOrder
    rowCount?: SortOrder
    columnMapping?: SortOrder
    uploadedById?: SortOrder
    uploadedAt?: SortOrder
  }

  export type DataSourceAvgOrderByAggregateInput = {
    fileSize?: SortOrder
    rowCount?: SortOrder
  }

  export type DataSourceMaxOrderByAggregateInput = {
    id?: SortOrder
    fileName?: SortOrder
    originalName?: SortOrder
    fileSize?: SortOrder
    rowCount?: SortOrder
    columnMapping?: SortOrder
    uploadedById?: SortOrder
    uploadedAt?: SortOrder
  }

  export type DataSourceMinOrderByAggregateInput = {
    id?: SortOrder
    fileName?: SortOrder
    originalName?: SortOrder
    fileSize?: SortOrder
    rowCount?: SortOrder
    columnMapping?: SortOrder
    uploadedById?: SortOrder
    uploadedAt?: SortOrder
  }

  export type DataSourceSumOrderByAggregateInput = {
    fileSize?: SortOrder
    rowCount?: SortOrder
  }

  export type TaskNullableScalarRelationFilter = {
    is?: TaskWhereInput | null
    isNot?: TaskWhereInput | null
  }

  export type NotificationCountOrderByAggregateInput = {
    id?: SortOrder
    taskId?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    channel?: SortOrder
    subject?: SortOrder
    message?: SortOrder
    status?: SortOrder
    scheduledAt?: SortOrder
    sentAt?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    taskId?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    channel?: SortOrder
    subject?: SortOrder
    message?: SortOrder
    status?: SortOrder
    scheduledAt?: SortOrder
    sentAt?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationMinOrderByAggregateInput = {
    id?: SortOrder
    taskId?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    channel?: SortOrder
    subject?: SortOrder
    message?: SortOrder
    status?: SortOrder
    scheduledAt?: SortOrder
    sentAt?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NotificationRuleCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    channel?: SortOrder
    daysBeforeDue?: SortOrder
    notifyOwner?: SortOrder
    notifyAssignee?: SortOrder
    notifyManager?: SortOrder
    subjectTemplate?: SortOrder
    bodyTemplate?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NotificationRuleAvgOrderByAggregateInput = {
    daysBeforeDue?: SortOrder
  }

  export type NotificationRuleMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    channel?: SortOrder
    daysBeforeDue?: SortOrder
    notifyOwner?: SortOrder
    notifyAssignee?: SortOrder
    notifyManager?: SortOrder
    subjectTemplate?: SortOrder
    bodyTemplate?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NotificationRuleMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    channel?: SortOrder
    daysBeforeDue?: SortOrder
    notifyOwner?: SortOrder
    notifyAssignee?: SortOrder
    notifyManager?: SortOrder
    subjectTemplate?: SortOrder
    bodyTemplate?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NotificationRuleSumOrderByAggregateInput = {
    daysBeforeDue?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type SystemConfigCountOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
  }

  export type SystemConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
  }

  export type SystemConfigMinOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminSettingsCountOrderByAggregateInput = {
    id?: SortOrder
    adminEmail?: SortOrder
    dailyDigestEnabled?: SortOrder
    dailyDigestTime?: SortOrder
    weeklyReportEnabled?: SortOrder
    weeklyReportDay?: SortOrder
    weeklyReportTime?: SortOrder
    inProgressReportEnabled?: SortOrder
    inProgressReportFrequency?: SortOrder
    taskReminderEnabled?: SortOrder
    overdueReminderEnabled?: SortOrder
    customReminderDates?: SortOrder
    reminderDaysBefore?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminSettingsAvgOrderByAggregateInput = {
    weeklyReportDay?: SortOrder
    reminderDaysBefore?: SortOrder
  }

  export type AdminSettingsMaxOrderByAggregateInput = {
    id?: SortOrder
    adminEmail?: SortOrder
    dailyDigestEnabled?: SortOrder
    dailyDigestTime?: SortOrder
    weeklyReportEnabled?: SortOrder
    weeklyReportDay?: SortOrder
    weeklyReportTime?: SortOrder
    inProgressReportEnabled?: SortOrder
    inProgressReportFrequency?: SortOrder
    taskReminderEnabled?: SortOrder
    overdueReminderEnabled?: SortOrder
    customReminderDates?: SortOrder
    reminderDaysBefore?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminSettingsMinOrderByAggregateInput = {
    id?: SortOrder
    adminEmail?: SortOrder
    dailyDigestEnabled?: SortOrder
    dailyDigestTime?: SortOrder
    weeklyReportEnabled?: SortOrder
    weeklyReportDay?: SortOrder
    weeklyReportTime?: SortOrder
    inProgressReportEnabled?: SortOrder
    inProgressReportFrequency?: SortOrder
    taskReminderEnabled?: SortOrder
    overdueReminderEnabled?: SortOrder
    customReminderDates?: SortOrder
    reminderDaysBefore?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminSettingsSumOrderByAggregateInput = {
    weeklyReportDay?: SortOrder
    reminderDaysBefore?: SortOrder
  }

  export type ScheduledReminderCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    reminderDate?: SortOrder
    reminderTime?: SortOrder
    sendToAdmin?: SortOrder
    sendToOwners?: SortOrder
    taskIds?: SortOrder
    isActive?: SortOrder
    isSent?: SortOrder
    sentAt?: SortOrder
    emailsSent?: SortOrder
    emailsFailed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ScheduledReminderAvgOrderByAggregateInput = {
    emailsSent?: SortOrder
    emailsFailed?: SortOrder
  }

  export type ScheduledReminderMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    reminderDate?: SortOrder
    reminderTime?: SortOrder
    sendToAdmin?: SortOrder
    sendToOwners?: SortOrder
    taskIds?: SortOrder
    isActive?: SortOrder
    isSent?: SortOrder
    sentAt?: SortOrder
    emailsSent?: SortOrder
    emailsFailed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ScheduledReminderMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    reminderDate?: SortOrder
    reminderTime?: SortOrder
    sendToAdmin?: SortOrder
    sendToOwners?: SortOrder
    taskIds?: SortOrder
    isActive?: SortOrder
    isSent?: SortOrder
    sentAt?: SortOrder
    emailsSent?: SortOrder
    emailsFailed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ScheduledReminderSumOrderByAggregateInput = {
    emailsSent?: SortOrder
    emailsFailed?: SortOrder
  }

  export type TaskCreateNestedManyWithoutOwnerInput = {
    create?: XOR<TaskCreateWithoutOwnerInput, TaskUncheckedCreateWithoutOwnerInput> | TaskCreateWithoutOwnerInput[] | TaskUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutOwnerInput | TaskCreateOrConnectWithoutOwnerInput[]
    createMany?: TaskCreateManyOwnerInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type TaskCreateNestedManyWithoutAssigneeInput = {
    create?: XOR<TaskCreateWithoutAssigneeInput, TaskUncheckedCreateWithoutAssigneeInput> | TaskCreateWithoutAssigneeInput[] | TaskUncheckedCreateWithoutAssigneeInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutAssigneeInput | TaskCreateOrConnectWithoutAssigneeInput[]
    createMany?: TaskCreateManyAssigneeInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type TaskAuditLogCreateNestedManyWithoutUserInput = {
    create?: XOR<TaskAuditLogCreateWithoutUserInput, TaskAuditLogUncheckedCreateWithoutUserInput> | TaskAuditLogCreateWithoutUserInput[] | TaskAuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TaskAuditLogCreateOrConnectWithoutUserInput | TaskAuditLogCreateOrConnectWithoutUserInput[]
    createMany?: TaskAuditLogCreateManyUserInputEnvelope
    connect?: TaskAuditLogWhereUniqueInput | TaskAuditLogWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type ContactCreateNestedOneWithoutUserInput = {
    create?: XOR<ContactCreateWithoutUserInput, ContactUncheckedCreateWithoutUserInput>
    connectOrCreate?: ContactCreateOrConnectWithoutUserInput
    connect?: ContactWhereUniqueInput
  }

  export type TaskUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<TaskCreateWithoutOwnerInput, TaskUncheckedCreateWithoutOwnerInput> | TaskCreateWithoutOwnerInput[] | TaskUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutOwnerInput | TaskCreateOrConnectWithoutOwnerInput[]
    createMany?: TaskCreateManyOwnerInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type TaskUncheckedCreateNestedManyWithoutAssigneeInput = {
    create?: XOR<TaskCreateWithoutAssigneeInput, TaskUncheckedCreateWithoutAssigneeInput> | TaskCreateWithoutAssigneeInput[] | TaskUncheckedCreateWithoutAssigneeInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutAssigneeInput | TaskCreateOrConnectWithoutAssigneeInput[]
    createMany?: TaskCreateManyAssigneeInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type TaskAuditLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TaskAuditLogCreateWithoutUserInput, TaskAuditLogUncheckedCreateWithoutUserInput> | TaskAuditLogCreateWithoutUserInput[] | TaskAuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TaskAuditLogCreateOrConnectWithoutUserInput | TaskAuditLogCreateOrConnectWithoutUserInput[]
    createMany?: TaskAuditLogCreateManyUserInputEnvelope
    connect?: TaskAuditLogWhereUniqueInput | TaskAuditLogWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type ContactUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<ContactCreateWithoutUserInput, ContactUncheckedCreateWithoutUserInput>
    connectOrCreate?: ContactCreateOrConnectWithoutUserInput
    connect?: ContactWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type TaskUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<TaskCreateWithoutOwnerInput, TaskUncheckedCreateWithoutOwnerInput> | TaskCreateWithoutOwnerInput[] | TaskUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutOwnerInput | TaskCreateOrConnectWithoutOwnerInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutOwnerInput | TaskUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: TaskCreateManyOwnerInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutOwnerInput | TaskUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutOwnerInput | TaskUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type TaskUpdateManyWithoutAssigneeNestedInput = {
    create?: XOR<TaskCreateWithoutAssigneeInput, TaskUncheckedCreateWithoutAssigneeInput> | TaskCreateWithoutAssigneeInput[] | TaskUncheckedCreateWithoutAssigneeInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutAssigneeInput | TaskCreateOrConnectWithoutAssigneeInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutAssigneeInput | TaskUpsertWithWhereUniqueWithoutAssigneeInput[]
    createMany?: TaskCreateManyAssigneeInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutAssigneeInput | TaskUpdateWithWhereUniqueWithoutAssigneeInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutAssigneeInput | TaskUpdateManyWithWhereWithoutAssigneeInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type TaskAuditLogUpdateManyWithoutUserNestedInput = {
    create?: XOR<TaskAuditLogCreateWithoutUserInput, TaskAuditLogUncheckedCreateWithoutUserInput> | TaskAuditLogCreateWithoutUserInput[] | TaskAuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TaskAuditLogCreateOrConnectWithoutUserInput | TaskAuditLogCreateOrConnectWithoutUserInput[]
    upsert?: TaskAuditLogUpsertWithWhereUniqueWithoutUserInput | TaskAuditLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TaskAuditLogCreateManyUserInputEnvelope
    set?: TaskAuditLogWhereUniqueInput | TaskAuditLogWhereUniqueInput[]
    disconnect?: TaskAuditLogWhereUniqueInput | TaskAuditLogWhereUniqueInput[]
    delete?: TaskAuditLogWhereUniqueInput | TaskAuditLogWhereUniqueInput[]
    connect?: TaskAuditLogWhereUniqueInput | TaskAuditLogWhereUniqueInput[]
    update?: TaskAuditLogUpdateWithWhereUniqueWithoutUserInput | TaskAuditLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TaskAuditLogUpdateManyWithWhereWithoutUserInput | TaskAuditLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TaskAuditLogScalarWhereInput | TaskAuditLogScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type ContactUpdateOneWithoutUserNestedInput = {
    create?: XOR<ContactCreateWithoutUserInput, ContactUncheckedCreateWithoutUserInput>
    connectOrCreate?: ContactCreateOrConnectWithoutUserInput
    upsert?: ContactUpsertWithoutUserInput
    disconnect?: ContactWhereInput | boolean
    delete?: ContactWhereInput | boolean
    connect?: ContactWhereUniqueInput
    update?: XOR<XOR<ContactUpdateToOneWithWhereWithoutUserInput, ContactUpdateWithoutUserInput>, ContactUncheckedUpdateWithoutUserInput>
  }

  export type TaskUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<TaskCreateWithoutOwnerInput, TaskUncheckedCreateWithoutOwnerInput> | TaskCreateWithoutOwnerInput[] | TaskUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutOwnerInput | TaskCreateOrConnectWithoutOwnerInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutOwnerInput | TaskUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: TaskCreateManyOwnerInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutOwnerInput | TaskUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutOwnerInput | TaskUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type TaskUncheckedUpdateManyWithoutAssigneeNestedInput = {
    create?: XOR<TaskCreateWithoutAssigneeInput, TaskUncheckedCreateWithoutAssigneeInput> | TaskCreateWithoutAssigneeInput[] | TaskUncheckedCreateWithoutAssigneeInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutAssigneeInput | TaskCreateOrConnectWithoutAssigneeInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutAssigneeInput | TaskUpsertWithWhereUniqueWithoutAssigneeInput[]
    createMany?: TaskCreateManyAssigneeInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutAssigneeInput | TaskUpdateWithWhereUniqueWithoutAssigneeInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutAssigneeInput | TaskUpdateManyWithWhereWithoutAssigneeInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type TaskAuditLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TaskAuditLogCreateWithoutUserInput, TaskAuditLogUncheckedCreateWithoutUserInput> | TaskAuditLogCreateWithoutUserInput[] | TaskAuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TaskAuditLogCreateOrConnectWithoutUserInput | TaskAuditLogCreateOrConnectWithoutUserInput[]
    upsert?: TaskAuditLogUpsertWithWhereUniqueWithoutUserInput | TaskAuditLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TaskAuditLogCreateManyUserInputEnvelope
    set?: TaskAuditLogWhereUniqueInput | TaskAuditLogWhereUniqueInput[]
    disconnect?: TaskAuditLogWhereUniqueInput | TaskAuditLogWhereUniqueInput[]
    delete?: TaskAuditLogWhereUniqueInput | TaskAuditLogWhereUniqueInput[]
    connect?: TaskAuditLogWhereUniqueInput | TaskAuditLogWhereUniqueInput[]
    update?: TaskAuditLogUpdateWithWhereUniqueWithoutUserInput | TaskAuditLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TaskAuditLogUpdateManyWithWhereWithoutUserInput | TaskAuditLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TaskAuditLogScalarWhereInput | TaskAuditLogScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type ContactUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<ContactCreateWithoutUserInput, ContactUncheckedCreateWithoutUserInput>
    connectOrCreate?: ContactCreateOrConnectWithoutUserInput
    upsert?: ContactUpsertWithoutUserInput
    disconnect?: ContactWhereInput | boolean
    delete?: ContactWhereInput | boolean
    connect?: ContactWhereUniqueInput
    update?: XOR<XOR<ContactUpdateToOneWithWhereWithoutUserInput, ContactUpdateWithoutUserInput>, ContactUncheckedUpdateWithoutUserInput>
  }

  export type UserCreateNestedOneWithoutOwnedTasksInput = {
    create?: XOR<UserCreateWithoutOwnedTasksInput, UserUncheckedCreateWithoutOwnedTasksInput>
    connectOrCreate?: UserCreateOrConnectWithoutOwnedTasksInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutAssignedTasksInput = {
    create?: XOR<UserCreateWithoutAssignedTasksInput, UserUncheckedCreateWithoutAssignedTasksInput>
    connectOrCreate?: UserCreateOrConnectWithoutAssignedTasksInput
    connect?: UserWhereUniqueInput
  }

  export type DataSourceCreateNestedOneWithoutTasksInput = {
    create?: XOR<DataSourceCreateWithoutTasksInput, DataSourceUncheckedCreateWithoutTasksInput>
    connectOrCreate?: DataSourceCreateOrConnectWithoutTasksInput
    connect?: DataSourceWhereUniqueInput
  }

  export type TaskAuditLogCreateNestedManyWithoutTaskInput = {
    create?: XOR<TaskAuditLogCreateWithoutTaskInput, TaskAuditLogUncheckedCreateWithoutTaskInput> | TaskAuditLogCreateWithoutTaskInput[] | TaskAuditLogUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: TaskAuditLogCreateOrConnectWithoutTaskInput | TaskAuditLogCreateOrConnectWithoutTaskInput[]
    createMany?: TaskAuditLogCreateManyTaskInputEnvelope
    connect?: TaskAuditLogWhereUniqueInput | TaskAuditLogWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutTaskInput = {
    create?: XOR<NotificationCreateWithoutTaskInput, NotificationUncheckedCreateWithoutTaskInput> | NotificationCreateWithoutTaskInput[] | NotificationUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutTaskInput | NotificationCreateOrConnectWithoutTaskInput[]
    createMany?: NotificationCreateManyTaskInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type TaskUpdateCreateNestedManyWithoutTaskInput = {
    create?: XOR<TaskUpdateCreateWithoutTaskInput, TaskUpdateUncheckedCreateWithoutTaskInput> | TaskUpdateCreateWithoutTaskInput[] | TaskUpdateUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: TaskUpdateCreateOrConnectWithoutTaskInput | TaskUpdateCreateOrConnectWithoutTaskInput[]
    createMany?: TaskUpdateCreateManyTaskInputEnvelope
    connect?: TaskUpdateWhereUniqueInput | TaskUpdateWhereUniqueInput[]
  }

  export type TaskAuditLogUncheckedCreateNestedManyWithoutTaskInput = {
    create?: XOR<TaskAuditLogCreateWithoutTaskInput, TaskAuditLogUncheckedCreateWithoutTaskInput> | TaskAuditLogCreateWithoutTaskInput[] | TaskAuditLogUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: TaskAuditLogCreateOrConnectWithoutTaskInput | TaskAuditLogCreateOrConnectWithoutTaskInput[]
    createMany?: TaskAuditLogCreateManyTaskInputEnvelope
    connect?: TaskAuditLogWhereUniqueInput | TaskAuditLogWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutTaskInput = {
    create?: XOR<NotificationCreateWithoutTaskInput, NotificationUncheckedCreateWithoutTaskInput> | NotificationCreateWithoutTaskInput[] | NotificationUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutTaskInput | NotificationCreateOrConnectWithoutTaskInput[]
    createMany?: NotificationCreateManyTaskInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type TaskUpdateUncheckedCreateNestedManyWithoutTaskInput = {
    create?: XOR<TaskUpdateCreateWithoutTaskInput, TaskUpdateUncheckedCreateWithoutTaskInput> | TaskUpdateCreateWithoutTaskInput[] | TaskUpdateUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: TaskUpdateCreateOrConnectWithoutTaskInput | TaskUpdateCreateOrConnectWithoutTaskInput[]
    createMany?: TaskUpdateCreateManyTaskInputEnvelope
    connect?: TaskUpdateWhereUniqueInput | TaskUpdateWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneWithoutOwnedTasksNestedInput = {
    create?: XOR<UserCreateWithoutOwnedTasksInput, UserUncheckedCreateWithoutOwnedTasksInput>
    connectOrCreate?: UserCreateOrConnectWithoutOwnedTasksInput
    upsert?: UserUpsertWithoutOwnedTasksInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutOwnedTasksInput, UserUpdateWithoutOwnedTasksInput>, UserUncheckedUpdateWithoutOwnedTasksInput>
  }

  export type UserUpdateOneWithoutAssignedTasksNestedInput = {
    create?: XOR<UserCreateWithoutAssignedTasksInput, UserUncheckedCreateWithoutAssignedTasksInput>
    connectOrCreate?: UserCreateOrConnectWithoutAssignedTasksInput
    upsert?: UserUpsertWithoutAssignedTasksInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAssignedTasksInput, UserUpdateWithoutAssignedTasksInput>, UserUncheckedUpdateWithoutAssignedTasksInput>
  }

  export type DataSourceUpdateOneWithoutTasksNestedInput = {
    create?: XOR<DataSourceCreateWithoutTasksInput, DataSourceUncheckedCreateWithoutTasksInput>
    connectOrCreate?: DataSourceCreateOrConnectWithoutTasksInput
    upsert?: DataSourceUpsertWithoutTasksInput
    disconnect?: DataSourceWhereInput | boolean
    delete?: DataSourceWhereInput | boolean
    connect?: DataSourceWhereUniqueInput
    update?: XOR<XOR<DataSourceUpdateToOneWithWhereWithoutTasksInput, DataSourceUpdateWithoutTasksInput>, DataSourceUncheckedUpdateWithoutTasksInput>
  }

  export type TaskAuditLogUpdateManyWithoutTaskNestedInput = {
    create?: XOR<TaskAuditLogCreateWithoutTaskInput, TaskAuditLogUncheckedCreateWithoutTaskInput> | TaskAuditLogCreateWithoutTaskInput[] | TaskAuditLogUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: TaskAuditLogCreateOrConnectWithoutTaskInput | TaskAuditLogCreateOrConnectWithoutTaskInput[]
    upsert?: TaskAuditLogUpsertWithWhereUniqueWithoutTaskInput | TaskAuditLogUpsertWithWhereUniqueWithoutTaskInput[]
    createMany?: TaskAuditLogCreateManyTaskInputEnvelope
    set?: TaskAuditLogWhereUniqueInput | TaskAuditLogWhereUniqueInput[]
    disconnect?: TaskAuditLogWhereUniqueInput | TaskAuditLogWhereUniqueInput[]
    delete?: TaskAuditLogWhereUniqueInput | TaskAuditLogWhereUniqueInput[]
    connect?: TaskAuditLogWhereUniqueInput | TaskAuditLogWhereUniqueInput[]
    update?: TaskAuditLogUpdateWithWhereUniqueWithoutTaskInput | TaskAuditLogUpdateWithWhereUniqueWithoutTaskInput[]
    updateMany?: TaskAuditLogUpdateManyWithWhereWithoutTaskInput | TaskAuditLogUpdateManyWithWhereWithoutTaskInput[]
    deleteMany?: TaskAuditLogScalarWhereInput | TaskAuditLogScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutTaskNestedInput = {
    create?: XOR<NotificationCreateWithoutTaskInput, NotificationUncheckedCreateWithoutTaskInput> | NotificationCreateWithoutTaskInput[] | NotificationUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutTaskInput | NotificationCreateOrConnectWithoutTaskInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutTaskInput | NotificationUpsertWithWhereUniqueWithoutTaskInput[]
    createMany?: NotificationCreateManyTaskInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutTaskInput | NotificationUpdateWithWhereUniqueWithoutTaskInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutTaskInput | NotificationUpdateManyWithWhereWithoutTaskInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type TaskUpdateUpdateManyWithoutTaskNestedInput = {
    create?: XOR<TaskUpdateCreateWithoutTaskInput, TaskUpdateUncheckedCreateWithoutTaskInput> | TaskUpdateCreateWithoutTaskInput[] | TaskUpdateUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: TaskUpdateCreateOrConnectWithoutTaskInput | TaskUpdateCreateOrConnectWithoutTaskInput[]
    upsert?: TaskUpdateUpsertWithWhereUniqueWithoutTaskInput | TaskUpdateUpsertWithWhereUniqueWithoutTaskInput[]
    createMany?: TaskUpdateCreateManyTaskInputEnvelope
    set?: TaskUpdateWhereUniqueInput | TaskUpdateWhereUniqueInput[]
    disconnect?: TaskUpdateWhereUniqueInput | TaskUpdateWhereUniqueInput[]
    delete?: TaskUpdateWhereUniqueInput | TaskUpdateWhereUniqueInput[]
    connect?: TaskUpdateWhereUniqueInput | TaskUpdateWhereUniqueInput[]
    update?: TaskUpdateUpdateWithWhereUniqueWithoutTaskInput | TaskUpdateUpdateWithWhereUniqueWithoutTaskInput[]
    updateMany?: TaskUpdateUpdateManyWithWhereWithoutTaskInput | TaskUpdateUpdateManyWithWhereWithoutTaskInput[]
    deleteMany?: TaskUpdateScalarWhereInput | TaskUpdateScalarWhereInput[]
  }

  export type TaskAuditLogUncheckedUpdateManyWithoutTaskNestedInput = {
    create?: XOR<TaskAuditLogCreateWithoutTaskInput, TaskAuditLogUncheckedCreateWithoutTaskInput> | TaskAuditLogCreateWithoutTaskInput[] | TaskAuditLogUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: TaskAuditLogCreateOrConnectWithoutTaskInput | TaskAuditLogCreateOrConnectWithoutTaskInput[]
    upsert?: TaskAuditLogUpsertWithWhereUniqueWithoutTaskInput | TaskAuditLogUpsertWithWhereUniqueWithoutTaskInput[]
    createMany?: TaskAuditLogCreateManyTaskInputEnvelope
    set?: TaskAuditLogWhereUniqueInput | TaskAuditLogWhereUniqueInput[]
    disconnect?: TaskAuditLogWhereUniqueInput | TaskAuditLogWhereUniqueInput[]
    delete?: TaskAuditLogWhereUniqueInput | TaskAuditLogWhereUniqueInput[]
    connect?: TaskAuditLogWhereUniqueInput | TaskAuditLogWhereUniqueInput[]
    update?: TaskAuditLogUpdateWithWhereUniqueWithoutTaskInput | TaskAuditLogUpdateWithWhereUniqueWithoutTaskInput[]
    updateMany?: TaskAuditLogUpdateManyWithWhereWithoutTaskInput | TaskAuditLogUpdateManyWithWhereWithoutTaskInput[]
    deleteMany?: TaskAuditLogScalarWhereInput | TaskAuditLogScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutTaskNestedInput = {
    create?: XOR<NotificationCreateWithoutTaskInput, NotificationUncheckedCreateWithoutTaskInput> | NotificationCreateWithoutTaskInput[] | NotificationUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutTaskInput | NotificationCreateOrConnectWithoutTaskInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutTaskInput | NotificationUpsertWithWhereUniqueWithoutTaskInput[]
    createMany?: NotificationCreateManyTaskInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutTaskInput | NotificationUpdateWithWhereUniqueWithoutTaskInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutTaskInput | NotificationUpdateManyWithWhereWithoutTaskInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type TaskUpdateUncheckedUpdateManyWithoutTaskNestedInput = {
    create?: XOR<TaskUpdateCreateWithoutTaskInput, TaskUpdateUncheckedCreateWithoutTaskInput> | TaskUpdateCreateWithoutTaskInput[] | TaskUpdateUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: TaskUpdateCreateOrConnectWithoutTaskInput | TaskUpdateCreateOrConnectWithoutTaskInput[]
    upsert?: TaskUpdateUpsertWithWhereUniqueWithoutTaskInput | TaskUpdateUpsertWithWhereUniqueWithoutTaskInput[]
    createMany?: TaskUpdateCreateManyTaskInputEnvelope
    set?: TaskUpdateWhereUniqueInput | TaskUpdateWhereUniqueInput[]
    disconnect?: TaskUpdateWhereUniqueInput | TaskUpdateWhereUniqueInput[]
    delete?: TaskUpdateWhereUniqueInput | TaskUpdateWhereUniqueInput[]
    connect?: TaskUpdateWhereUniqueInput | TaskUpdateWhereUniqueInput[]
    update?: TaskUpdateUpdateWithWhereUniqueWithoutTaskInput | TaskUpdateUpdateWithWhereUniqueWithoutTaskInput[]
    updateMany?: TaskUpdateUpdateManyWithWhereWithoutTaskInput | TaskUpdateUpdateManyWithWhereWithoutTaskInput[]
    deleteMany?: TaskUpdateScalarWhereInput | TaskUpdateScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutContactInput = {
    create?: XOR<UserCreateWithoutContactInput, UserUncheckedCreateWithoutContactInput>
    connectOrCreate?: UserCreateOrConnectWithoutContactInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneWithoutContactNestedInput = {
    create?: XOR<UserCreateWithoutContactInput, UserUncheckedCreateWithoutContactInput>
    connectOrCreate?: UserCreateOrConnectWithoutContactInput
    upsert?: UserUpsertWithoutContactInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutContactInput, UserUpdateWithoutContactInput>, UserUncheckedUpdateWithoutContactInput>
  }

  export type TaskCreateNestedOneWithoutUpdatesInput = {
    create?: XOR<TaskCreateWithoutUpdatesInput, TaskUncheckedCreateWithoutUpdatesInput>
    connectOrCreate?: TaskCreateOrConnectWithoutUpdatesInput
    connect?: TaskWhereUniqueInput
  }

  export type TaskUpdateOneRequiredWithoutUpdatesNestedInput = {
    create?: XOR<TaskCreateWithoutUpdatesInput, TaskUncheckedCreateWithoutUpdatesInput>
    connectOrCreate?: TaskCreateOrConnectWithoutUpdatesInput
    upsert?: TaskUpsertWithoutUpdatesInput
    connect?: TaskWhereUniqueInput
    update?: XOR<XOR<TaskUpdateToOneWithWhereWithoutUpdatesInput, TaskUpdateWithoutUpdatesInput>, TaskUncheckedUpdateWithoutUpdatesInput>
  }

  export type TaskCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<TaskCreateWithoutAuditLogsInput, TaskUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: TaskCreateOrConnectWithoutAuditLogsInput
    connect?: TaskWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuditLogsInput
    connect?: UserWhereUniqueInput
  }

  export type TaskUpdateOneRequiredWithoutAuditLogsNestedInput = {
    create?: XOR<TaskCreateWithoutAuditLogsInput, TaskUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: TaskCreateOrConnectWithoutAuditLogsInput
    upsert?: TaskUpsertWithoutAuditLogsInput
    connect?: TaskWhereUniqueInput
    update?: XOR<XOR<TaskUpdateToOneWithWhereWithoutAuditLogsInput, TaskUpdateWithoutAuditLogsInput>, TaskUncheckedUpdateWithoutAuditLogsInput>
  }

  export type UserUpdateOneWithoutAuditLogsNestedInput = {
    create?: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuditLogsInput
    upsert?: UserUpsertWithoutAuditLogsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAuditLogsInput, UserUpdateWithoutAuditLogsInput>, UserUncheckedUpdateWithoutAuditLogsInput>
  }

  export type TaskCreateNestedManyWithoutDataSourceInput = {
    create?: XOR<TaskCreateWithoutDataSourceInput, TaskUncheckedCreateWithoutDataSourceInput> | TaskCreateWithoutDataSourceInput[] | TaskUncheckedCreateWithoutDataSourceInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutDataSourceInput | TaskCreateOrConnectWithoutDataSourceInput[]
    createMany?: TaskCreateManyDataSourceInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type TaskUncheckedCreateNestedManyWithoutDataSourceInput = {
    create?: XOR<TaskCreateWithoutDataSourceInput, TaskUncheckedCreateWithoutDataSourceInput> | TaskCreateWithoutDataSourceInput[] | TaskUncheckedCreateWithoutDataSourceInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutDataSourceInput | TaskCreateOrConnectWithoutDataSourceInput[]
    createMany?: TaskCreateManyDataSourceInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type TaskUpdateManyWithoutDataSourceNestedInput = {
    create?: XOR<TaskCreateWithoutDataSourceInput, TaskUncheckedCreateWithoutDataSourceInput> | TaskCreateWithoutDataSourceInput[] | TaskUncheckedCreateWithoutDataSourceInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutDataSourceInput | TaskCreateOrConnectWithoutDataSourceInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutDataSourceInput | TaskUpsertWithWhereUniqueWithoutDataSourceInput[]
    createMany?: TaskCreateManyDataSourceInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutDataSourceInput | TaskUpdateWithWhereUniqueWithoutDataSourceInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutDataSourceInput | TaskUpdateManyWithWhereWithoutDataSourceInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type TaskUncheckedUpdateManyWithoutDataSourceNestedInput = {
    create?: XOR<TaskCreateWithoutDataSourceInput, TaskUncheckedCreateWithoutDataSourceInput> | TaskCreateWithoutDataSourceInput[] | TaskUncheckedCreateWithoutDataSourceInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutDataSourceInput | TaskCreateOrConnectWithoutDataSourceInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutDataSourceInput | TaskUpsertWithWhereUniqueWithoutDataSourceInput[]
    createMany?: TaskCreateManyDataSourceInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutDataSourceInput | TaskUpdateWithWhereUniqueWithoutDataSourceInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutDataSourceInput | TaskUpdateManyWithWhereWithoutDataSourceInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type TaskCreateNestedOneWithoutNotificationsInput = {
    create?: XOR<TaskCreateWithoutNotificationsInput, TaskUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: TaskCreateOrConnectWithoutNotificationsInput
    connect?: TaskWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutNotificationsInput = {
    create?: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationsInput
    connect?: UserWhereUniqueInput
  }

  export type TaskUpdateOneWithoutNotificationsNestedInput = {
    create?: XOR<TaskCreateWithoutNotificationsInput, TaskUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: TaskCreateOrConnectWithoutNotificationsInput
    upsert?: TaskUpsertWithoutNotificationsInput
    disconnect?: TaskWhereInput | boolean
    delete?: TaskWhereInput | boolean
    connect?: TaskWhereUniqueInput
    update?: XOR<XOR<TaskUpdateToOneWithWhereWithoutNotificationsInput, TaskUpdateWithoutNotificationsInput>, TaskUncheckedUpdateWithoutNotificationsInput>
  }

  export type UserUpdateOneWithoutNotificationsNestedInput = {
    create?: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationsInput
    upsert?: UserUpsertWithoutNotificationsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutNotificationsInput, UserUpdateWithoutNotificationsInput>, UserUncheckedUpdateWithoutNotificationsInput>
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type TaskCreateWithoutOwnerInput = {
    id?: string
    taskId?: string | null
    title: string
    description?: string | null
    sentdmMessageId?: string | null
    lastReminderSentAt?: Date | string | null
    department?: string | null
    priority?: string
    status?: string
    strategicPillar?: string | null
    completion?: number
    riskIndicator?: string | null
    startDate?: Date | string | null
    dueDate?: Date | string | null
    completedAt?: Date | string | null
    notes?: string | null
    nextStep?: string | null
    ceoNotes?: string | null
    sourceMonth?: string | null
    source?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    assignee?: UserCreateNestedOneWithoutAssignedTasksInput
    dataSource?: DataSourceCreateNestedOneWithoutTasksInput
    auditLogs?: TaskAuditLogCreateNestedManyWithoutTaskInput
    notifications?: NotificationCreateNestedManyWithoutTaskInput
    updates?: TaskUpdateCreateNestedManyWithoutTaskInput
  }

  export type TaskUncheckedCreateWithoutOwnerInput = {
    id?: string
    taskId?: string | null
    title: string
    description?: string | null
    sentdmMessageId?: string | null
    lastReminderSentAt?: Date | string | null
    assigneeId?: string | null
    department?: string | null
    priority?: string
    status?: string
    strategicPillar?: string | null
    completion?: number
    riskIndicator?: string | null
    startDate?: Date | string | null
    dueDate?: Date | string | null
    completedAt?: Date | string | null
    notes?: string | null
    nextStep?: string | null
    ceoNotes?: string | null
    sourceMonth?: string | null
    source?: string | null
    dataSourceId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    auditLogs?: TaskAuditLogUncheckedCreateNestedManyWithoutTaskInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutTaskInput
    updates?: TaskUpdateUncheckedCreateNestedManyWithoutTaskInput
  }

  export type TaskCreateOrConnectWithoutOwnerInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutOwnerInput, TaskUncheckedCreateWithoutOwnerInput>
  }

  export type TaskCreateManyOwnerInputEnvelope = {
    data: TaskCreateManyOwnerInput | TaskCreateManyOwnerInput[]
  }

  export type TaskCreateWithoutAssigneeInput = {
    id?: string
    taskId?: string | null
    title: string
    description?: string | null
    sentdmMessageId?: string | null
    lastReminderSentAt?: Date | string | null
    department?: string | null
    priority?: string
    status?: string
    strategicPillar?: string | null
    completion?: number
    riskIndicator?: string | null
    startDate?: Date | string | null
    dueDate?: Date | string | null
    completedAt?: Date | string | null
    notes?: string | null
    nextStep?: string | null
    ceoNotes?: string | null
    sourceMonth?: string | null
    source?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    owner?: UserCreateNestedOneWithoutOwnedTasksInput
    dataSource?: DataSourceCreateNestedOneWithoutTasksInput
    auditLogs?: TaskAuditLogCreateNestedManyWithoutTaskInput
    notifications?: NotificationCreateNestedManyWithoutTaskInput
    updates?: TaskUpdateCreateNestedManyWithoutTaskInput
  }

  export type TaskUncheckedCreateWithoutAssigneeInput = {
    id?: string
    taskId?: string | null
    title: string
    description?: string | null
    sentdmMessageId?: string | null
    lastReminderSentAt?: Date | string | null
    ownerId?: string | null
    department?: string | null
    priority?: string
    status?: string
    strategicPillar?: string | null
    completion?: number
    riskIndicator?: string | null
    startDate?: Date | string | null
    dueDate?: Date | string | null
    completedAt?: Date | string | null
    notes?: string | null
    nextStep?: string | null
    ceoNotes?: string | null
    sourceMonth?: string | null
    source?: string | null
    dataSourceId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    auditLogs?: TaskAuditLogUncheckedCreateNestedManyWithoutTaskInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutTaskInput
    updates?: TaskUpdateUncheckedCreateNestedManyWithoutTaskInput
  }

  export type TaskCreateOrConnectWithoutAssigneeInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutAssigneeInput, TaskUncheckedCreateWithoutAssigneeInput>
  }

  export type TaskCreateManyAssigneeInputEnvelope = {
    data: TaskCreateManyAssigneeInput | TaskCreateManyAssigneeInput[]
  }

  export type TaskAuditLogCreateWithoutUserInput = {
    id?: string
    action: string
    field?: string | null
    oldValue?: string | null
    newValue?: string | null
    createdAt?: Date | string
    task: TaskCreateNestedOneWithoutAuditLogsInput
  }

  export type TaskAuditLogUncheckedCreateWithoutUserInput = {
    id?: string
    taskId: string
    action: string
    field?: string | null
    oldValue?: string | null
    newValue?: string | null
    createdAt?: Date | string
  }

  export type TaskAuditLogCreateOrConnectWithoutUserInput = {
    where: TaskAuditLogWhereUniqueInput
    create: XOR<TaskAuditLogCreateWithoutUserInput, TaskAuditLogUncheckedCreateWithoutUserInput>
  }

  export type TaskAuditLogCreateManyUserInputEnvelope = {
    data: TaskAuditLogCreateManyUserInput | TaskAuditLogCreateManyUserInput[]
  }

  export type NotificationCreateWithoutUserInput = {
    id?: string
    type: string
    channel: string
    subject: string
    message: string
    status?: string
    scheduledAt?: Date | string | null
    sentAt?: Date | string | null
    error?: string | null
    createdAt?: Date | string
    task?: TaskCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateWithoutUserInput = {
    id?: string
    taskId?: string | null
    type: string
    channel: string
    subject: string
    message: string
    status?: string
    scheduledAt?: Date | string | null
    sentAt?: Date | string | null
    error?: string | null
    createdAt?: Date | string
  }

  export type NotificationCreateOrConnectWithoutUserInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationCreateManyUserInputEnvelope = {
    data: NotificationCreateManyUserInput | NotificationCreateManyUserInput[]
  }

  export type ContactCreateWithoutUserInput = {
    id?: string
    name: string
    phone?: string | null
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ContactUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    phone?: string | null
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ContactCreateOrConnectWithoutUserInput = {
    where: ContactWhereUniqueInput
    create: XOR<ContactCreateWithoutUserInput, ContactUncheckedCreateWithoutUserInput>
  }

  export type TaskUpsertWithWhereUniqueWithoutOwnerInput = {
    where: TaskWhereUniqueInput
    update: XOR<TaskUpdateWithoutOwnerInput, TaskUncheckedUpdateWithoutOwnerInput>
    create: XOR<TaskCreateWithoutOwnerInput, TaskUncheckedCreateWithoutOwnerInput>
  }

  export type TaskUpdateWithWhereUniqueWithoutOwnerInput = {
    where: TaskWhereUniqueInput
    data: XOR<TaskUpdateWithoutOwnerInput, TaskUncheckedUpdateWithoutOwnerInput>
  }

  export type TaskUpdateManyWithWhereWithoutOwnerInput = {
    where: TaskScalarWhereInput
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyWithoutOwnerInput>
  }

  export type TaskScalarWhereInput = {
    AND?: TaskScalarWhereInput | TaskScalarWhereInput[]
    OR?: TaskScalarWhereInput[]
    NOT?: TaskScalarWhereInput | TaskScalarWhereInput[]
    id?: StringFilter<"Task"> | string
    taskId?: StringNullableFilter<"Task"> | string | null
    title?: StringFilter<"Task"> | string
    description?: StringNullableFilter<"Task"> | string | null
    sentdmMessageId?: StringNullableFilter<"Task"> | string | null
    lastReminderSentAt?: DateTimeNullableFilter<"Task"> | Date | string | null
    ownerId?: StringNullableFilter<"Task"> | string | null
    assigneeId?: StringNullableFilter<"Task"> | string | null
    department?: StringNullableFilter<"Task"> | string | null
    priority?: StringFilter<"Task"> | string
    status?: StringFilter<"Task"> | string
    strategicPillar?: StringNullableFilter<"Task"> | string | null
    completion?: FloatFilter<"Task"> | number
    riskIndicator?: StringNullableFilter<"Task"> | string | null
    startDate?: DateTimeNullableFilter<"Task"> | Date | string | null
    dueDate?: DateTimeNullableFilter<"Task"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"Task"> | Date | string | null
    notes?: StringNullableFilter<"Task"> | string | null
    nextStep?: StringNullableFilter<"Task"> | string | null
    ceoNotes?: StringNullableFilter<"Task"> | string | null
    sourceMonth?: StringNullableFilter<"Task"> | string | null
    source?: StringNullableFilter<"Task"> | string | null
    dataSourceId?: StringNullableFilter<"Task"> | string | null
    createdAt?: DateTimeFilter<"Task"> | Date | string
    updatedAt?: DateTimeFilter<"Task"> | Date | string
  }

  export type TaskUpsertWithWhereUniqueWithoutAssigneeInput = {
    where: TaskWhereUniqueInput
    update: XOR<TaskUpdateWithoutAssigneeInput, TaskUncheckedUpdateWithoutAssigneeInput>
    create: XOR<TaskCreateWithoutAssigneeInput, TaskUncheckedCreateWithoutAssigneeInput>
  }

  export type TaskUpdateWithWhereUniqueWithoutAssigneeInput = {
    where: TaskWhereUniqueInput
    data: XOR<TaskUpdateWithoutAssigneeInput, TaskUncheckedUpdateWithoutAssigneeInput>
  }

  export type TaskUpdateManyWithWhereWithoutAssigneeInput = {
    where: TaskScalarWhereInput
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyWithoutAssigneeInput>
  }

  export type TaskAuditLogUpsertWithWhereUniqueWithoutUserInput = {
    where: TaskAuditLogWhereUniqueInput
    update: XOR<TaskAuditLogUpdateWithoutUserInput, TaskAuditLogUncheckedUpdateWithoutUserInput>
    create: XOR<TaskAuditLogCreateWithoutUserInput, TaskAuditLogUncheckedCreateWithoutUserInput>
  }

  export type TaskAuditLogUpdateWithWhereUniqueWithoutUserInput = {
    where: TaskAuditLogWhereUniqueInput
    data: XOR<TaskAuditLogUpdateWithoutUserInput, TaskAuditLogUncheckedUpdateWithoutUserInput>
  }

  export type TaskAuditLogUpdateManyWithWhereWithoutUserInput = {
    where: TaskAuditLogScalarWhereInput
    data: XOR<TaskAuditLogUpdateManyMutationInput, TaskAuditLogUncheckedUpdateManyWithoutUserInput>
  }

  export type TaskAuditLogScalarWhereInput = {
    AND?: TaskAuditLogScalarWhereInput | TaskAuditLogScalarWhereInput[]
    OR?: TaskAuditLogScalarWhereInput[]
    NOT?: TaskAuditLogScalarWhereInput | TaskAuditLogScalarWhereInput[]
    id?: StringFilter<"TaskAuditLog"> | string
    taskId?: StringFilter<"TaskAuditLog"> | string
    userId?: StringNullableFilter<"TaskAuditLog"> | string | null
    action?: StringFilter<"TaskAuditLog"> | string
    field?: StringNullableFilter<"TaskAuditLog"> | string | null
    oldValue?: StringNullableFilter<"TaskAuditLog"> | string | null
    newValue?: StringNullableFilter<"TaskAuditLog"> | string | null
    createdAt?: DateTimeFilter<"TaskAuditLog"> | Date | string
  }

  export type NotificationUpsertWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
  }

  export type NotificationUpdateManyWithWhereWithoutUserInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutUserInput>
  }

  export type NotificationScalarWhereInput = {
    AND?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    OR?: NotificationScalarWhereInput[]
    NOT?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    id?: StringFilter<"Notification"> | string
    taskId?: StringNullableFilter<"Notification"> | string | null
    userId?: StringNullableFilter<"Notification"> | string | null
    type?: StringFilter<"Notification"> | string
    channel?: StringFilter<"Notification"> | string
    subject?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    status?: StringFilter<"Notification"> | string
    scheduledAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    sentAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    error?: StringNullableFilter<"Notification"> | string | null
    createdAt?: DateTimeFilter<"Notification"> | Date | string
  }

  export type ContactUpsertWithoutUserInput = {
    update: XOR<ContactUpdateWithoutUserInput, ContactUncheckedUpdateWithoutUserInput>
    create: XOR<ContactCreateWithoutUserInput, ContactUncheckedCreateWithoutUserInput>
    where?: ContactWhereInput
  }

  export type ContactUpdateToOneWithWhereWithoutUserInput = {
    where?: ContactWhereInput
    data: XOR<ContactUpdateWithoutUserInput, ContactUncheckedUpdateWithoutUserInput>
  }

  export type ContactUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContactUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutOwnedTasksInput = {
    id?: string
    email: string
    username?: string | null
    name?: string | null
    role?: string
    department?: string | null
    phone?: string | null
    avatar?: string | null
    isActive?: boolean
    receiveTaskReminders?: boolean
    receiveDailyDigest?: boolean
    receiveWeeklyReport?: boolean
    reminderDaysBefore?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    assignedTasks?: TaskCreateNestedManyWithoutAssigneeInput
    auditLogs?: TaskAuditLogCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    contact?: ContactCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutOwnedTasksInput = {
    id?: string
    email: string
    username?: string | null
    name?: string | null
    role?: string
    department?: string | null
    phone?: string | null
    avatar?: string | null
    isActive?: boolean
    receiveTaskReminders?: boolean
    receiveDailyDigest?: boolean
    receiveWeeklyReport?: boolean
    reminderDaysBefore?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    assignedTasks?: TaskUncheckedCreateNestedManyWithoutAssigneeInput
    auditLogs?: TaskAuditLogUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    contact?: ContactUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutOwnedTasksInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOwnedTasksInput, UserUncheckedCreateWithoutOwnedTasksInput>
  }

  export type UserCreateWithoutAssignedTasksInput = {
    id?: string
    email: string
    username?: string | null
    name?: string | null
    role?: string
    department?: string | null
    phone?: string | null
    avatar?: string | null
    isActive?: boolean
    receiveTaskReminders?: boolean
    receiveDailyDigest?: boolean
    receiveWeeklyReport?: boolean
    reminderDaysBefore?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedTasks?: TaskCreateNestedManyWithoutOwnerInput
    auditLogs?: TaskAuditLogCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    contact?: ContactCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAssignedTasksInput = {
    id?: string
    email: string
    username?: string | null
    name?: string | null
    role?: string
    department?: string | null
    phone?: string | null
    avatar?: string | null
    isActive?: boolean
    receiveTaskReminders?: boolean
    receiveDailyDigest?: boolean
    receiveWeeklyReport?: boolean
    reminderDaysBefore?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedTasks?: TaskUncheckedCreateNestedManyWithoutOwnerInput
    auditLogs?: TaskAuditLogUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    contact?: ContactUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAssignedTasksInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAssignedTasksInput, UserUncheckedCreateWithoutAssignedTasksInput>
  }

  export type DataSourceCreateWithoutTasksInput = {
    id?: string
    fileName: string
    originalName: string
    fileSize: number
    rowCount: number
    columnMapping?: string | null
    uploadedById?: string | null
    uploadedAt?: Date | string
  }

  export type DataSourceUncheckedCreateWithoutTasksInput = {
    id?: string
    fileName: string
    originalName: string
    fileSize: number
    rowCount: number
    columnMapping?: string | null
    uploadedById?: string | null
    uploadedAt?: Date | string
  }

  export type DataSourceCreateOrConnectWithoutTasksInput = {
    where: DataSourceWhereUniqueInput
    create: XOR<DataSourceCreateWithoutTasksInput, DataSourceUncheckedCreateWithoutTasksInput>
  }

  export type TaskAuditLogCreateWithoutTaskInput = {
    id?: string
    action: string
    field?: string | null
    oldValue?: string | null
    newValue?: string | null
    createdAt?: Date | string
    user?: UserCreateNestedOneWithoutAuditLogsInput
  }

  export type TaskAuditLogUncheckedCreateWithoutTaskInput = {
    id?: string
    userId?: string | null
    action: string
    field?: string | null
    oldValue?: string | null
    newValue?: string | null
    createdAt?: Date | string
  }

  export type TaskAuditLogCreateOrConnectWithoutTaskInput = {
    where: TaskAuditLogWhereUniqueInput
    create: XOR<TaskAuditLogCreateWithoutTaskInput, TaskAuditLogUncheckedCreateWithoutTaskInput>
  }

  export type TaskAuditLogCreateManyTaskInputEnvelope = {
    data: TaskAuditLogCreateManyTaskInput | TaskAuditLogCreateManyTaskInput[]
  }

  export type NotificationCreateWithoutTaskInput = {
    id?: string
    type: string
    channel: string
    subject: string
    message: string
    status?: string
    scheduledAt?: Date | string | null
    sentAt?: Date | string | null
    error?: string | null
    createdAt?: Date | string
    user?: UserCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateWithoutTaskInput = {
    id?: string
    userId?: string | null
    type: string
    channel: string
    subject: string
    message: string
    status?: string
    scheduledAt?: Date | string | null
    sentAt?: Date | string | null
    error?: string | null
    createdAt?: Date | string
  }

  export type NotificationCreateOrConnectWithoutTaskInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutTaskInput, NotificationUncheckedCreateWithoutTaskInput>
  }

  export type NotificationCreateManyTaskInputEnvelope = {
    data: NotificationCreateManyTaskInput | NotificationCreateManyTaskInput[]
  }

  export type TaskUpdateCreateWithoutTaskInput = {
    id?: string
    source: string
    content: string
    createdAt?: Date | string
  }

  export type TaskUpdateUncheckedCreateWithoutTaskInput = {
    id?: string
    source: string
    content: string
    createdAt?: Date | string
  }

  export type TaskUpdateCreateOrConnectWithoutTaskInput = {
    where: TaskUpdateWhereUniqueInput
    create: XOR<TaskUpdateCreateWithoutTaskInput, TaskUpdateUncheckedCreateWithoutTaskInput>
  }

  export type TaskUpdateCreateManyTaskInputEnvelope = {
    data: TaskUpdateCreateManyTaskInput | TaskUpdateCreateManyTaskInput[]
  }

  export type UserUpsertWithoutOwnedTasksInput = {
    update: XOR<UserUpdateWithoutOwnedTasksInput, UserUncheckedUpdateWithoutOwnedTasksInput>
    create: XOR<UserCreateWithoutOwnedTasksInput, UserUncheckedCreateWithoutOwnedTasksInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutOwnedTasksInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutOwnedTasksInput, UserUncheckedUpdateWithoutOwnedTasksInput>
  }

  export type UserUpdateWithoutOwnedTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    receiveTaskReminders?: BoolFieldUpdateOperationsInput | boolean
    receiveDailyDigest?: BoolFieldUpdateOperationsInput | boolean
    receiveWeeklyReport?: BoolFieldUpdateOperationsInput | boolean
    reminderDaysBefore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedTasks?: TaskUpdateManyWithoutAssigneeNestedInput
    auditLogs?: TaskAuditLogUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    contact?: ContactUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutOwnedTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    receiveTaskReminders?: BoolFieldUpdateOperationsInput | boolean
    receiveDailyDigest?: BoolFieldUpdateOperationsInput | boolean
    receiveWeeklyReport?: BoolFieldUpdateOperationsInput | boolean
    reminderDaysBefore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedTasks?: TaskUncheckedUpdateManyWithoutAssigneeNestedInput
    auditLogs?: TaskAuditLogUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    contact?: ContactUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserUpsertWithoutAssignedTasksInput = {
    update: XOR<UserUpdateWithoutAssignedTasksInput, UserUncheckedUpdateWithoutAssignedTasksInput>
    create: XOR<UserCreateWithoutAssignedTasksInput, UserUncheckedCreateWithoutAssignedTasksInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAssignedTasksInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAssignedTasksInput, UserUncheckedUpdateWithoutAssignedTasksInput>
  }

  export type UserUpdateWithoutAssignedTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    receiveTaskReminders?: BoolFieldUpdateOperationsInput | boolean
    receiveDailyDigest?: BoolFieldUpdateOperationsInput | boolean
    receiveWeeklyReport?: BoolFieldUpdateOperationsInput | boolean
    reminderDaysBefore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedTasks?: TaskUpdateManyWithoutOwnerNestedInput
    auditLogs?: TaskAuditLogUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    contact?: ContactUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAssignedTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    receiveTaskReminders?: BoolFieldUpdateOperationsInput | boolean
    receiveDailyDigest?: BoolFieldUpdateOperationsInput | boolean
    receiveWeeklyReport?: BoolFieldUpdateOperationsInput | boolean
    reminderDaysBefore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedTasks?: TaskUncheckedUpdateManyWithoutOwnerNestedInput
    auditLogs?: TaskAuditLogUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    contact?: ContactUncheckedUpdateOneWithoutUserNestedInput
  }

  export type DataSourceUpsertWithoutTasksInput = {
    update: XOR<DataSourceUpdateWithoutTasksInput, DataSourceUncheckedUpdateWithoutTasksInput>
    create: XOR<DataSourceCreateWithoutTasksInput, DataSourceUncheckedCreateWithoutTasksInput>
    where?: DataSourceWhereInput
  }

  export type DataSourceUpdateToOneWithWhereWithoutTasksInput = {
    where?: DataSourceWhereInput
    data: XOR<DataSourceUpdateWithoutTasksInput, DataSourceUncheckedUpdateWithoutTasksInput>
  }

  export type DataSourceUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    rowCount?: IntFieldUpdateOperationsInput | number
    columnMapping?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedById?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DataSourceUncheckedUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    rowCount?: IntFieldUpdateOperationsInput | number
    columnMapping?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedById?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskAuditLogUpsertWithWhereUniqueWithoutTaskInput = {
    where: TaskAuditLogWhereUniqueInput
    update: XOR<TaskAuditLogUpdateWithoutTaskInput, TaskAuditLogUncheckedUpdateWithoutTaskInput>
    create: XOR<TaskAuditLogCreateWithoutTaskInput, TaskAuditLogUncheckedCreateWithoutTaskInput>
  }

  export type TaskAuditLogUpdateWithWhereUniqueWithoutTaskInput = {
    where: TaskAuditLogWhereUniqueInput
    data: XOR<TaskAuditLogUpdateWithoutTaskInput, TaskAuditLogUncheckedUpdateWithoutTaskInput>
  }

  export type TaskAuditLogUpdateManyWithWhereWithoutTaskInput = {
    where: TaskAuditLogScalarWhereInput
    data: XOR<TaskAuditLogUpdateManyMutationInput, TaskAuditLogUncheckedUpdateManyWithoutTaskInput>
  }

  export type NotificationUpsertWithWhereUniqueWithoutTaskInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutTaskInput, NotificationUncheckedUpdateWithoutTaskInput>
    create: XOR<NotificationCreateWithoutTaskInput, NotificationUncheckedCreateWithoutTaskInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutTaskInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutTaskInput, NotificationUncheckedUpdateWithoutTaskInput>
  }

  export type NotificationUpdateManyWithWhereWithoutTaskInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutTaskInput>
  }

  export type TaskUpdateUpsertWithWhereUniqueWithoutTaskInput = {
    where: TaskUpdateWhereUniqueInput
    update: XOR<TaskUpdateUpdateWithoutTaskInput, TaskUpdateUncheckedUpdateWithoutTaskInput>
    create: XOR<TaskUpdateCreateWithoutTaskInput, TaskUpdateUncheckedCreateWithoutTaskInput>
  }

  export type TaskUpdateUpdateWithWhereUniqueWithoutTaskInput = {
    where: TaskUpdateWhereUniqueInput
    data: XOR<TaskUpdateUpdateWithoutTaskInput, TaskUpdateUncheckedUpdateWithoutTaskInput>
  }

  export type TaskUpdateUpdateManyWithWhereWithoutTaskInput = {
    where: TaskUpdateScalarWhereInput
    data: XOR<TaskUpdateUpdateManyMutationInput, TaskUpdateUncheckedUpdateManyWithoutTaskInput>
  }

  export type TaskUpdateScalarWhereInput = {
    AND?: TaskUpdateScalarWhereInput | TaskUpdateScalarWhereInput[]
    OR?: TaskUpdateScalarWhereInput[]
    NOT?: TaskUpdateScalarWhereInput | TaskUpdateScalarWhereInput[]
    id?: StringFilter<"TaskUpdate"> | string
    taskId?: StringFilter<"TaskUpdate"> | string
    source?: StringFilter<"TaskUpdate"> | string
    content?: StringFilter<"TaskUpdate"> | string
    createdAt?: DateTimeFilter<"TaskUpdate"> | Date | string
  }

  export type UserCreateWithoutContactInput = {
    id?: string
    email: string
    username?: string | null
    name?: string | null
    role?: string
    department?: string | null
    phone?: string | null
    avatar?: string | null
    isActive?: boolean
    receiveTaskReminders?: boolean
    receiveDailyDigest?: boolean
    receiveWeeklyReport?: boolean
    reminderDaysBefore?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedTasks?: TaskCreateNestedManyWithoutOwnerInput
    assignedTasks?: TaskCreateNestedManyWithoutAssigneeInput
    auditLogs?: TaskAuditLogCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutContactInput = {
    id?: string
    email: string
    username?: string | null
    name?: string | null
    role?: string
    department?: string | null
    phone?: string | null
    avatar?: string | null
    isActive?: boolean
    receiveTaskReminders?: boolean
    receiveDailyDigest?: boolean
    receiveWeeklyReport?: boolean
    reminderDaysBefore?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedTasks?: TaskUncheckedCreateNestedManyWithoutOwnerInput
    assignedTasks?: TaskUncheckedCreateNestedManyWithoutAssigneeInput
    auditLogs?: TaskAuditLogUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutContactInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutContactInput, UserUncheckedCreateWithoutContactInput>
  }

  export type UserUpsertWithoutContactInput = {
    update: XOR<UserUpdateWithoutContactInput, UserUncheckedUpdateWithoutContactInput>
    create: XOR<UserCreateWithoutContactInput, UserUncheckedCreateWithoutContactInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutContactInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutContactInput, UserUncheckedUpdateWithoutContactInput>
  }

  export type UserUpdateWithoutContactInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    receiveTaskReminders?: BoolFieldUpdateOperationsInput | boolean
    receiveDailyDigest?: BoolFieldUpdateOperationsInput | boolean
    receiveWeeklyReport?: BoolFieldUpdateOperationsInput | boolean
    reminderDaysBefore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedTasks?: TaskUpdateManyWithoutOwnerNestedInput
    assignedTasks?: TaskUpdateManyWithoutAssigneeNestedInput
    auditLogs?: TaskAuditLogUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutContactInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    receiveTaskReminders?: BoolFieldUpdateOperationsInput | boolean
    receiveDailyDigest?: BoolFieldUpdateOperationsInput | boolean
    receiveWeeklyReport?: BoolFieldUpdateOperationsInput | boolean
    reminderDaysBefore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedTasks?: TaskUncheckedUpdateManyWithoutOwnerNestedInput
    assignedTasks?: TaskUncheckedUpdateManyWithoutAssigneeNestedInput
    auditLogs?: TaskAuditLogUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type TaskCreateWithoutUpdatesInput = {
    id?: string
    taskId?: string | null
    title: string
    description?: string | null
    sentdmMessageId?: string | null
    lastReminderSentAt?: Date | string | null
    department?: string | null
    priority?: string
    status?: string
    strategicPillar?: string | null
    completion?: number
    riskIndicator?: string | null
    startDate?: Date | string | null
    dueDate?: Date | string | null
    completedAt?: Date | string | null
    notes?: string | null
    nextStep?: string | null
    ceoNotes?: string | null
    sourceMonth?: string | null
    source?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    owner?: UserCreateNestedOneWithoutOwnedTasksInput
    assignee?: UserCreateNestedOneWithoutAssignedTasksInput
    dataSource?: DataSourceCreateNestedOneWithoutTasksInput
    auditLogs?: TaskAuditLogCreateNestedManyWithoutTaskInput
    notifications?: NotificationCreateNestedManyWithoutTaskInput
  }

  export type TaskUncheckedCreateWithoutUpdatesInput = {
    id?: string
    taskId?: string | null
    title: string
    description?: string | null
    sentdmMessageId?: string | null
    lastReminderSentAt?: Date | string | null
    ownerId?: string | null
    assigneeId?: string | null
    department?: string | null
    priority?: string
    status?: string
    strategicPillar?: string | null
    completion?: number
    riskIndicator?: string | null
    startDate?: Date | string | null
    dueDate?: Date | string | null
    completedAt?: Date | string | null
    notes?: string | null
    nextStep?: string | null
    ceoNotes?: string | null
    sourceMonth?: string | null
    source?: string | null
    dataSourceId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    auditLogs?: TaskAuditLogUncheckedCreateNestedManyWithoutTaskInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutTaskInput
  }

  export type TaskCreateOrConnectWithoutUpdatesInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutUpdatesInput, TaskUncheckedCreateWithoutUpdatesInput>
  }

  export type TaskUpsertWithoutUpdatesInput = {
    update: XOR<TaskUpdateWithoutUpdatesInput, TaskUncheckedUpdateWithoutUpdatesInput>
    create: XOR<TaskCreateWithoutUpdatesInput, TaskUncheckedCreateWithoutUpdatesInput>
    where?: TaskWhereInput
  }

  export type TaskUpdateToOneWithWhereWithoutUpdatesInput = {
    where?: TaskWhereInput
    data: XOR<TaskUpdateWithoutUpdatesInput, TaskUncheckedUpdateWithoutUpdatesInput>
  }

  export type TaskUpdateWithoutUpdatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sentdmMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    lastReminderSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    strategicPillar?: NullableStringFieldUpdateOperationsInput | string | null
    completion?: FloatFieldUpdateOperationsInput | number
    riskIndicator?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    nextStep?: NullableStringFieldUpdateOperationsInput | string | null
    ceoNotes?: NullableStringFieldUpdateOperationsInput | string | null
    sourceMonth?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneWithoutOwnedTasksNestedInput
    assignee?: UserUpdateOneWithoutAssignedTasksNestedInput
    dataSource?: DataSourceUpdateOneWithoutTasksNestedInput
    auditLogs?: TaskAuditLogUpdateManyWithoutTaskNestedInput
    notifications?: NotificationUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateWithoutUpdatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sentdmMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    lastReminderSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    assigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    strategicPillar?: NullableStringFieldUpdateOperationsInput | string | null
    completion?: FloatFieldUpdateOperationsInput | number
    riskIndicator?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    nextStep?: NullableStringFieldUpdateOperationsInput | string | null
    ceoNotes?: NullableStringFieldUpdateOperationsInput | string | null
    sourceMonth?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    dataSourceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditLogs?: TaskAuditLogUncheckedUpdateManyWithoutTaskNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutTaskNestedInput
  }

  export type TaskCreateWithoutAuditLogsInput = {
    id?: string
    taskId?: string | null
    title: string
    description?: string | null
    sentdmMessageId?: string | null
    lastReminderSentAt?: Date | string | null
    department?: string | null
    priority?: string
    status?: string
    strategicPillar?: string | null
    completion?: number
    riskIndicator?: string | null
    startDate?: Date | string | null
    dueDate?: Date | string | null
    completedAt?: Date | string | null
    notes?: string | null
    nextStep?: string | null
    ceoNotes?: string | null
    sourceMonth?: string | null
    source?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    owner?: UserCreateNestedOneWithoutOwnedTasksInput
    assignee?: UserCreateNestedOneWithoutAssignedTasksInput
    dataSource?: DataSourceCreateNestedOneWithoutTasksInput
    notifications?: NotificationCreateNestedManyWithoutTaskInput
    updates?: TaskUpdateCreateNestedManyWithoutTaskInput
  }

  export type TaskUncheckedCreateWithoutAuditLogsInput = {
    id?: string
    taskId?: string | null
    title: string
    description?: string | null
    sentdmMessageId?: string | null
    lastReminderSentAt?: Date | string | null
    ownerId?: string | null
    assigneeId?: string | null
    department?: string | null
    priority?: string
    status?: string
    strategicPillar?: string | null
    completion?: number
    riskIndicator?: string | null
    startDate?: Date | string | null
    dueDate?: Date | string | null
    completedAt?: Date | string | null
    notes?: string | null
    nextStep?: string | null
    ceoNotes?: string | null
    sourceMonth?: string | null
    source?: string | null
    dataSourceId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    notifications?: NotificationUncheckedCreateNestedManyWithoutTaskInput
    updates?: TaskUpdateUncheckedCreateNestedManyWithoutTaskInput
  }

  export type TaskCreateOrConnectWithoutAuditLogsInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutAuditLogsInput, TaskUncheckedCreateWithoutAuditLogsInput>
  }

  export type UserCreateWithoutAuditLogsInput = {
    id?: string
    email: string
    username?: string | null
    name?: string | null
    role?: string
    department?: string | null
    phone?: string | null
    avatar?: string | null
    isActive?: boolean
    receiveTaskReminders?: boolean
    receiveDailyDigest?: boolean
    receiveWeeklyReport?: boolean
    reminderDaysBefore?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedTasks?: TaskCreateNestedManyWithoutOwnerInput
    assignedTasks?: TaskCreateNestedManyWithoutAssigneeInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    contact?: ContactCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAuditLogsInput = {
    id?: string
    email: string
    username?: string | null
    name?: string | null
    role?: string
    department?: string | null
    phone?: string | null
    avatar?: string | null
    isActive?: boolean
    receiveTaskReminders?: boolean
    receiveDailyDigest?: boolean
    receiveWeeklyReport?: boolean
    reminderDaysBefore?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedTasks?: TaskUncheckedCreateNestedManyWithoutOwnerInput
    assignedTasks?: TaskUncheckedCreateNestedManyWithoutAssigneeInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    contact?: ContactUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAuditLogsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
  }

  export type TaskUpsertWithoutAuditLogsInput = {
    update: XOR<TaskUpdateWithoutAuditLogsInput, TaskUncheckedUpdateWithoutAuditLogsInput>
    create: XOR<TaskCreateWithoutAuditLogsInput, TaskUncheckedCreateWithoutAuditLogsInput>
    where?: TaskWhereInput
  }

  export type TaskUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: TaskWhereInput
    data: XOR<TaskUpdateWithoutAuditLogsInput, TaskUncheckedUpdateWithoutAuditLogsInput>
  }

  export type TaskUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sentdmMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    lastReminderSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    strategicPillar?: NullableStringFieldUpdateOperationsInput | string | null
    completion?: FloatFieldUpdateOperationsInput | number
    riskIndicator?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    nextStep?: NullableStringFieldUpdateOperationsInput | string | null
    ceoNotes?: NullableStringFieldUpdateOperationsInput | string | null
    sourceMonth?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneWithoutOwnedTasksNestedInput
    assignee?: UserUpdateOneWithoutAssignedTasksNestedInput
    dataSource?: DataSourceUpdateOneWithoutTasksNestedInput
    notifications?: NotificationUpdateManyWithoutTaskNestedInput
    updates?: TaskUpdateUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sentdmMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    lastReminderSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    assigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    strategicPillar?: NullableStringFieldUpdateOperationsInput | string | null
    completion?: FloatFieldUpdateOperationsInput | number
    riskIndicator?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    nextStep?: NullableStringFieldUpdateOperationsInput | string | null
    ceoNotes?: NullableStringFieldUpdateOperationsInput | string | null
    sourceMonth?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    dataSourceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifications?: NotificationUncheckedUpdateManyWithoutTaskNestedInput
    updates?: TaskUpdateUncheckedUpdateManyWithoutTaskNestedInput
  }

  export type UserUpsertWithoutAuditLogsInput = {
    update: XOR<UserUpdateWithoutAuditLogsInput, UserUncheckedUpdateWithoutAuditLogsInput>
    create: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAuditLogsInput, UserUncheckedUpdateWithoutAuditLogsInput>
  }

  export type UserUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    receiveTaskReminders?: BoolFieldUpdateOperationsInput | boolean
    receiveDailyDigest?: BoolFieldUpdateOperationsInput | boolean
    receiveWeeklyReport?: BoolFieldUpdateOperationsInput | boolean
    reminderDaysBefore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedTasks?: TaskUpdateManyWithoutOwnerNestedInput
    assignedTasks?: TaskUpdateManyWithoutAssigneeNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    contact?: ContactUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    receiveTaskReminders?: BoolFieldUpdateOperationsInput | boolean
    receiveDailyDigest?: BoolFieldUpdateOperationsInput | boolean
    receiveWeeklyReport?: BoolFieldUpdateOperationsInput | boolean
    reminderDaysBefore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedTasks?: TaskUncheckedUpdateManyWithoutOwnerNestedInput
    assignedTasks?: TaskUncheckedUpdateManyWithoutAssigneeNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    contact?: ContactUncheckedUpdateOneWithoutUserNestedInput
  }

  export type TaskCreateWithoutDataSourceInput = {
    id?: string
    taskId?: string | null
    title: string
    description?: string | null
    sentdmMessageId?: string | null
    lastReminderSentAt?: Date | string | null
    department?: string | null
    priority?: string
    status?: string
    strategicPillar?: string | null
    completion?: number
    riskIndicator?: string | null
    startDate?: Date | string | null
    dueDate?: Date | string | null
    completedAt?: Date | string | null
    notes?: string | null
    nextStep?: string | null
    ceoNotes?: string | null
    sourceMonth?: string | null
    source?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    owner?: UserCreateNestedOneWithoutOwnedTasksInput
    assignee?: UserCreateNestedOneWithoutAssignedTasksInput
    auditLogs?: TaskAuditLogCreateNestedManyWithoutTaskInput
    notifications?: NotificationCreateNestedManyWithoutTaskInput
    updates?: TaskUpdateCreateNestedManyWithoutTaskInput
  }

  export type TaskUncheckedCreateWithoutDataSourceInput = {
    id?: string
    taskId?: string | null
    title: string
    description?: string | null
    sentdmMessageId?: string | null
    lastReminderSentAt?: Date | string | null
    ownerId?: string | null
    assigneeId?: string | null
    department?: string | null
    priority?: string
    status?: string
    strategicPillar?: string | null
    completion?: number
    riskIndicator?: string | null
    startDate?: Date | string | null
    dueDate?: Date | string | null
    completedAt?: Date | string | null
    notes?: string | null
    nextStep?: string | null
    ceoNotes?: string | null
    sourceMonth?: string | null
    source?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    auditLogs?: TaskAuditLogUncheckedCreateNestedManyWithoutTaskInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutTaskInput
    updates?: TaskUpdateUncheckedCreateNestedManyWithoutTaskInput
  }

  export type TaskCreateOrConnectWithoutDataSourceInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutDataSourceInput, TaskUncheckedCreateWithoutDataSourceInput>
  }

  export type TaskCreateManyDataSourceInputEnvelope = {
    data: TaskCreateManyDataSourceInput | TaskCreateManyDataSourceInput[]
  }

  export type TaskUpsertWithWhereUniqueWithoutDataSourceInput = {
    where: TaskWhereUniqueInput
    update: XOR<TaskUpdateWithoutDataSourceInput, TaskUncheckedUpdateWithoutDataSourceInput>
    create: XOR<TaskCreateWithoutDataSourceInput, TaskUncheckedCreateWithoutDataSourceInput>
  }

  export type TaskUpdateWithWhereUniqueWithoutDataSourceInput = {
    where: TaskWhereUniqueInput
    data: XOR<TaskUpdateWithoutDataSourceInput, TaskUncheckedUpdateWithoutDataSourceInput>
  }

  export type TaskUpdateManyWithWhereWithoutDataSourceInput = {
    where: TaskScalarWhereInput
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyWithoutDataSourceInput>
  }

  export type TaskCreateWithoutNotificationsInput = {
    id?: string
    taskId?: string | null
    title: string
    description?: string | null
    sentdmMessageId?: string | null
    lastReminderSentAt?: Date | string | null
    department?: string | null
    priority?: string
    status?: string
    strategicPillar?: string | null
    completion?: number
    riskIndicator?: string | null
    startDate?: Date | string | null
    dueDate?: Date | string | null
    completedAt?: Date | string | null
    notes?: string | null
    nextStep?: string | null
    ceoNotes?: string | null
    sourceMonth?: string | null
    source?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    owner?: UserCreateNestedOneWithoutOwnedTasksInput
    assignee?: UserCreateNestedOneWithoutAssignedTasksInput
    dataSource?: DataSourceCreateNestedOneWithoutTasksInput
    auditLogs?: TaskAuditLogCreateNestedManyWithoutTaskInput
    updates?: TaskUpdateCreateNestedManyWithoutTaskInput
  }

  export type TaskUncheckedCreateWithoutNotificationsInput = {
    id?: string
    taskId?: string | null
    title: string
    description?: string | null
    sentdmMessageId?: string | null
    lastReminderSentAt?: Date | string | null
    ownerId?: string | null
    assigneeId?: string | null
    department?: string | null
    priority?: string
    status?: string
    strategicPillar?: string | null
    completion?: number
    riskIndicator?: string | null
    startDate?: Date | string | null
    dueDate?: Date | string | null
    completedAt?: Date | string | null
    notes?: string | null
    nextStep?: string | null
    ceoNotes?: string | null
    sourceMonth?: string | null
    source?: string | null
    dataSourceId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    auditLogs?: TaskAuditLogUncheckedCreateNestedManyWithoutTaskInput
    updates?: TaskUpdateUncheckedCreateNestedManyWithoutTaskInput
  }

  export type TaskCreateOrConnectWithoutNotificationsInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutNotificationsInput, TaskUncheckedCreateWithoutNotificationsInput>
  }

  export type UserCreateWithoutNotificationsInput = {
    id?: string
    email: string
    username?: string | null
    name?: string | null
    role?: string
    department?: string | null
    phone?: string | null
    avatar?: string | null
    isActive?: boolean
    receiveTaskReminders?: boolean
    receiveDailyDigest?: boolean
    receiveWeeklyReport?: boolean
    reminderDaysBefore?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedTasks?: TaskCreateNestedManyWithoutOwnerInput
    assignedTasks?: TaskCreateNestedManyWithoutAssigneeInput
    auditLogs?: TaskAuditLogCreateNestedManyWithoutUserInput
    contact?: ContactCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutNotificationsInput = {
    id?: string
    email: string
    username?: string | null
    name?: string | null
    role?: string
    department?: string | null
    phone?: string | null
    avatar?: string | null
    isActive?: boolean
    receiveTaskReminders?: boolean
    receiveDailyDigest?: boolean
    receiveWeeklyReport?: boolean
    reminderDaysBefore?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedTasks?: TaskUncheckedCreateNestedManyWithoutOwnerInput
    assignedTasks?: TaskUncheckedCreateNestedManyWithoutAssigneeInput
    auditLogs?: TaskAuditLogUncheckedCreateNestedManyWithoutUserInput
    contact?: ContactUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutNotificationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
  }

  export type TaskUpsertWithoutNotificationsInput = {
    update: XOR<TaskUpdateWithoutNotificationsInput, TaskUncheckedUpdateWithoutNotificationsInput>
    create: XOR<TaskCreateWithoutNotificationsInput, TaskUncheckedCreateWithoutNotificationsInput>
    where?: TaskWhereInput
  }

  export type TaskUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: TaskWhereInput
    data: XOR<TaskUpdateWithoutNotificationsInput, TaskUncheckedUpdateWithoutNotificationsInput>
  }

  export type TaskUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sentdmMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    lastReminderSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    strategicPillar?: NullableStringFieldUpdateOperationsInput | string | null
    completion?: FloatFieldUpdateOperationsInput | number
    riskIndicator?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    nextStep?: NullableStringFieldUpdateOperationsInput | string | null
    ceoNotes?: NullableStringFieldUpdateOperationsInput | string | null
    sourceMonth?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneWithoutOwnedTasksNestedInput
    assignee?: UserUpdateOneWithoutAssignedTasksNestedInput
    dataSource?: DataSourceUpdateOneWithoutTasksNestedInput
    auditLogs?: TaskAuditLogUpdateManyWithoutTaskNestedInput
    updates?: TaskUpdateUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sentdmMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    lastReminderSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    assigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    strategicPillar?: NullableStringFieldUpdateOperationsInput | string | null
    completion?: FloatFieldUpdateOperationsInput | number
    riskIndicator?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    nextStep?: NullableStringFieldUpdateOperationsInput | string | null
    ceoNotes?: NullableStringFieldUpdateOperationsInput | string | null
    sourceMonth?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    dataSourceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditLogs?: TaskAuditLogUncheckedUpdateManyWithoutTaskNestedInput
    updates?: TaskUpdateUncheckedUpdateManyWithoutTaskNestedInput
  }

  export type UserUpsertWithoutNotificationsInput = {
    update: XOR<UserUpdateWithoutNotificationsInput, UserUncheckedUpdateWithoutNotificationsInput>
    create: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutNotificationsInput, UserUncheckedUpdateWithoutNotificationsInput>
  }

  export type UserUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    receiveTaskReminders?: BoolFieldUpdateOperationsInput | boolean
    receiveDailyDigest?: BoolFieldUpdateOperationsInput | boolean
    receiveWeeklyReport?: BoolFieldUpdateOperationsInput | boolean
    reminderDaysBefore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedTasks?: TaskUpdateManyWithoutOwnerNestedInput
    assignedTasks?: TaskUpdateManyWithoutAssigneeNestedInput
    auditLogs?: TaskAuditLogUpdateManyWithoutUserNestedInput
    contact?: ContactUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    receiveTaskReminders?: BoolFieldUpdateOperationsInput | boolean
    receiveDailyDigest?: BoolFieldUpdateOperationsInput | boolean
    receiveWeeklyReport?: BoolFieldUpdateOperationsInput | boolean
    reminderDaysBefore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedTasks?: TaskUncheckedUpdateManyWithoutOwnerNestedInput
    assignedTasks?: TaskUncheckedUpdateManyWithoutAssigneeNestedInput
    auditLogs?: TaskAuditLogUncheckedUpdateManyWithoutUserNestedInput
    contact?: ContactUncheckedUpdateOneWithoutUserNestedInput
  }

  export type TaskCreateManyOwnerInput = {
    id?: string
    taskId?: string | null
    title: string
    description?: string | null
    sentdmMessageId?: string | null
    lastReminderSentAt?: Date | string | null
    assigneeId?: string | null
    department?: string | null
    priority?: string
    status?: string
    strategicPillar?: string | null
    completion?: number
    riskIndicator?: string | null
    startDate?: Date | string | null
    dueDate?: Date | string | null
    completedAt?: Date | string | null
    notes?: string | null
    nextStep?: string | null
    ceoNotes?: string | null
    sourceMonth?: string | null
    source?: string | null
    dataSourceId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskCreateManyAssigneeInput = {
    id?: string
    taskId?: string | null
    title: string
    description?: string | null
    sentdmMessageId?: string | null
    lastReminderSentAt?: Date | string | null
    ownerId?: string | null
    department?: string | null
    priority?: string
    status?: string
    strategicPillar?: string | null
    completion?: number
    riskIndicator?: string | null
    startDate?: Date | string | null
    dueDate?: Date | string | null
    completedAt?: Date | string | null
    notes?: string | null
    nextStep?: string | null
    ceoNotes?: string | null
    sourceMonth?: string | null
    source?: string | null
    dataSourceId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskAuditLogCreateManyUserInput = {
    id?: string
    taskId: string
    action: string
    field?: string | null
    oldValue?: string | null
    newValue?: string | null
    createdAt?: Date | string
  }

  export type NotificationCreateManyUserInput = {
    id?: string
    taskId?: string | null
    type: string
    channel: string
    subject: string
    message: string
    status?: string
    scheduledAt?: Date | string | null
    sentAt?: Date | string | null
    error?: string | null
    createdAt?: Date | string
  }

  export type TaskUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sentdmMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    lastReminderSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    strategicPillar?: NullableStringFieldUpdateOperationsInput | string | null
    completion?: FloatFieldUpdateOperationsInput | number
    riskIndicator?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    nextStep?: NullableStringFieldUpdateOperationsInput | string | null
    ceoNotes?: NullableStringFieldUpdateOperationsInput | string | null
    sourceMonth?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignee?: UserUpdateOneWithoutAssignedTasksNestedInput
    dataSource?: DataSourceUpdateOneWithoutTasksNestedInput
    auditLogs?: TaskAuditLogUpdateManyWithoutTaskNestedInput
    notifications?: NotificationUpdateManyWithoutTaskNestedInput
    updates?: TaskUpdateUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sentdmMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    lastReminderSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    assigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    strategicPillar?: NullableStringFieldUpdateOperationsInput | string | null
    completion?: FloatFieldUpdateOperationsInput | number
    riskIndicator?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    nextStep?: NullableStringFieldUpdateOperationsInput | string | null
    ceoNotes?: NullableStringFieldUpdateOperationsInput | string | null
    sourceMonth?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    dataSourceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditLogs?: TaskAuditLogUncheckedUpdateManyWithoutTaskNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutTaskNestedInput
    updates?: TaskUpdateUncheckedUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateManyWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sentdmMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    lastReminderSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    assigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    strategicPillar?: NullableStringFieldUpdateOperationsInput | string | null
    completion?: FloatFieldUpdateOperationsInput | number
    riskIndicator?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    nextStep?: NullableStringFieldUpdateOperationsInput | string | null
    ceoNotes?: NullableStringFieldUpdateOperationsInput | string | null
    sourceMonth?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    dataSourceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUpdateWithoutAssigneeInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sentdmMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    lastReminderSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    strategicPillar?: NullableStringFieldUpdateOperationsInput | string | null
    completion?: FloatFieldUpdateOperationsInput | number
    riskIndicator?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    nextStep?: NullableStringFieldUpdateOperationsInput | string | null
    ceoNotes?: NullableStringFieldUpdateOperationsInput | string | null
    sourceMonth?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneWithoutOwnedTasksNestedInput
    dataSource?: DataSourceUpdateOneWithoutTasksNestedInput
    auditLogs?: TaskAuditLogUpdateManyWithoutTaskNestedInput
    notifications?: NotificationUpdateManyWithoutTaskNestedInput
    updates?: TaskUpdateUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateWithoutAssigneeInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sentdmMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    lastReminderSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    strategicPillar?: NullableStringFieldUpdateOperationsInput | string | null
    completion?: FloatFieldUpdateOperationsInput | number
    riskIndicator?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    nextStep?: NullableStringFieldUpdateOperationsInput | string | null
    ceoNotes?: NullableStringFieldUpdateOperationsInput | string | null
    sourceMonth?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    dataSourceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditLogs?: TaskAuditLogUncheckedUpdateManyWithoutTaskNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutTaskNestedInput
    updates?: TaskUpdateUncheckedUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateManyWithoutAssigneeInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sentdmMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    lastReminderSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    strategicPillar?: NullableStringFieldUpdateOperationsInput | string | null
    completion?: FloatFieldUpdateOperationsInput | number
    riskIndicator?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    nextStep?: NullableStringFieldUpdateOperationsInput | string | null
    ceoNotes?: NullableStringFieldUpdateOperationsInput | string | null
    sourceMonth?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    dataSourceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskAuditLogUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    field?: NullableStringFieldUpdateOperationsInput | string | null
    oldValue?: NullableStringFieldUpdateOperationsInput | string | null
    newValue?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    task?: TaskUpdateOneRequiredWithoutAuditLogsNestedInput
  }

  export type TaskAuditLogUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    field?: NullableStringFieldUpdateOperationsInput | string | null
    oldValue?: NullableStringFieldUpdateOperationsInput | string | null
    newValue?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskAuditLogUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    field?: NullableStringFieldUpdateOperationsInput | string | null
    oldValue?: NullableStringFieldUpdateOperationsInput | string | null
    newValue?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    task?: TaskUpdateOneWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskAuditLogCreateManyTaskInput = {
    id?: string
    userId?: string | null
    action: string
    field?: string | null
    oldValue?: string | null
    newValue?: string | null
    createdAt?: Date | string
  }

  export type NotificationCreateManyTaskInput = {
    id?: string
    userId?: string | null
    type: string
    channel: string
    subject: string
    message: string
    status?: string
    scheduledAt?: Date | string | null
    sentAt?: Date | string | null
    error?: string | null
    createdAt?: Date | string
  }

  export type TaskUpdateCreateManyTaskInput = {
    id?: string
    source: string
    content: string
    createdAt?: Date | string
  }

  export type TaskAuditLogUpdateWithoutTaskInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    field?: NullableStringFieldUpdateOperationsInput | string | null
    oldValue?: NullableStringFieldUpdateOperationsInput | string | null
    newValue?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutAuditLogsNestedInput
  }

  export type TaskAuditLogUncheckedUpdateWithoutTaskInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    field?: NullableStringFieldUpdateOperationsInput | string | null
    oldValue?: NullableStringFieldUpdateOperationsInput | string | null
    newValue?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskAuditLogUncheckedUpdateManyWithoutTaskInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    field?: NullableStringFieldUpdateOperationsInput | string | null
    oldValue?: NullableStringFieldUpdateOperationsInput | string | null
    newValue?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUpdateWithoutTaskInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateWithoutTaskInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutTaskInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUpdateUpdateWithoutTaskInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUpdateUncheckedUpdateWithoutTaskInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUpdateUncheckedUpdateManyWithoutTaskInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskCreateManyDataSourceInput = {
    id?: string
    taskId?: string | null
    title: string
    description?: string | null
    sentdmMessageId?: string | null
    lastReminderSentAt?: Date | string | null
    ownerId?: string | null
    assigneeId?: string | null
    department?: string | null
    priority?: string
    status?: string
    strategicPillar?: string | null
    completion?: number
    riskIndicator?: string | null
    startDate?: Date | string | null
    dueDate?: Date | string | null
    completedAt?: Date | string | null
    notes?: string | null
    nextStep?: string | null
    ceoNotes?: string | null
    sourceMonth?: string | null
    source?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskUpdateWithoutDataSourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sentdmMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    lastReminderSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    strategicPillar?: NullableStringFieldUpdateOperationsInput | string | null
    completion?: FloatFieldUpdateOperationsInput | number
    riskIndicator?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    nextStep?: NullableStringFieldUpdateOperationsInput | string | null
    ceoNotes?: NullableStringFieldUpdateOperationsInput | string | null
    sourceMonth?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneWithoutOwnedTasksNestedInput
    assignee?: UserUpdateOneWithoutAssignedTasksNestedInput
    auditLogs?: TaskAuditLogUpdateManyWithoutTaskNestedInput
    notifications?: NotificationUpdateManyWithoutTaskNestedInput
    updates?: TaskUpdateUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateWithoutDataSourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sentdmMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    lastReminderSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    assigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    strategicPillar?: NullableStringFieldUpdateOperationsInput | string | null
    completion?: FloatFieldUpdateOperationsInput | number
    riskIndicator?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    nextStep?: NullableStringFieldUpdateOperationsInput | string | null
    ceoNotes?: NullableStringFieldUpdateOperationsInput | string | null
    sourceMonth?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditLogs?: TaskAuditLogUncheckedUpdateManyWithoutTaskNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutTaskNestedInput
    updates?: TaskUpdateUncheckedUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateManyWithoutDataSourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sentdmMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    lastReminderSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    assigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    strategicPillar?: NullableStringFieldUpdateOperationsInput | string | null
    completion?: FloatFieldUpdateOperationsInput | number
    riskIndicator?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    nextStep?: NullableStringFieldUpdateOperationsInput | string | null
    ceoNotes?: NullableStringFieldUpdateOperationsInput | string | null
    sourceMonth?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}