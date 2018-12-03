// @flow
import React, {Fragment} from 'react';
import $ from 'jquery';
import pm from 'post-robot';
import './css/actionBuilder.css';
import './css/elementHandler.css';
import Menu from './Menu';
import {Button, Input, Modal} from 'antd';
import AddHtmlModal from "./modals/AddHtmlModal";
import InsertImageModal from "./modals/InsertImageModal";
import EditStyleModal from "./modals/EditStyleModal";
import EditAttrModal from './modals/EditAttrModal';
import EditHyperLinkModal from './modals/EditHyperLinkModal';
import EditImageLinkModal from './modals/EditImageLinkModal';

const {TextArea} = Input;

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
            tempCustomCss: props.customCss || '',
            tempCustomJs: props.customJs || '',
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
                return <TextArea value={state.tempCustomCss}
                                 name="tempCustomCss"
                                 onChange={this.handleFormChange}
                                 rows={4}/>;
            case modalMode.editJavascript:
                return <TextArea value={state.tempCustomJs}
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
