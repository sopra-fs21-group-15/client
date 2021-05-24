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
    this.birthDate = null; //added birth date
    this.creationDate = null; //added creation date
    this.friendsList = data.friendsList;
    this.wins = null;
    Object.assign(this, data);
  }


}
export default User;
