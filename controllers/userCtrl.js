const { findByAllUsers } = require("../database/userDb");

const userCtrl = async (query) => {
   const { total_users, list_users, per_page, page } = await findByAllUsers(query);
   const total_pages = Math.ceil(total_users / per_page);
   return { total_users, per_page, total_pages, page, list_users };
};

module.exports = { userCtrl };
