declare module 'connect-pg-simple' {
    import { Store } from 'express-session';
    import { Pool } from 'pg';
  
    interface PgSessionOptions {
      pool?: Pool;
      schemaName?: string;
      tableName?: string;
      pruneSessionInterval?: boolean | number;
    }
  
    function connectPgSimple(session: any): {
      new (options?: PgSessionOptions): Store;
    };
  
    export default connectPgSimple;
  }
  