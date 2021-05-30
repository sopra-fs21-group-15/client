import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import User from "../shared/models/User";
import Profile from "../../views/Profile";
import {OneLineBlock} from "../../views/design/OneLineBlock";
import Player from "../../views/Player";
import FriendRequest from "../../views/FriendRequest";


const Users = styled.ul`
  list-style: none;
  padding-left: auto;
  padding-right: auto;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 1px;
  max-height: 279px;
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
  background: none;
  color: white;
`;

const PlayerContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;



class ProfilePage extends React.Component {
  constructor() {
    super();
    this.state = {
        user: null,
        userId: localStorage.getItem("visited User"), /** get the ID of the visited profile **/
        loggedInUser: localStorage.getItem("loginId"), /** get the ID of the logged in user **/
        actualFriend: false,
        sendRequest: false,
        users: null,
        myUser: null,
        usersByUserNameRequests: [],
        friendsRequest: [],
        friendsList: [],
        usersByUserNameFriends: []

    };
    this.getUser();
    this.getMyUser();
    this.getUsersByUsernameFriendRequests();
    this.getUsersByUsernameFriends();
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

  async sendFriendsRequest(){
      const requestBody = JSON.stringify({
          username: this.state.user.username
      })
      console.log(requestBody)
      const url = '/users/'+this.state.loggedInUser+'/friends/requests';
      await api.put(url,requestBody);
      console.log(requestBody,url)
      this.refreshPage()

  }

  async acceptFriendsRequest(user){
      const requestBody = JSON.stringify({
          username: user.username
      })
      const url = '/users/'+this.state.loggedInUser+'/friends/confirmations';
      await api.put(url,requestBody);
      this.refreshPage()
  }

  async deleteFriend(){
      const requestBody = JSON.stringify({
          username: this.state.user.username
      })
      const url = '/users/'+this.state.loggedInUser+'/friends/deletions';
      await api.put(url,requestBody);
      this.displayFriends()
      this.displayFriendsRequest()
      this.refreshPage()
  }

  async rejectFriendRequest(user){
      const requestBody = JSON.stringify({
          username: user.username
      })
      const url = '/users/'+this.state.loggedInUser+'/friends/rejections';
      await api.put(url,requestBody);
      this.refreshPage()
  }

  async getUsersByUsernameFriendRequests(){
      for (const iter of this.state.friendsRequest) {
      const requestBody = JSON.stringify({
          username: String(iter)
      })
      const url = '/users/userNames';
      const response = await api.put(url,requestBody);
      const usersByUserName = new User(response.data);
      this.state.usersByUserNameRequests.push(usersByUserName);
      }
  }

    async getUsersByUsernameFriends(){
        for (const iter of this.state.friendsList) {
            const requestBody = JSON.stringify({
                username: String(iter)
            })
            const url = '/users/userNames';
            const response = await api.put(url,requestBody);
            const usersByUserName = new User(response.data);
            this.state.usersByUserNameFriends.push(usersByUserName);
        }
    }

  // method to check if friend is actually my friend or not
  checkIfRequestSend() {
    if (this.state.user.friendRequestList.includes(this.state.myUser.username))
      this.setState({sendRequest: true});
    else
      this.setState({sendRequest: false});
  }

  checkIfAccepted(){
    if (this.state.myUser.friendsList.includes(this.state.user.username))
      this.setState({actualFriend: true});
    else
      this.setState({actualFriend: false});
  }


    //This method is required that the code is working
  displayFriendsRequest(){
      this.state.myUser.friendRequestList.forEach(iter =>{
          this.state.friendsRequest.push(String(iter))
      })
  }

  displayFriends(){
    this.state.myUser.friendsList.forEach(iter =>{
      this.state.friendsList.push(String(iter));
    });
  }

  //refresh page after clicking on button
  refreshPage() {
        window.location.reload(false);
    }
  //can be extended if I will go directly to my friends Profile from my Friendslist
  go_to_profile(user) {
        // set the id for the profile the user is visiting
        localStorage.setItem("visited User", user.id);
        // go to profile page
        this.props.history.push("/profilePage");
        this.refreshPage()
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
        this.checkIfAccepted()
        this.checkIfRequestSend()
        this.displayFriends();
        this.displayFriendsRequest();
        await this.getUsersByUsernameFriendRequests();
        await this.getUsersByUsernameFriends();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    this.getUser();
  }

    render() {
        return (
            /** If they are the same, you can edit the page **/
            <BaseContainer style={{width:80+"%", marginTop: "-1px"}}>
                    <Form>
                        <center><h1><u>Profile Page</u></h1></center>
                        {this.state.loggedInUser === this.state.userId?
                        <OneLineBlock style={{height:"400px", marginTop:"-10px"}}>
                            <div style={{height:"250px"}}>
                                <h2 style={{marginBottom:"50px",marginTop:"-50px",marginLeft: "auto", marginRight: "auto"}}>User Stats</h2>
                        {this.state.user?
                        (<Profile user={this.state.user}/>): ("")}
                            </div>
                            <div style={{marginLeft: "auto",marginRight: "auto"}}>
                                <div style={{height:"250px"}}>
                                <h2 style={{marginTop:"-100px"}}>Friends</h2>
                            <Users>
                        {this.state.usersByUserNameFriends.map(user => {
                            return (
                                <PlayerContainer>
                                    <Player user={user} f_onClick={() => this.go_to_profile(user)}/>
                                </PlayerContainer>
                            )
                        })}
                            </Users>
                                </div>
                            </div>

                            <div style={{marginLeft: "auto",marginRight: "auto"}}>
                                    <div style={{height:"250px"}}>
                                        <h2 style={{marginTop:"-100px"}}>Friends Requests</h2>
                                    <Users>
                                        {this.state.usersByUserNameRequests.map(user => {
                                            return (
                                                <PlayerContainer>
                                                    <FriendRequest user={user} accept={() => this.acceptFriendsRequest(user)} reject={() => this.rejectFriendRequest(user)}/>
                                                </PlayerContainer>)
                                        })}
                                    </Users>
                                    </div>
                            </div>
                        </OneLineBlock>:
                            <OneLineBlock style={{height:"400px", marginTop:"-10px"}}>
                                <div style={{height:"250px",marginLeft: "auto", marginRight: "auto"}}>
                                    <h2 style={{marginBottom:"50px",marginTop:"-50px",marginLeft: "auto", marginRight: "auto"}}>User Stats</h2>
                                    {this.state.user?
                                        (<Profile user={this.state.user}/>): ("")}
                                </div>
                            </OneLineBlock>
                        }
                            {this.state.loggedInUser === this.state.userId ?
                            <Button
                                disabled={this.state.loggedInUser !== this.state.userId}
                                width="100%"
                                onClick={() => {
                                    localStorage.setItem("chosenUserEdit", this.state.userId);
                                    this.props.history.push("editProfile");
                                }}
                            >
                                Edit Profile
                            </Button> :  this.state.actualFriend?
                                    <Button width={"100%"}
                                            onClick={() => {this.deleteFriend()}}>
                                        Delete Friend
                                    </Button>
                                    :
                                    this.state.sendRequest ? <Button
                                    width="100%"
                                    disabled={this.state.sendRequest}>
                                    wait for confirmation
                                </Button>
                                    :
                                    <Button

                                    width="100%"
                                    onClick={() => {this.sendFriendsRequest();
                                    }}>
                                    send Friend Request
                                </Button>
                            }
                        <Button
                            width="100%"
                            onClick={() => {
                                this.props.history.push("mainScreen");
                            }}
                        >
                            Go back
                        </Button>
                    </Form>

            </BaseContainer>
            );
    }
}


export default withRouter(ProfilePage);
