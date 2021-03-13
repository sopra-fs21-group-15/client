import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import Player from '../../views/Player';
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { Profilebutton } from '../../views/design/Profilebutton';
import { withRouter } from 'react-router-dom';
import User from "../shared/models/User";
import Profile from "../../views/Profile";

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
  width: 150%;
  height: 400px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: linear-gradient(rgb(27, 124, 186), rgb(2, 46, 101));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const InputField = styled.input`
  &::placeholder {
    color: rgba(255, 255, 255, 1.0);
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
`;

const Label = styled.label`
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
`;

const PlayerContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

class EditProfile extends React.Component {
  constructor() {
    super();
    this.state = {
        birthdate: null,
        userId: localStorage.getItem("visited User"),
        loggedInUser: localStorage.getItem("loginId"),
        log:localStorage.getItem("log")
    };
    this.getUser();
  }

  async getUser() {
    const url = '/users/' + this.state.userId;
    const response = await api.get(url);
    const user =new User(response.data);
    this.setState({user : user})
  }

  handleInputChange(key, value) {
    // Example: if the key is username, this statement is the equivalent to the following one:
    // this.setState({'username': value});
    this.setState({ [key]: value });
  }

  componentDidMount() {}

  async edit() {
    try{
        const requestBody_2 = JSON.stringify({
            username: this.state.username,
            birthdate: this.state.birth_date
        });

        const url = '/users/' + this.state.userId;

        await api.put('/users/{id}', requestBody_2);
    }
    catch (error) {
          alert(`Something went wrong during the login: \n${handleError(error)}`);
          this.props.history.push(`/login`); //redirect user to login page
          }
  }

    //if the logged-in user has the same id as the profile you can edit it.

    render() {
        return (
            (this.state.userId !== this.state.loggedInUser) ?
            <Container>
                <h2> NO ACCESS TO THIS PROFILE! </h2>
                <p> You are only allowed to edit the profile, with which you logged in! </p>
                    <ButtonContainer>
                        <Button
                            width="50%"
                            onClick={() => {
                                this.props.history.push("/game/dashboard/profilepage");
                            }}
                        >
                        Go back
                        </Button>
                    </ButtonContainer>
            </Container>
        :
        <BaseContainer>
           <FormContainer>
                <Form>
                    <div>
                    <h2> Edit your Profile! </h2>
                    </div>
                    <Label>Change Username</Label>
                    <InputField
                      placeholder="Please enter new Username here.."
                      onChange={e => {
                        this.handleInputChange('username', e.target.value);
                      }}
                    />

                    <Label>Change Birth Date</Label>
                    <InputField
                      placeholder="Please enter new Birth Date here.."
                      onChange={e => {
                        this.handleInputChange('birthdate', e.target.value);
                      }}
                    />

                    <ButtonContainer>
                      <Button
                        disabled={((this.state.username == null) && (this.state.birthdate == null))}
                        width="100%"
                        onClick={() => {
                          this.edit();
                          this.props.history.push(`/game/dashboard/profilepage`);
                        }}
                      >
                        Save
                      </Button>
                    </ButtonContainer>

                    <ButtonContainer>
                        <Button
                            width="100%"
                            onClick={() => {
                                this.props.history.push(`/game/dashboard/profilepage`);
                            }}
                        >
                        Go back
                        </Button>
                    </ButtonContainer>
                  </Form>
                </FormContainer>
              </BaseContainer>
            );}
}


export default withRouter(EditProfile);
