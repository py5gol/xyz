// Create ACL connection pool for PostgreSQL.
module.exports = async () => {

  const acl_connection = (process.env.PUBLIC || process.env.PRIVATE) ?
    (process.env.PUBLIC || process.env.PRIVATE).split('|') : null;

  if (!acl_connection) return;

  if (!process.env.SECRET) {
    console.log('No secret provided for JWT. Process will be killed now!');
    return process.exit();
  }

  const acl_table = acl_connection[1].split('.').pop();

  const acl_schema = acl_connection[1].split('.')[0] === acl_table ? 'public' : acl_connection[1].split('.')[0];

  // Set the maximum number of failed login attempts before an account will be locked.
  global.failed_attempts = parseInt(process.env.FAILED_ATTEMPTS) || 3;

  // Create PostgreSQL connection pool for ACL table.
  const pool = new require('pg').Pool({
    connectionString: acl_connection[0]
  });
  
  // Method to query ACL. arr must be empty array by default.
  global.pg.users = async (q, arr) => {

    try {
      const { rows } = await pool.query(q.replace(/acl_table/g, acl_table).replace(/acl_schema/g, acl_schema), arr);
      return rows;
    
    } catch (err) {
      Object.keys(err).forEach(key => !err[key] && delete err[key]);
      console.error(err);
      return { err: err };
    }

  };
    
  // Check ACL
  const user_schema = {
    _id: 'integer',
    email: 'text',
    password: 'text',
    verified: 'boolean',
    approved: 'boolean',
    admin: 'boolean',
    verificationtoken: 'text',
    approvaltoken: 'text',
    failedattempts: 'integer',
    password_reset: 'text',
    api: 'text'
  };
    
  const users = await global.pg.users(`
  SELECT column_name, data_type
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE table_name = 'acl_table'
    AND table_schema = 'acl_schema';`);
    
  if (users.length === 0) {

    // Set the default password for the admin user.
    const password = require('bcrypt-nodejs').hashSync('admin123', require('bcrypt-nodejs').genSaltSync(8));
    
    const create_acl = await global.pg.users(`
    CREATE TABLE IF NOT EXISTS acl_schema.acl_table (
	    "_id" serial not null,
	    email text not null,
	    password text not null,
	    verified boolean,
	    approved boolean,
	    admin boolean,
	    verificationtoken text,
	    approvaltoken text,
	    failedattempts integer default 0,
	    password_reset text,
	    api text
    );
    
    INSERT INTO acl_schema.acl_table (email, password, verified, approved, admin)
    SELECT
      'admin@geolytix.xyz' AS email,
      '${password}' AS password,
      true AS verified,
      true AS approved,
      true AS admin;
    `);

    console.log('A new ACL has been created');  

  } else if (users.some(row => (!user_schema[row.column_name] || user_schema[row.column_name] !== row.data_type))) {
    console.log('There seems to be a problem with the ACL configuration.');

  }
  
};