import mysql, { FieldInfo, MysqlError } from 'mysql';

const connectionConfig: mysql.ConnectionConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
};

const connection = mysql.createConnection(connectionConfig);

connection.connect((err: MysqlError) => {    
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

function query<T>(sql: string, args?: any): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    connection.query(sql, args, (err: MysqlError | null, results?: T, fields?: FieldInfo[]) => {
      if (err) {
        return reject(err);
      }
      resolve(results as T);
    });
  });
}

export { connection, query };
