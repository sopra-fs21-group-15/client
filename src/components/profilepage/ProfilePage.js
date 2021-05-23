import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import User from "../shared/models/User";
import Profile from "../../views/Profile";


const Users = styled.div`
  list-style: square;
  padding-left: 0px;
  padding-bottom: 10px;
  max-height: 150px;
  overflow-y: auto;
`;


const Button = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  &:focus {
    border-radius: 0px;
    background: rgba(255, 255, 255, 1);
  }

  padding: 6px;
  padding-left: 30px;
  padding-right: 30px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 13px;
  text-align: center;
  color: black;
  width: ${props => props.width || null};
  height: 35px;
  border: none;
  border-radius: 20px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: rgb(230, 238, 235);
  transition: all 0.3s ease;
  margin: center;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
  margin-top: 5px;
  min-width: 200px;
  width: 25%;
`;

const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 600px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: linear-gradient(rgb(255,255,255), rgb(180, 190, 200));
  color: black;
`;

const FriendsList = styled.li`
  font-weight: bold;
  color: black;
  
`;

const FriendsListBox = styled.div`
  margin: 3px 0;
  width: 320px;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  border: 1px solid #ffffff70;
  
`;



class ProfilePage extends React.Component {
  constructor() {
    super();
    this.state = {
        user: null,
        userId: localStorage.getItem("visited User"), /** get the ID of the visited profile **/
        loggedInUser: localStorage.getItem("loginId"), /** get the ID of the logged in user **/
        actualFriend: false,
        users: null,
        myUser: null,
        friends: []

    };
    this.getUser();
    this.getMyUser();
  }

  async getUser() {
    const url = '/users/' + this.state.userId;
    // wait for the user information
    const response = await api.get(url);
    const user = new User(response.data);
    this.setState({user : user})
  }

  async getMyUser(){
      const url = '/users/' + this.state.loggedInUser;
      // wait for the user information
      const response = await api.get(url);
      const myUser = new User(response.data);
      this.setState({myUser : myUser})

  }

    // method to check if friend is actually my friend or not
  checkIfFriend(){
              if (this.state.myUser.friendsList.includes(this.state.user.username)) {
                  this.setState({actualFriend: true})}
              else this.setState({actualFriend: false})}

   // method to add a friend
  async addFriends(){
      const requestBody = JSON.stringify({
          username: this.state.user.username
      })

      const url = '/users/' + this.state.loggedInUser + '/friendsList';
      const response = await api.put(url,requestBody);
      const myUser = new User(response.data)
      this.setState({myUser:myUser})
      this.checkIfFriend()

  }
    // method to remove friends
  async removeFriends(){
      const requestBody = JSON.stringify({
          username: this.state.user.username
      })
      const url = '/users/' + this.state.loggedInUser + '/removeFriendList';
      const response = await api.put(url,requestBody);
      const myUser = new User(response.data)
      this.setState({myUser:myUser})
      this.checkIfFriend()
  }

  displayFriends(){
      this.state.myUser.friendsList.forEach(iter =>{
          this.state.friends.push(iter)
      })
  }

  //can be extended if I will go directly to my friends Profile from my Friendslist
  go_to_profile(user) {
        // set the id for the profile the user is visiting
        localStorage.setItem("visited User", user.id);
        // go to profile page
        this.props.history.push("/game/dashboard/profilepage");
    }

  // method to check if user is in my friendsList
    async componentDidMount() {
        try {
            const response = await api.get('/users');
            this.setState({ users: response.data });

            const url = '/users/' + this.state.loggedInUser;
            // wait for the user information
            const response2 = await api.get(url);
            const myUser = new User(response2.data);
            this.setState({myUser : myUser})

        } catch (error) {
            alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
        }

        this.checkIfFriend()
        this.displayFriends()

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    this.getUser()

  }

    render() {
        return (
            /** If they are the same, you can edit the page **/
            <BaseContainer>
                <FormContainer>
                    <Form>
                        <center><h1><u>Profile Page</u></h1></center>
                        {this.state.user?
                        (<Profile user={this.state.user}/>): ("")}
                        {this.state.loggedInUser === this.state.userId ?
                            <h2><u>Friends</u></h2> : ("")}
                        {this.state.loggedInUser === this.state.userId ?(

                            <Users>
                        {this.state.friends.map(user => {
                            return (
                                <FriendsListBox>
                                    <center><FriendsList>{user}</FriendsList></center>
                                </FriendsListBox>
                            )
                        })}
                            </Users>
                            ):("")}

                            {this.state.loggedInUser === this.state.userId ?
                            <Button
                                disabled={this.state.loggedInUser !== this.state.userId}
                                width="100%"
                                onClick={() => {
                                    localStorage.setItem("chosenUserEdit", this.state.userId);
                                    this.props.history.push("/game/dashboard/profilepage/editprofile");
                                }}
                            >
                                Edit Profile
                            </Button> :  this.state.actualFriend ? <Button
                                    width="100%"
                                    onClick={() => {
                                        this.removeFriends();
                                    }}>
                                    remove Friend
                                </Button>
                                    :
                                    <Button
                                    width="100%"
                                    onClick={() => {
                                        this.addFriends();
                                    }}>
                                    add Friend
                                </Button>
                            }
                        <Button
                            width="100%"
                            onClick={() => {
                                this.props.history.push("/game/dashboard");
                            }}
                        >
                            Go back
                        </Button>
                    </Form>
                </FormContainer>
            </BaseContainer>
            );
    }
}


export default withRouter(ProfilePage);
