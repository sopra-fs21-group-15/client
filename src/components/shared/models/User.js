/**
 * User model
 */

class User {
  constructor(data = {}) {
    this.id = null;
    this.password = null;
    this.username = null;
    this.token = null;
    this.status = null;
    this.birth_date = null;
    this.creation_date = null;
    Object.assign(this, data);
  }


}
export default User;
