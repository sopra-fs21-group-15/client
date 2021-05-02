import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';
import User from "../shared/models/User";

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
  background: linear-gradient(rgb(255,255,255), rgb(180, 190, 200));
  color: black;
`;

const InputField = styled.input`
   &::placeholder {
    color: black;
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 1);
  color: black;
`;

const Label = styled.label`
  color: black;
  margin-bottom: 10px;
  text-transform: uppercase;
  
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;


class EditProfile extends React.Component {
  constructor() {
    super();
    this.state = {
        birth_date: null,
        userId: localStorage.getItem("visited User"), /** get the ID of the profile --> unnecessary **/
        loggedInUser: localStorage.getItem("loginId"), /** get the ID of the logged in user **/
    };
    this.getUser();
  }

  async getUser() {
    try {
    const url = '/users/' + this.state.userId;
    /** await the profile informations **/
    const response = await api.get(url);
    const user =new User(response.data);
    this.setState({user : user})
  }
  catch (error) {
        alert(`Something went wrong during the edit: \n${handleError(error)}`);
        this.props.history.push(`/game/dashboard/profilepage/editprofile`); //redirect user to edit page
      }
  }

  handleInputChange(key, value) {
    // Example: if the key is username, this statement is the equivalent to the following one:
    // this.setState({'username': value});
    this.setState({ [key]: value });
  }

  async edit() {
    try{
        const requestBody_2 = JSON.stringify({
            username: this.state.username,
            birth_date: this.state.birth_date
        });

        const url = '/users/' + this.state.userId;
        /** give the changes to the backend **/
        await api.put(url, requestBody_2);
    }
    catch (error) {
          alert(`Something went wrong during the login: \n${handleError(error)}`);
          this.props.history.push(`/login`); //redirect user to login page
          }
  }

    //if the logged-in user has the same id as the profile you can edit it.

    render() {
        return (
        <BaseContainer>
           <FormContainer>
                <Form>
                    <div>
                    <h1> Edit your Profile! </h1>
                    </div>
                    <Label>Change Username</Label>
                    <InputField
                      placeholder="Please enter new Username here.."
                      onChange={e => {
                        this.handleInputChange('username', e.target.value);
                          /** change username **/
                      }}
                    />

                    <Label>Change Birth Date</Label>
                    <InputField
                      placeholder="Please enter new Birth Date here.."
                      onChange={e => {
                        this.handleInputChange('birth_date', e.target.value);
                        /** change birth date **/
                      }}
                    />

                    <ButtonContainer>
                      <Button
                        disabled={((this.state.username == null) && (this.state.birth_date == null))}
                        width="100%"
                        onClick={() => {
                          this.edit();
                          this.props.history.push(`/game/dashboard/profilepage`);
                          /** save button **/
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
