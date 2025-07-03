import db from "#db/client";
import bcrypt from "bcrypt";

export const createUser = async (username, password) => {
  const sql = `
    INSERT INTO users (username, password)
    VALUES ($1, $2)
    RETURNING users.id, users.username;
  `;
  const hashPassword = await bcrypt.hash(password, 10);
  const {rows: [user]} = await db.query(sql, [username, hashPassword]);
  return user;
}

export const getUserByUsernameAndPassword = async (username, password) => {
  const sql = `
    SELECT * FROM users
    WHERE username = $1;
  `;
  const {rows: [user]} = await db.query(sql, [username]);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if(!isValid) return null;

  return user;
}

export const getUserById = async (id) => {
  const sql = `
    SELECT * FROM users
    WHERE id = $1;
  `;
  const {rows: [user]} = await db.query(sql, [id]);
  return user;
}