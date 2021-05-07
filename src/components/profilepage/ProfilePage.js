import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';
import User from "../shared/models/User";
import Profile from "../../views/Profile";

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
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



class ProfilePage extends React.Component {
  constructor() {
    super();
    this.state = {
        friends: null,
        user: null,
        userId: localStorage.getItem("visited User"), /** get the ID of the visited profile **/
        loggedInUser: localStorage.getItem("loginId"), /** get the ID of the logged in user **/
        friendsId: localStorage.getItem("friends"),
        actualFriend: false
    };
    this.getUser();
    this.getFriends();
  }

  async getUser() {
    const url = '/users/' + this.state.userId;
    // wait for the user information
    const response = await api.get(url);
    const user = new User(response.data);
    this.setState({user : user})
  }

  async getFriends(){
      const url = '/friends/'+this.state.friendsId;
      const response = await api.get(url);
      const friends = new User(response.data);
      this.setState({friends: friends.username})
  }

  // NOT SURE IF NEEDED MAYBE ALSO POSSIBLE WIT LOCALSTORAGE
    async addFriends(){
      const url = '/friends/' + this.state.userId;
      const response = await api.put(url);
      const friend = new User(response.data);
      localStorage.setItem('friends',friend.username);
  }

  async removeFriends(){
      const url = '/friends/' + this.state.userId + '/remove';
      const response = await api.put(url);
      const friends = new User(response.data);
      localStorage.removeItem('friends', friends.username);
  }





  componentDidUpdate(prevProps, prevState, snapshot) {
    this.getUser()
      this.getFriends()
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
                        <ButtonContainer>
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
                            </Button> : this.state.actualFriend ? <Button
                                    width="100%"
                                    onClick={() => {
                                        this.removeFriends();
                                        this.state.actualFriend = false;
                                    }}>
                                    remove Friend
                                </Button>
                                    :
                                    <Button
                                    width="100%"
                                    onClick={() => {
                                        this.addFriends();
                                        this.state.actualFriend = true;
                                    }}>
                                    add Friend
                                </Button>
                            }
                        </ButtonContainer>

                        <ButtonContainer>
                        <Button
                            width="100%"
                            onClick={() => {
                                this.props.history.push("/game/dashboard");
                            }}
                        >
                            Go back
                        </Button>
                        </ButtonContainer>
                    </Form>
                </FormContainer>
            </BaseContainer>
            );
    }
}


export default withRouter(ProfilePage);
