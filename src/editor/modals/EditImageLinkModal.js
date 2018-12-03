// @flow
import React from 'react';
import {Checkbox, Input, Radio} from "antd";

const RadioGroup = Radio.Group;
type Props = {
    onFormChange: Function,
    editImageLink: string,
}

export default class EditImageLinkModal extends React.Component<Props> {
    render() {
        return (
            <div>
                <h4>Image Hyperlink:</h4>
                <Input type="text" name="editImageLink" onChange={this.props.onFormChange}
                       value={this.props.editImageLink}/>
            </div>
        );
    }
}
