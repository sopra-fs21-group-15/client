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
        user: null,
        userId: localStorage.getItem("visited User"), /** get the ID of the visited profile **/
        loggedInUser: localStorage.getItem("loginId"), /** get the ID of the logged in user **/
        actualFriend: false,
        users: null,
        myUser: null

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


  checkIfFriend(){
              if (this.state.myUser.friendsList.includes(this.state.user.username)) {
                  this.setState({actualFriend: true})
      }
              else this.setState({actualFriend: false})}


  async addFriends(){
      const requestBody = JSON.stringify({
          username: this.state.user.username
      })

      const url = '/users/' + this.state.loggedInUser + '/friendsList';
      const response = await api.put(url,requestBody);
      const myUser = new User(response.data)
      this.setState({myUser:myUser})
      //this.setState({actualFriend: true})
      console.log("----------------")
      await this.checkIfFriend()
      //console.log(user.friendsList.length)
      //console.log(user.friendsList[1])
      console.log(myUser.friendsList)
      console.log(this.state.user)


  }

  async removeFriends(){
      const requestBody = JSON.stringify({
          username: this.state.user.username
      })
      const url = '/users/' + this.state.loggedInUser + '/removeFriendList';
      const response = await api.put(url,requestBody);
      const myUser = new User(response.data)
      this.setState({myUser:myUser})
      //this.setState({actualFriend: false})
      await this.checkIfFriend()
      console.log("----------------")
      console.log(myUser.friendsList)
      console.log(this.state.user)

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

        //console.log(this.state.myUser.friendsList)
        //console.log(this.state.users[3].username)

        this.checkIfFriend()



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
