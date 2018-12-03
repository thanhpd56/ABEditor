// @flow
import React, {Fragment} from 'react';
import $ from 'jquery';
import pm from 'post-robot';
import './css/actionBuilder.css';
import './css/elementHandler.css';
import Menu from './Menu';
import {Button, Input, Modal, Radio, Select, Tabs} from 'antd';
import AddHtmlModal from "./modals/AddHtmlModal";
import InsertImageModal from "./modals/InsertImageModal";
import EditStyleModal from "./modals/EditStyleModal";
import EditAttrModal from './modals/EditAttrModal';
import EditHyperLinkModal from './modals/EditHyperLinkModal';
import EditImageLinkModal from './modals/EditImageLinkModal';

const {TextArea} = Input;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

type Props = {
    onCustomizationListChange: Function,
    onCustomCssChange: Function,
    onCustomJsChange: Function,
    customizationList: Array,
    customCss: string,
    customJs: string,
}

type State = {}

const modalMode = {
    editText: 'Edit Text',
    editImage: 'Edit Image',
    editHyperLink: 'Edit HyperLink',
    editAttr: 'Edit Attribute',
    addHtml: 'Add HTML',
    insertImage: 'Insert Image',
    editStyle: 'Edit Style',
    editCustomCss: 'Edit Css',
    editJavascript: 'Edit Javascript',
};

const modeInteractive = 'interactive';
const modeEdit = 'edit';

export default class ABEditor extends React.Component<Props, State> {

    camp = {
        id: 1
    };

    customizationTypes = {
        'css': {'function': 'setCssSettings'},
        'click': {'function': 'setClickSettings'},
        'remove': {'function': 'removeElement', 'closeMenu': true},
        'changedText': {'function': 'setChangedText'},
        'changedImage': {'function': 'setChangedImage'},
        'insertedHTML': {'function': 'setInsertHTML'},
        'insertImage': {'function': 'setInsertImage'},
        'editHyperLink': {'function': 'setEditHyperLink'},
        'makeHyperLink': {'function': 'setMakeHyperLink'},
        'elementAttr': {'function': 'setElementAttr'},
        'slide': {'function': 'setSlideSettings'},
        'rearrangeElement': {'function': 'setRearrangePosition'},
        'moveElement': {'function': 'setMovePosition'}
    };

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

    pmTarget = null;

    constructor(props) {
        super(props);
        $(document).ready(() => {
            this.pmTarget = $('#edit-frame')[0].contentWindow;
            this.setupListeners();
            pm.send(this.pmTarget, 'setEditMode');
        });

        this.state = {
            showMenu: false,
            showOverlay: false,
            menuPositionTop: 0,
            menuPositionLeft: 0,
            customizationBackupList: [],
            menuTitle: '',
            modalVisible: false,
            editText: '',
            editImageLink: '',
            editHyperLink: '',
            editHTML: '',
            addHtmlPosition: 'after',
            insertImageLink: '',
            insertImagePosition: 'after',
            editStyle: {},
            editAttrs: [],
            selectedElement: {},
            modalMode: null,
            mode: modeEdit,
            tempCustomCss: '',
            tempCustomJs: '',
        };
    }

    handleFormChange = (e) => {
        const {name, value} = e.target;
        this.setState({
            [name]: value,
        })
    };

    handleEditStyleFormChange = (e) => {
        const {name, value} = e.target;
        const newStyle = {...this.state.editStyle, [name]: value};
        this.setState({
            editStyle: newStyle,
        });
    };

    addMoreAttr = () => {
        const attrs = this.state.editAttrs.slice();
        attrs.push({type: 'added', key: '', val: ''});
        this.setState({editAttrs: attrs});
    };

    removeAttr = (index) => {
        const attrs = this.state.editAttrs.slice();
        const item = attrs[index];
        if (item.type === 'added') {
            attrs.splice(index, 1);
        } else {
            attrs[index] = {...item, type: 'deleted'}
        }
        this.setState({editAttrs: attrs});
    };

    handleAttrKeyChange = (index, value) => {
        const attrs = this.state.editAttrs.slice();
        const item = attrs[index];
        if (item.type === 'added') {
            attrs[index] = {...item, key: value}
        } else {
            attrs[index] = {...item, type: 'changed', key: value}
        }
        this.setState({editAttrs: attrs});
    };

