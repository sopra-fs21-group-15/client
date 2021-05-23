import React from 'react';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import { withRouter } from 'react-router-dom';
import { InputField } from '../../views/design/InputField.js';
import { Button } from '../../views/design/Button';
import { FormContainer } from '../../views/design/FormContainer.js';
import { Legend } from '../../views/design/Legend.js';
import { Label } from '../../views/design/Label.js';
import { HR } from '../../views/design/HR.js';


/**
 * Classes in React allow you to have an internal state within the class and to have the React life-cycle for your component.
 * You should have a class (instead of a functional component) when:
 * - You need an internal state that cannot be achieved via props from other parent components
 * - You fetch data from the server (e.g., in componentDidMount())
 * - You want to access the DOM via Refs
 * https://reactjs.org/docs/react-component.html
 * @Class
 */
class Login extends React.Component {
  /**
   * If you don’t initialize the state and you don’t bind methods, you don’t need to implement a constructor for your React component.
   * The constructor for a React component is called before it is mounted (rendered).
   * In this case the initial state is defined in the constructor. The state is a JS object containing two fields: password and username
   * These fields are then handled in the onChange() methods in the resp. InputFields
   */
  constructor() {
    super();
    this.state = {
      password: null,
      username: null
    };
  }
  /**
   * HTTP POST request is sent to the backend.
   * If the request is successful, a new user is returned to the front-end
   * and its token is stored in the localStorage.
   */
  async login() {
    try {
      const requestBody = JSON.stringify({
        username: this.state.username,
        password: this.state.password
      });
      /** await the confirmation of the backend **/
      const response = await api.put('/login', requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Save the log-in Id + username
      localStorage.setItem('loginId', user.id);
      localStorage.setItem('username', user.username);
      localStorage.setItem('visited User',user.username)

      // Store the token into the local storage.
      localStorage.setItem('token', user.token);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      this.props.history.push(`/game`);
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
      this.props.history.push(`/login`); //redirect user to login page
    }
  }

  /**
   *  Every time the user enters something in the input field, the state gets updated.
   * @param key (the key of the state for identifying the field that needs to be updated)
   * @param value (the value that gets assigned to the identified state key)
   */
  handleInputChange(key, value) {
    // Example: if the key is username, this statement is the equivalent to the following one:
    // this.setState({'username': value});
    this.setState({ [key]: value });
  }

  render() {
    return (
      <BaseContainer style={{marginTop: 40+"px"}}>
        <FormContainer>
          <Legend>Login</Legend>
          <Label>Username</Label>
          <InputField size={40} placeholder="Please enter here.." onChange={e => { this.handleInputChange('username', e.target.value); }} />
          <Label>Password</Label>
          <InputField size={40} placeholder="Please enter here.." onChange={e => { this.handleInputChange('password', e.target.value); }} type="password" />
          <HR/>
          <Button width={"30%"} disabled={!this.state.username || !this.state.password} onClick={() => { this.login(); }}>Login</Button>
          <Button style={{marginTop:10+"px"}} width={"30%"} onClick={() => {this.props.history.push("/registration");}}>Register</Button>
        </FormContainer>
      </BaseContainer>
    );  }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Login);
