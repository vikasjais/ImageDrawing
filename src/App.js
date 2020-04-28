import React, {Component} from 'react';
import './App.css';
import {Layout,Card} from 'antd';
import Header from "./Components/Header";
import Trial from "./Components/trial";
const {Content} = Layout;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
        <div className="App">
          <Layout style={{backgroundColor: 'MediumSeaGreen',height:'100vh'}}>
            <Header />
            <Content>
              <Trial />
            </Content>
          </Layout>
        </div>
    );
  }
}

export default App;