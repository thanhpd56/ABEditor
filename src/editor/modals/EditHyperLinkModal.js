// @flow
import React from 'react';
import {Checkbox, Input, Radio} from "antd";

const RadioGroup = Radio.Group;
type Props = {
    onFormChange: Function,
    onCheckboxNewTabChange: Function,
    editHyperLink: string,
}

export default class EditHyperLinkModal extends React.Component<Props> {
    render() {
        return (
            <div>
                <h4>Link Url:</h4>
                <Input type="text" name="editHyperLink" onChange={this.props.onFormChange}
                       value={this.props.editHyperLink}/>
                <div className="mt-2"><Checkbox onChange={this.props.onCheckboxNewTabChange}> Open new tab</Checkbox>
                </div>
            </div>
        );
    }
}
