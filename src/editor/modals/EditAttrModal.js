// @flow
import React from 'react';
import {Button, Input, Radio} from "antd";

const RadioGroup = Radio.Group;
type Props = {
    removeAttr: Function,
    addMoreAttr: Function,
    handleAttrKeyChange: Function,
    handleAttrValueChange: Function,
    editAttrs: Array,
}

export default class EditAttrModal extends React.Component<Props> {
    render() {
        return (
            <div>
                <Button type="primary" onClick={this.props.addMoreAttr}>Add</Button>
                <hr/>
                {
                    this.props.editAttrs.filter(attr => attr.type !== 'deleted').map((attr, index) => {
                        return <div className="d-flex align-items-center mb-2">
                            <span className="mr-1">Key:</span> <Input className="mr-1" type="text"
                                                                      onChange={(e) => {
                                                                          this.props.handleAttrKeyChange(index, e.target.value);
                                                                      }}
                                                                      value={attr.key}/>
                            <span className="mr-1">Value:</span> <Input className="mr-1" type="text"
                                                                        onChange={(e) => {
                                                                            this.props.handleAttrValueChange(index, e.target.value);
                                                                        }}
                                                                        value={attr.val}/>
                            <Button type="danger" onClick={() => {
                                this.props.removeAttr(index);
                            }}><i className="fas fa-trash-alt"/></Button>
                        </div>;
                    })
                }
            </div>
        );
    }
}
