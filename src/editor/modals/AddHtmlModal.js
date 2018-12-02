// @flow
import React from 'react';
import {Input, Radio} from "antd";

const RadioGroup = Radio.Group;
type Props = {
    editHTML: string,
    addHtmlPosition: string,
    onFormChange: Function,
}

export default class AddHtmlModal extends React.Component<Props> {
    render() {
        return (
            <div>
                <Input type="text" name="editHTML" onChange={this.props.onFormChange}
                       value={this.props.editHTML}/>
                <hr/>
                <RadioGroup onChange={this.props.onFormChange} name="addHtmlPosition"
                            value={this.props.addHtmlPosition}>
                    <Radio value="after">Insert After</Radio>
                    <Radio value="before">Insert Before</Radio>
                    <Radio value="append">Insert to the End</Radio>
                    <Radio value="prepend">Insert to the Beginning</Radio>
                </RadioGroup>
            </div>
        );
    }
}