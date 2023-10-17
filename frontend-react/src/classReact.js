import React, { Component } from 'react';
import axios from 'axios';

//to import css
import './css/homepage.css'
const API_URL = 'https://monster-cat-world.onrender.com'

class App extends React.Component {


  constructor() {
    super()
    /*to use state*/
    this.state = {
      //this.state.*text1* to use state
      //this.setState({*text1*:'text'})
      text1: 'Click to pick player',
      text2: 1,
      name: "Player's Name"
    }
  }


  //functions here
  //this.buttonClicked() to use function
  buttonClicked() {
    //to increment from previous state
    this.setState(prevState => ({ text2: prevState.text2 + 1 }))
    this.setState({ text1: `player ${this.state.text2}` })
  }

  //using axios 
  getName() {
    axios.get(`${API_URL}/api/players/getPlayerInfo/${(this.state.text2) - 1}`)
      .then((response) => {
        this.setState({ name: response.data.player_username });
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //when the document loads
  //class version of useEffect
  componentDidMount() {

  }


  render() {
    return (
      <div>
        <p style={{ color: 'white' }}>{this.state.text1}</p>
        <button onClick={() => { this.buttonClicked(); }}>Click This</button>
        <p style={{ color: 'white' }}>{this.state.name}</p>
        <button onClick={() => { this.getName(); }}>Click This</button>
      </div>
    );
  }
}

export default App;