    handleAttrValueChange = (index, value) => {
        const attrs = this.state.editAttrs.slice();
        const item = attrs[index];
        if (item.type === 'added') {
            attrs[index] = {...item, val: value}
        } else {
            attrs[index] = {...item, type: 'changed', val: value}
        }
        this.setState({editAttrs: attrs});
    };

    handleCheckboxNewTabChange = (e) => {
        this.setState({
            checkboxNewTab: e.target.checked,
        });
    };

    onOverlayClick = () => {
        this.closeElementMenu();
    };

    setupListeners = () => {
        pm.on('elementSelected', event => {
            const selectedElement = event.data;
            this.setState({selectedElement, showOverlay: true});
        });

        pm.on('setCustomMenu', event => {
            const selectedElement = event.data;
            this.setCustomMenu(selectedElement);
        });

        pm.on('removePageOverlay', () => this.removeOverlay());

        pm.on('removeMenu', this.removeMenu);

        pm.on('setElementMovedPosition', (event) => {
            return this.setElementMovedPosition(event.data);
        });
    };

    setCustomMenu = (data) => {
        const {x, y} = data.position;
        const {top, left} = data.offset;
        this.setState({
            showMenu: true,
            menuPositionTop: top - x,
            menuPositionLeft: left - y,
            menuTitle: data.tagName,
        });
    };

    moveElement = () => {
        pm.send(this.pmTarget, 'prepareElementForMove', this.state.selectedElement);
    };

    setElementMovedPosition = (data) => {
        data.type = 'moveElement';
        this.setChange(data);
    };

    setChange = (customization) => {
        const selectedElement = this.state.selectedElement;
        customization.selectorString = selectedElement.selectorString;
        customization.id = this.createElementClass();
        customization.parentNodeSelector = selectedElement.parentNodeSelector;
        customization.parentNodeHTML = selectedElement.parentNodeHTML;

        this.applyCustomization(customization, 'new');
    };

    createElementClass() {
        return 'sp-custom-' + this.camp.id + '-' + new Date().getTime();
    }

    getCustomizationSettings = (type) => {
        return this.customizationTypes[type];
    };

    applyCustomization = (customization, changeType, customIndex) => {
        const setting = this.getCustomizationSettings(customization.type);

        if (typeof setting === 'undefined') {
            return false;
        }

        pm.send(this.pmTarget, setting.function, customization).then(event => {
            const data = event.data;
            if (changeType === 'new') {
                let list = this.props.customizationList.slice();
                list.push(data);
                this.props.onCustomizationListChange(list);
            }
            else if (changeType === 'update') {
                let list = this.props.customizationList.slice();
                list[customIndex] = data;
                this.props.onCustomizationListChange(list);
            }

            if (typeof setting.closeMenu === 'undefined' || setting.closeMenu === true) {
                this.closeElementMenu();
            }
        }).catch(err => {
            console.log('that bai roi', err);

        });

    };

    closeElementMenu = () => {
        this.removeMenu();
        this.removeOverlay();
    };


    removeMenu = () => {
        this.setState({
            showMenu: false,
        });
    };

    removeOverlay = () => {
        this.setState({
            showOverlay: false,
        });
        pm.send(this.pmTarget, 'removeElemOverlay');
    };

    removeElement = () => {
        console.log('remove click');
        const data = {};
        data.type = 'remove';
        this.setChange(data);
    };


