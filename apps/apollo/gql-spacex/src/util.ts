
import {DataType, Sequelize} from 'sequelize-typescript';

export const paginateResults = ({
  after: cursor,
  pageSize = 20,
  results,
  // can pass in a function to calculate an item's cursor
  getCursor = (ab:any) => null,
}) => {
  if (pageSize < 1) return [];

  if (!cursor) return results.slice(0, pageSize);
  const cursorIndex = results.findIndex(item => {
    // if an item has a `cursor` on it, use that, otherwise try to generate one
    let itemCursor = item.cursor ? item.cursor : getCursor(item);

    // if there's still not a cursor, return false by default
    return itemCursor ? cursor === itemCursor : false;
  });

  return cursorIndex >= 0
    ? cursorIndex === results.length - 1 // don't let us overflow
      ? []
      : results.slice(
          cursorIndex + 1,
          Math.min(results.length, cursorIndex + 1 + pageSize),
        )
    : results.slice(0, pageSize);
};

export const createStore = () => {
  const db = new Sequelize({
    dialect: 'sqlite',
    storage: './store.sqlite'
  });

  const users = db.define('user', {
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
    email: DataType.STRING,
    profileImage: DataType.STRING,
    token: DataType.STRING,
  });

  const trips = db.define('trip', {
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
    launchId: DataType.INTEGER,
    userId: DataType.INTEGER,
  });

  return { db, users, trips };
};
