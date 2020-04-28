import React, {Component} from 'react';
import {Layout, Menu} from "antd";

const {Header} = Layout;
export default class Head extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className={"header"} >
                <h1 style={{color:"white",marginTop:'14px'}}>Bipolar Factory</h1>
            </div>
        );
    }
}