    render() {
        return (
            <Fragment>
                <div onClick={this.onOverlayClick}>
                    {this.state.showMenu && <Menu
                        onCloseMenuClick={this.closeElementMenu}
                        onMoveMenuClick={this.moveElement}
                        onRemoveMenuClick={this.removeElement}
                        onEditTextMenuClick={this.editTextElement}
                        onEditImageMenuClick={this.editImageElement}
                        onEditHyperLinkMenuClick={this.editHyperLinkElement}
                        onEditAttrMenuClick={this.editAttrElement}
                        onAddHTMLMenuClick={this.addHTMLElement}
                        onInsertImageMenuClick={this.insertImageElement}
                        onEditStyleMenuClick={this.editStyleElement}
                        top={this.state.menuPositionTop}
                        left={this.state.menuPositionLeft}
                        title={this.state.menuTitle}
                        data={this.state.selectedElement}
                    />}
                    {this.state.showOverlay && <div id="selectElementOverlay"/>}
                    <div className="w-100 bg-dark p-2 d-flex">
                        <div>
                            <Button ghost={this.state.mode !== modeEdit} type="primary" className="mx-3"
                                    onClick={this.turnEditMode}><i className="fas fa-pencil-alt mr-1"/> Edit
                                Mode</Button>
                            <Button ghost={this.state.mode !== modeInteractive} type="primary" className="mx-3"
                                    onClick={this.turnInteractiveMode}><i
                                className="fas fa-mouse-pointer mr-1"/> Interactive Mode</Button>
                            <Button ghost className="mx-3" onClick={this.editJavascript}><i
                                className="fab fa-js  mr-1"/> Javascript</Button>
                            <Button ghost className="mx-3" onClick={this.editCustomCss}><i
                                className="fab fa-css3-alt  mr-1"/> Css</Button></div>
                        <div className="ml-auto d-flex">
                            <Button ghost className="mr-2"
                                    disabled={this.props.customizationList.length === 0}
                                    onClick={this.undoLastChange}>
                                <i className="fas fa-undo"/>
                            </Button>
                            <Button ghost className="mr-2"
                                    disabled={this.state.customizationBackupList.length === 0}
                                    onClick={this.redoLastChange}>
                                <i className="fas fa-redo"/>
                            </Button>
                        </div>
                    </div>
                    <iframe id="edit-frame" src="http://localhost:3000" style={{width: '100%', height: '850px'}}/>

                </div>
                {this.getModal()}
            </Fragment>
        );
    }

