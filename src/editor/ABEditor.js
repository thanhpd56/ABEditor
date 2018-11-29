// @flow
import React, {Fragment} from 'react';
import $ from 'jquery';
import pm from 'post-robot';
import './css/actionBuilder.css';
import './css/elementHandler.css';
import Menu from './Menu';
import {Input, Modal} from 'antd';

const {TextArea} = Input;

type Props = {}

type State = {}

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
            this.initElements();
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
            selectedElement: {},
        };
    }

    handleEditTextChange = (e) => {
        const value = e.target.value;
        this.setState({
            editText: value,
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

    initElements = () => {
        this.clickEvents();
    };
    clickEvents = () => {
        const eventWrapper = $('body');

        eventWrapper.on('click', '.select-element-menu-close', () => {
            this.closeElementMenu();
        });

        eventWrapper.on('click', '.element-move', () => {
            this.moveElement();
        });

        eventWrapper.on('click', '.element-remove', () => {
            this.removeElement();
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
                        top={this.state.menuPositionTop}
                        left={this.state.menuPositionLeft}
                        title={this.state.menuTitle}
                    />}
                    {this.state.showOverlay && <div id="selectElementOverlay"/>}
                    <iframe id="edit-frame" src="http://localhost:3000" style={{width: '100%', height: '850px'}}/>

                </div>
                <Modal
                    title="Edit text"
                    visible={this.state.modalVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <TextArea value={this.state.editText} onChange={this.handleEditTextChange} rows={4}/>
                </Modal>
            </Fragment>
        );
    }

    editTextElement = () => {
        this.setState({
            modalVisible: true,
            editText: this.state.selectedElement.html,
        });
    };

    handleOk = () => {
        this.setState({
            modalVisible: false,
            editText: ''
        });

        this.setChange({
            type: 'changedText',
            html: this.state.editText   ,
    })
    };
    handleCancel = () => {
        this.setState({
            modalVisible: false,
            editText: ''
        });
    };
}
