// @flow
import React from 'react';
import {Input, Radio} from "antd";

const RadioGroup = Radio.Group;
type Props = {
    onFormChange: Function,
    insertImageLink: string,
    insertImagePosition: string,
}

export default class InsertImageModal extends React.Component<Props> {
    render() {
        return (
            <div>
                <h6>Image Hyperlink:</h6>
                <Input value={this.props.insertImageLink} name="insertImageLink" onChange={this.props.onFormChange}/>
                <hr/>
                <RadioGroup onChange={this.props.onFormChange} name="insertImagePosition"
                            value={this.props.insertImagePosition}>
                    <Radio value="after">Insert After</Radio>
                    <Radio value="before">Insert Before</Radio>
                    <Radio value="append">Insert to the End</Radio>
                    <Radio value="prepend">Insert to the Beginning</Radio>
                </RadioGroup>
            </div>
        );
    }
}