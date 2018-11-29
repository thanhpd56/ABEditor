// @flow
import React from 'react';

type Props = {
    onCloseMenuClick: Function,
    onMoveMenuClick: Function,
    onRemoveMenuClick: Function,
    top: number,
    left: number,
    title: string,
}

export default class Menu extends React.Component<Props>{
    render() {
        return (
            <div id="select-element-menu" style={{top: this.props.top, left: this.props.left}}>
                <h1 className="select-element-menu-handle" id="element-tagName">{this.props.title}</h1>
                <li className="slider-settings">Slider Settings</li>
                <li className="edit-element subContent">
                    Edit
                    <div className="arrow">
                        <div/>
                    </div>
                    <div className="subMenu">
                        <span className="subMenuText edit-text">Edit Text</span>
                        <span className="subMenuText edit-attr">Edit Attribute</span>
                        <span className="subMenuText change-image">Edit Image</span>
                        <span className="subMenuText edit-hyper-link">Edit Hyperlink</span>
                        <span className="subMenuText make-hyper-link">Add Hyperlink</span>
                    </div>
                </li>
                <li className="insert-element subContent">
                    Add
                    <div className="arrow">
                        <div/>
                    </div>
                    <div className="subMenu">
                        <span className="subMenuText insert-html">Add HTML</span>
                        <span className="subMenuText insert-image">Add Image</span>
                    </div>
                </li>
                <li className="edit-style">Edit Style</li>
                <li className="element-move" onClick={this.props.onMoveMenuClick}>Move/Resize</li>
                <li className="element-rearrange">Rearrange Element</li>
                <li className="element-remove" onClick={this.props.onRemoveMenuClick}>Remove Element</li>
                <li id="element-children" className="subContent">
                    <span>Select Child</span>
                    <div className="arrow">
                        <div/>
                    </div>
                    <div className="subMenu"/>
                </li>
                <li id="element-parents" className="subContent">
                    <span>Select Parent</span>
                    <div className="arrow">
                        <div/>
                    </div>
                    <div className="subMenu"/>
                </li>
                <li className="select-element-menu-close" onClick={this.props.onCloseMenuClick}>Close Menu</li>
            </div>
        );
    }

}