    getModal() {
        return <Modal
            width={1200}
            title={this.state.modalMode}
            visible={this.state.modalVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            className="px-2"
        >
            {this.getModalBody()}
        </Modal>;
    }


    getModalBody() {
        const state = this.state;
        const props = this.props;
        switch (state.modalMode) {
            case modalMode.editText:
                return <TextArea value={state.editText} name="editText" onChange={this.handleFormChange} rows={4}/>;
            case modalMode.editImage:
                return <EditImageLinkModal onFormChange={this.handleFormChange} editImageLink={this.state.editImage}/>;
            case modalMode.editHyperLink:
                return <EditHyperLinkModal onFormChange={this.handleFormChange}
                                           onCheckboxNewTabChange={this.handleCheckboxNewTabChange}
                                           editHyperLink={this.state.editHyperLink}/>;
            case modalMode.editAttr: {
                return <EditAttrModal removeAttr={this.removeAttr} addMoreAttr={this.addMoreAttr}
                                      handleAttrKeyChange={this.handleAttrKeyChange}
                                      handleAttrValueChange={this.handleAttrValueChange}
                                      editAttrs={this.state.editAttrs}/>;
            }
            case modalMode.addHtml: {
                return <AddHtmlModal editHTML={this.state.editHTML}
                                     addHtmlPosition={this.state.addHtmlPosition}
                                     onFormChange={this.handleFormChange}/>;
            }

            case modalMode.insertImage: {
                return <InsertImageModal onFormChange={this.handleFormChange}
                                         insertImageLink={this.state.insertImageLink}
                                         insertImagePosition={this.state.insertImagePosition}/>;
            }
            case modalMode.editStyle: {
                return <EditStyleModal onFormChange={this.handleFormChange}
                                       onEditStyleFormChange={this.handleEditStyleFormChange}
                                       editStyle={this.state.editStyle}/>;
            }
            case modalMode.editCustomCss:
                return <TextArea defaultValue={props.customCss}
                                 name="tempCustomCss"
                                 onChange={this.handleFormChange}
                                 rows={4}/>;
            case modalMode.editJavascript:
                return <TextArea defaultValue={props.customJs}
                                 name="tempCustomJs"
                                 onChange={this.handleFormChange}
                                 rows={4}/>;
            default:
                return false;

        }
    }

    editTextElement = () => {
        this.setState({
            modalVisible: true,
            editText: this.state.selectedElement.html,
            modalMode: modalMode.editText,
        });
    };

    editImageElement = () => {
        this.setState({
            modalVisible: true,
            editImageLink: this.state.selectedElement.imgSrc,
            modalMode: modalMode.editImage,
        });
    };

    editHyperLinkElement = () => {
        this.setState({
            modalVisible: true,
            editHyperLink: this.state.selectedElement.hyperLink,
            checkboxNewTab: this.state.selectedElement.linkNewTab,
            modalMode: modalMode.editHyperLink,
        });
    };

    editAttrElement = () => {
        this.setState({
            modalVisible: true,
            editAttrs: this.state.selectedElement.attrs.map(attr => ({key: attr.attr, val: attr.val})),
            modalMode: modalMode.editAttr,
        });
    };

    addHTMLElement = () => {
        this.setState({
            modalVisible: true,
            editHTML: '',
            modalMode: modalMode.addHtml,
        });
    };

    insertImageElement = () => {
        this.setState({
            modalVisible: true,
            modalMode: modalMode.insertImage,
        });
    };

    editStyleElement = () => {
        this.setState({
            modalVisible: true,
            modalMode: modalMode.editStyle,
            editStyle: this.state.selectedElement.cssSettings
        });
    };

    turnEditMode = () => {
        pm.send(this.pmTarget, 'setEditMode');
        this.setState({
            mode: modeEdit,
        });
    };

    turnInteractiveMode = () => {
        this.removeOverlay();
        this.removeMenu();
        pm.send(this.pmTarget, 'setInteractiveMode');
        this.setState({
            mode: modeInteractive,
        });
    };

    editCustomCss = () => {
        this.setState({
            modalVisible: true,
            modalMode: modalMode.editCustomCss,
            customCss: this.props.customCss,
        });
    };

    editJavascript = () => {
        this.setState({
            modalVisible: true,
            modalMode: modalMode.editJavascript,
            customJs: this.props.customJs,
        });
    };

    undoLastChange = () => {
        if (this.props.customizationList.length === 0) {
            return false;
        }
        const lastChange = this.props.customizationList.pop();
        this.state.customizationBackupList.push(lastChange);
        pm.send(this.pmTarget, 'undoChange', lastChange);
    };


    redoLastChange = () => {
        if (this.state.customizationBackupList.length > 0) {
            const change = this.state.customizationBackupList.pop();
            this.applyCustomization(change, 'new');
        }
    };

    handleOk = () => {
        switch (this.state.modalMode) {
            case modalMode.editText: {
                this.saveEditText();
                break;
            }
            case modalMode.editImage: {
                this.saveImageLink();
                break;
            }
            case modalMode.editHyperLink: {
                this.saveEditHyperLink();
                break;
            }
            case modalMode.editAttr: {
                this.saveEditAttrs();
                break;
            }
            case modalMode.addHtml: {
                this.saveAddHTML();
                break;
            }
            case modalMode.insertImage: {
                this.setState({
                    modalVisible: false,
                });
                this.setChange({
                    type: 'insertImage',
                    insertOption: this.state.insertImagePosition,
                    src: this.state.insertImageLink,
                });
                break;
            }
            case modalMode.editStyle: {
                this.setState({
                    modalVisible: false,
                });
                this.setChange({
                    type: 'css',
                    settings: this.state.editStyle,
                });
                break;
            }
            case modalMode.editCustomCss: {
                this.setState({
                    modalVisible: false,
                });
                const css = this.state.tempCustomCss;
                pm.send(this.pmTarget, 'injectCSS', {css});
                this.props.onCustomCssChange(css);
                break;
            }
            case modalMode.editJavascript: {
                this.setState({
                    modalVisible: false,
                });
                const js = this.state.tempCustomJs;
                pm.send(this.pmTarget, 'injectJS', {js});
                this.props.onCustomJsChange(js);
                break;
            }

        }
    };

    saveAddHTML() {
        this.setState({
            modalVisible: false,
        });

        this.setChange({
            type: 'insertedHTML',
            insertOption: this.state.addHtmlPosition,
            html: this.state.editHTML
        });
    }

    saveEditAttrs() {
        this.setState({
            modalVisible: false,
        });
        this.setChange({
            type: 'elementAttr',
            attrs: this.state.editAttrs,
        });
    }

    saveEditHyperLink() {
        this.setState({
            modalVisible: false,
            editHyperLink: ''
        });

        this.setChange({
            type: 'saveEditHyperLink',
            linkUrl: this.state.editHyperLink,
            linkText: this.state.editHyperLink,
            newTab: this.state.checkboxNewTab,
        });
    }

    saveImageLink() {
        this.setState({
            modalVisible: false,
            editImageLink: ''
        });

        this.setChange({
            type: 'changedImage',
            src: this.state.editImageLink,
        });
    }

    saveEditText() {
        this.setState({
            modalVisible: false,
            editText: ''
        });

        this.setChange({
            type: 'changedText',
            html: this.state.editText,
        });
    }

    handleCancel = () => {
        this.setState({
            modalVisible: false,
            editText: '',
            tempCustomCss: '',
            tempCustomJs: '',
        });
    };
}
