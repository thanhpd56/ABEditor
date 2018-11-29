// @flow
import React, {Fragment} from 'react';
import $ from 'jquery';
import pm from 'post-robot';
import './css/actionBuilder.css';
import './css/elementHandler.css';
import Menu from './Menu';
import {Checkbox, Input, Modal} from 'antd';

const {TextArea} = Input;

type Props = {}

type State = {}

const modalMode = {
    editText: 'Edit Text',
    editImage: 'Edit Image',
    editHyperLink: 'Edit HyperLink',
};

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
            customizationList: [],
            menuTitle: '',
            modalVisible: false,
            editText: '',
            editImageLink: '',
            editHyperLink: '',
            selectedElement: {},
            modalMode: null,
        };
    }

    handleFormChange = (e) => {
        const {name, value} = e.target;
        this.setState({
            [name]: value,
        })
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

        pm.send(this.pmTarget, setting.function, customization).then(data => {
            if (changeType === 'new') {
                let list = this.state.customizationList.slice();
                list.push(data);
                this.setState({
                    customizationList: list
                });
            }
            else if (changeType === 'update') {
                let list = this.state.customizationList.slice();
                list[customIndex] = data;
                this.setState({
                    customizationList: list
                });
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
                        top={this.state.menuPositionTop}
                        left={this.state.menuPositionLeft}
                        title={this.state.menuTitle}
                        data={this.state.selectedElement}
                    />}
                    {this.state.showOverlay && <div id="selectElementOverlay"/>}
                    <iframe id="edit-frame" src="http://localhost:3000" style={{width: '100%', height: '850px'}}/>

                </div>
                {this.getModal()}
            </Fragment>
        );
    }

    getModal() {
        return <Modal
            title={this.state.modalMode}
            visible={this.state.modalVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
        >
            {this.getModalBody()}
        </Modal>;
    }

    getModalBody() {
        const state = this.state;
        switch (state.modalMode){
            case modalMode.editText:
                return <TextArea value={state.editText} name="editText" onChange={this.handleFormChange} rows={4}/>;
            case modalMode.editImage:
                return <div>
                    <h4>Image Hyperlink:</h4>
                    <Input type="text" name="editImageLink" onChange={this.handleFormChange} value={state.editImageLink}/>
                </div>;
            case modalMode.editHyperLink:
                return <div>
                    <h4>Link Url:</h4>
                    <Input type="text" name="editHyperLink" onChange={this.handleFormChange} value={state.editHyperLink}/>
                    <div className="mt-2"><Checkbox onChange={this.handleCheckboxNewTabChange}> Open new tab</Checkbox></div>
                </div>;
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

    handleOk = () => {
        switch (this.state.modalMode) {
            case modalMode.editText:
                this.saveEditText();
                break;
            case modalMode.editImage:
                this.saveImageLink();
                break;
            case modalMode.editHyperLink:
                this.setState({
                    modalVisible: false,
                    editHyperLink: ''
                });

                this.setChange({
                    type: 'editHyperLink',
                    linkUrl: this.state.editHyperLink,
                    linkText: this.state.editHyperLink,
                    newTab: this.state.checkboxNewTab,
                });
                break;
        }
    };

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
            editText: ''
        });
    };
}
