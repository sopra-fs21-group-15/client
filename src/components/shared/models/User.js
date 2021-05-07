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
    this.birth_date = null; //added birth date
    this.creation_date = null; //added creation date
    this.friends = data.friends;
    Object.assign(this, data);
  }


}
export default User;
