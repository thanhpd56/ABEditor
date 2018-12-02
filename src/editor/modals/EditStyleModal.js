// @flow
import React from 'react';
import {Input, Radio, Select, Tabs} from "antd";

const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

type Props = {
    onFormChange: Function,
    onEditStyleFormChange: Function,
    editStyle: Object,
}

export default class EditStyleModal extends React.Component<Props> {
    cssSettings = {
        'text': [{
            'label': 'Font Family',
            'type': 'text',
            'name': 'font-family',
            'advanced': 'false'
        }, {'label': 'Font Size', 'type': 'text', 'name': 'font-size', 'advanced': 'false'}, {
            'label': 'Font Style',
            'type': 'select',
            'values': ["", "normal", "italic", "oblique", "inherit"],
            'name': 'font-style',
            'advanced': 'false'
        }, {
            'label': 'Text Alignment',
            'type': 'select',
            'values': ["", "left", "center", "right", "justify", "start", "end", "inherit"],
            'name': 'text-align',
            'advanced': 'false'
        }, {
            'label': 'Text Decoration',
            'type': 'select',
            'values': ["", "none", "inherit", "underline", "line-through", "overline", "blink"],
            'name': 'text-decoration',
            'advanced': 'false'
        }, {
            'label': 'Font Weight',
            'type': 'select',
            'values': ["", "normal", "bold", "100", "200", "300", "400", "401", "500", "600", "700", "800", "900", "inherit"],
            'name': 'font-weight',
            'advanced': 'false'
        }, {
            'label': 'Font Variant',
            'type': 'select',
            'values': ["", "normal", "small-caps", "inherit"],
            'name': 'font-variant',
            'advanced': 'true'
        }, {'label': 'Line Height', 'type': 'text', 'name': 'line-height', 'advanced': 'true'}, {
            'label': 'Word Break',
            'type': 'select',
            'values': ["", "normal", "break-word"],
            'name': 'word-break',
            'advanced': 'true'
        }, {'label': 'Word Spacing', 'type': 'text', 'name': 'word-spacing', 'advanced': 'true'}, {
            'label': 'Word Wrap',
            'type': 'select',
            'values': ["", "normal", "break-word"],
            'name': 'word-wrap',
            'advanced': 'true'
        }, {
            'label': 'Letter Spacing',
            'type': 'text',
            'name': 'letter-spacing',
            'advanced': 'true'
        }, {
            'label': 'Overflow',
            'type': 'select',
            'values': ["", "visible", "hidden", "scroll", "auto", "clip", "inherit"],
            'name': 'text-overflow',
            'advanced': 'true'
        }, {
            'label': 'Text Transform',
            'type': 'select',
            'values': ["", "none", "capitalize", "uppercase", "lowercase", "inherit"],
            'name': 'text-transform',
            'advanced': 'true'
        }, {'label': 'Text Shadow', 'type': 'text', 'name': 'text-shadow', 'advanced': 'true'}],
        'color-background': [{
            'label': 'Font Color',
            'type': 'colorpicker',
            'name': 'color',
            'advanced': 'false'
        }, {
            'label': 'Background Color',
            'type': 'colorpicker',
            'name': 'background-color',
            'advanced': 'false'
        }, {
            'label': 'Background Image',
            'type': 'text',
            'name': 'background-image',
            'advanced': 'false'
        }, {
            'label': 'Background Position',
            'type': 'text',
            'name': 'background-position',
            'advanced': 'false'
        }, {
            'label': 'Background Repeat',
            'type': 'select',
            'values': ["", "no-repeat", "repeat", "repeat-x", "repeat-y", "inherit"],
            'name': 'background-repeat',
            'advanced': 'false'
        }],
        'dimensions': [{'label': 'Height', 'type': 'text', 'name': 'height', 'advanced': 'false'}, {
            'label': 'Width',
            'type': 'text',
            'name': 'width',
            'advanced': 'false'
        }, {'label': 'Margin', 'type': 'text', 'name': 'margin', 'advanced': 'false'}, {
            'label': 'Padding',
            'type': 'text',
            'name': 'padding',
            'advanced': 'false'
        }, {'label': 'Max Height', 'type': 'text', 'name': 'max-height', 'advanced': 'true'}, {
            'label': 'Min Height',
            'type': 'text',
            'name': 'min-height',
            'advanced': 'true'
        }, {'label': 'Max Width', 'type': 'text', 'name': 'max-width', 'advanced': 'true'}, {
            'label': 'Min Width',
            'type': 'text',
            'name': 'min-width',
            'advanced': 'true'
        }, {'label': 'Margin Top', 'type': 'text', 'name': 'margin-top', 'advanced': 'true'}, {
            'label': 'Margin Bottom',
            'type': 'text',
            'name': 'margin-bottom',
            'advanced': 'true'
        }, {
            'label': 'Margin Left',
            'type': 'text',
            'name': 'margin-left',
            'advanced': 'true'
        }, {
            'label': 'Margin Right',
            'type': 'text',
            'name': 'margin-right',
            'advanced': 'true'
        }, {
            'label': 'Padding Top',
            'type': 'text',
            'name': 'padding-top',
            'advanced': 'true'
        }, {
            'label': 'Padding Bottom',
            'type': 'text',
            'name': 'padding-bottom',
            'advanced': 'true'
        }, {
            'label': 'Padding Left',
            'type': 'text',
            'name': 'padding-left',
            'advanced': 'true'
        }, {'label': 'Padding Right', 'type': 'text', 'name': 'padding-right', 'advanced': 'true'}],
        'borders': [{
            'label': 'Border Color',
            'type': 'colorpicker',
            'name': 'border-color',
            'advanced': 'false'
        }, {
            'label': 'Border Style',
            'type': 'select',
            'values': ["", "none", "solid", "dotted", "dashed", "outset", "inset", "groove", "ridge", "inherit"],
            'name': 'border-style',
            'advanced': 'false'
        }, {
            'label': 'Border Width',
            'type': 'text',
            'name': 'border-width',
            'advanced': 'false'
        }, {'label': 'Border Top', 'type': 'text', 'name': 'border-top', 'advanced': 'true'}, {
            'label': 'Border Bottom',
            'type': 'text',
            'name': 'border-bottom',
            'advanced': 'true'
        }, {
            'label': 'Border Left',
            'type': 'text',
            'name': 'border-left',
            'advanced': 'true'
        }, {'label': 'Border Right', 'type': 'text', 'name': 'border-right', 'advanced': 'true'},],
        'layout': [{'label': 'Top', 'type': 'text', 'name': 'top', 'advanced': 'false'}, {
            'label': 'Bottom',
            'type': 'text',
            'name': 'bottom',
            'advanced': 'false'
        }, {'label': 'Left', 'type': 'text', 'name': 'left', 'advanced': 'false'}, {
            'label': 'Right',
            'type': 'text',
            'name': 'right',
            'advanced': 'false'
        }, {'label': 'Z Index', 'type': 'text', 'name': 'z-index', 'advanced': 'false'}, {
            'label': 'Position',
            'type': 'select',
            'values': ["", "absolute", "fixed", "relative", "static", "inherit"],
            'name': 'position',
            'advanced': 'false'
        }, {
            'label': 'Float',
            'type': 'select',
            'values': ["", "left", "right", "none"],
            'name': 'float',
            'advanced': 'false'
        }, {
            'label': 'Clear',
            'type': 'select',
            'values': ["", "none", "left", "right", "both"],
            'name': 'clear',
            'advanced': 'false'
        }, {
            'label': 'Display',
            'type': 'select',
            'values': ["", "none", "block", "inline", "inline-block", "list-item", "table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row", "table-row-group", "inherit"],
            'name': 'display',
            'advanced': 'true'
        }, {
            'label': 'Visibility',
            'type': 'select',
            'values': ["", "visible", "hidden", "collapse", "inherit"],
            'name': 'visibility',
            'advanced': 'true'
        }],
        'other': [{
            'label': 'Table Border Collapse',
            'type': 'select',
            'values': ["", "collapse", "separate"],
            'name': 'border-collapse',
            'advanced': 'false'
        }, {
            'label': 'Table Border Spacing',
            'type': 'text',
            'name': 'border-spacing',
            'advanced': 'false'
        }, {
            'label': 'List Style Type',
            'type': 'select',
            'values': ["", "disc", "armenian", "circle", "decimal", "georgian", "hebrew", "hiragana", "hiragana-iroha", "inherit", "katakana", "katakana-iroha", "lower-alpha", "lower-greek", "lower-latin", "lower-roman", "none", "square", "upper-alpha", "upper-latin", "upper-roman"],
            'name': 'list-style-type',
            'advanced': 'false'
        }]
    };
    render() {
        return (
            <Tabs defaultActiveKey="0">

                {Object.keys(this.cssSettings).map((key, index) => {
                    const attrs = this.cssSettings[key];
                    return <TabPane key={index} tab={<span>{key.toUpperCase()}</span>}>
                        <div className="row">{attrs.map(attr => {
                            let input;
                            switch (attr.type) {
                                case 'select':
                                    input = <Select className="col col-md-6 mb-2" style={{width: 120}}
                                                    onChange={(value) => {
                                                        this.props.onEditStyleFormChange({
                                                            target: {
                                                                name: attr.name,
                                                                value
                                                            }
                                                        });
                                                    }}
                                                    value={this.props.editStyle[attr.name]}>
                                        {attr.values.map(value => {
                                            return <Option value={value}>{value}</Option>;
                                        })}
                                    </Select>;
                                    break;
                                default:
                                    input = <Input className="col col-md-6 mb-2"
                                                   type={attr.type}
                                                   name={attr.name}
                                                   value={this.props.editStyle[attr.name]}
                                                   onChange={this.props.onEditStyleFormChange}
                                    />;
                            }


                            return <div className="col col-md-6">
                                <div className="d-flex row">
                                    <span className="col col-md-6">{attr.label}</span>
                                    {
                                        input
                                    }

                                </div>
                            </div>;
                        })}</div>
                    </TabPane>;
                })}

            </Tabs>
        );
    }
}