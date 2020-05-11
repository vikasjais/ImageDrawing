import React, {Component} from 'react';
import Annotation from "react-image-annotation/lib/components/Annotation";
import Card from "antd/es/card";
import {Button, Col, Empty, List, Row,message} from "antd";
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import Select from "antd/es/select";

const {Option} = Select;
export default class Trial extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAnnotated: false,
            annotations: [],
            annotation: {},
            count: 1,
            savedState: [],
            edit: false,
            e: null,
            drawingName: 1,
            uploadButton:true,
            file: null
        }
        this.clearClickHandler = this.clearClickHandler.bind(this);
        this.renderEditor = this.renderEditor.bind(this);
        this.onChange = this.onChange.bind(this);
        this.saveState = this.saveState.bind(this);
        this.setDrawing = this.setDrawing.bind(this);
        this.deleteDrawing = this.deleteDrawing.bind(this);
        this.clearAllStates = this.clearAllStates.bind(this);
        this.uploadImage=this.uploadImage.bind(this);
        this.fileValidation=this.fileValidation.bind(this);
    }

    saveState() {
        let {savedState, e} = this.state;
        if (this.state.annotations.length === 0 && this.state.e !== null) {
            savedState.splice(e, 1);
            this.setState({savedState: savedState,edit: false,count: 1,e:null})
            this.clearClickHandler();
            return;
        } else if(this.state.annotations.length !== 0){
            if (!this.state.edit) {
                savedState.push(this.state.annotations);
                this.setState({savedState: savedState, count: 1, drawingName: ++this.state.drawingName,e:null})
                this.clearClickHandler();
            } else {
                savedState[e] = this.state.annotations;
                this.setState({savedState: savedState, edit: false, count: 1,e:null})
                this.clearClickHandler();

            }
        }

    }

    deleteDrawing(i){
        let {savedState} = this.state;
        savedState.splice(i, 1);
        this.clearClickHandler();
        this.setState({savedState:savedState})
    }
    setDrawing(e) {

        this.setState({
            e: e,
            annotations: this.state.savedState[e],
            edit: true,
            count: this.state.savedState[e][this.state.savedState[e].length - 1].data.id
        })
        console.log(this.state.annotations);
    }
    clearAllStates(){
        this.clearClickHandler();
        this.setState({savedState:[],count:1,drawingName:1})
    }


    clearClickHandler() {
        this.setState({
            annotations: [],
            isAnnotated: true,count:1
        })
    }

    onChange = (annotation) => {
        this.setState({annotation})
    }
    onSubmit = (annotation) => {
        const {geometry} = annotation
        let text = "ID: " + String(this.state.count);
        var data = {
            text: text
        }
        this.state.count++;
        this.setState({
            annotation: {},
            annotations: this.state.annotations.concat({
                geometry,
                data: {
                    ...data,
                    id: this.state.count,
                    x: this.state.drawingName
                }
            }),
            isAnnotated: true
        })
    }
    deleteHandler = (event) => {
        console.log(event);
        const index = event.target.dataset.index;
        this.setState(state => {
            let tasks = [...state.annotations]
            tasks.splice(index, 1);
            return {
                annotations: tasks,
                isAnnotated: true
            };
        });

    }

    renderEditor(props) {

        const {geometry} = props.annotation
        if (!geometry) return null
        return (
            <div
                style={{
                    background: 'dodgerblue',
                    borderRadius: 3,
                    position: 'absolute',
                    left: `${geometry.x}%`,
                    top: `${geometry.y + geometry.height}%`,
                }}
            >
                <Button onClick={props.onSubmit} type={'primary'}>Save</Button>
            </div>
        )
    }
    fileValidation() {
        var fileInput =
            document.getElementById('file');

        var filePath = fileInput.value;

        // Allowing file type
        var allowedExtensions =
            /(\.png|\.jpg|\.jpeg)$/i;

        if (!allowedExtensions.exec(filePath)) {

            return false;
        }
        else return true;
    }
    uploadImage(event){
        if(this.fileValidation())
        this.setState({
            file: URL.createObjectURL(event.target.files[0]),uploadButton:false
        })
        else{
        message.error("Please upload image file of \"jpg\" or \"png\" or \"jpeg\" format")
        }
    }

    render() {
        console.log(this.state.annotations);
        console.log(this.state.annotation);
        console.log(this.state.savedState);


        return (
            <div tabIndex="0" onKeyPress={this.handleKeyPress} style={{backgroundColor: 'white'}}>
                <Row>
                    <Col xl={{span: 12}} lg={{span: 12}} md={{span: 24}} sm={{span: 24}} xs={{span: 24}}>
                        <div style={{width: "600px", height: "600px",padding:'15px 15px 15px 15px',textAlign:'center'}}>
                            {(()=>{
                                if(!this.state.uploadButton)
                                    return<div><Annotation
                                        src={this.state.file}
                                        alt='Two pebbles anthropomorphized holding hands'
                                        annotations={this.state.annotations}
                                        type={this.state.type}
                                        value={this.state.annotation}
                                        onChange={this.onChange}
                                        onSubmit={this.onSubmit}
                                        renderEditor={this.renderEditor}

                                    />
                                <br/>
                                <Button style={{marginLeft: '30px'}} type={'primary'} onClick={this.saveState}>
                                    Save State
                                </Button></div>
                                else{
                                    return <div title={'Choose image'} style={{marginTop: '50px'}}>
                                        <h3 style={{marginLeft:'-120px'}} >Choose Image File of "jpg" or "jpeg" or "png" format</h3>
                                        <input type="file" id={"file"}  onChange={this.uploadImage}/>
                                    </div>
                                }
                            })()}

                        </div>
                        <br/>
                    </Col>
                    <Col xl={{span: 6}} lg={{span: 6}} md={{span: 12}} sm={{span: 12}} xs={{span: 12}}>
                        <Card type={'inner'}
                              style={{minHeight: "400px", border: "1px solid #BEBEBE", margin: '20px 20px 20px 20px'}}
                              align="center" title={"Rectangles"}>
                            <div className={"annotation-scroller"}>
                                {this.state.annotations.map((annotations, i) =>
                                    <List bordered={true} key={i} style={{height: "30px", marginBottom: '4px'}}>

                                        <h3 style={{
                                            float: 'left',
                                            marginLeft: '20px'
                                        }}>Rectangle {annotations.data.text}</h3>
                                        <Button style={{float: 'right', height: '30px'}} type={"danger"} data-index={i}
                                                onClick={this.deleteHandler}><DeleteOutlined/></Button>
                                        <br/>
                                    </List>
                                )}
                                {(() => {
                                    if (this.state.annotations.length == 0) {
                                        return <Empty description={'No Rectangles'}/>;
                                    }
                                })()}
                            </div>
                            <br/>
                            <div>
                                <div style={{textAlign: 'center'}}>
                                    <Button style={{width: 150}} type={'danger'}
                                            onClick={this.clearClickHandler}>Clear
                                        All  <DeleteOutlined/></Button>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col xl={{span: 6}} lg={{span: 6}} md={{span: 12}} sm={{span: 12}} xs={{span: 12}}>
                        <Card type={'inner'}
                              style={{minHeight: "400px", border: "1px solid #BEBEBE", margin: '20px 20px 20px 20px'}}
                              align="center" title={"Saved States of Image"}>
                            <div className={"annotation-scroller"}>
                                {this.state.savedState.map((savedState, i) =>
                                    <List bordered={true} key={i} style={{height: "30px", marginBottom: '4px'}}>

                                        <h3 style={{
                                            float: 'left',
                                            marginLeft: '20px',
                                            color: 'dodgerblue'
                                        }}>Drawing: {savedState[0].data.x}</h3>
                                        <Button style={{float: 'right', height: '30px'}} type={"danger"} data-index={i}
                                                onClick={() => this.deleteDrawing(i)}><DeleteOutlined/></Button>
                                        <Button style={{float: 'right', height: '30px'}} type={"primary"} data-index={i}
                                                onClick={() => this.setDrawing(i)}><EditOutlined/></Button>
                                        <br/>
                                    </List>
                                )}
                                {(() => {
                                    if (this.state.savedState.length == 0) {
                                        return <Empty description={'No Saved States'}/>;
                                    }
                                })()}
                            </div>
                            <br/>
                            <div>
                                <div style={{textAlign: 'center'}}>
                                    <Button style={{width: 150}} type={'danger'}
                                            onClick={this.clearAllStates}>Clear
                                        All  <DeleteOutlined/></Button>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}
