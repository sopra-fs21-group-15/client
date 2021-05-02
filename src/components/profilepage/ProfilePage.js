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
    };
    this.getUser();
  }

  async getUser() {
    const url = '/users/' + this.state.userId;
    // wait for the user information
    const response = await api.get(url);
    const user = new User(response.data);
    this.setState({user : user})
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
                            <Button
                                disabled={this.state.loggedInUser !== this.state.userId}
                                width="100%"
                                onClick={() => {
                                    localStorage.setItem("chosenUserEdit", this.state.userId);
                                    this.props.history.push("/game/dashboard/profilepage/editprofile");
                                }}
                            >
                                Edit Profile
                            </Button>
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
