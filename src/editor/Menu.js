// @flow
import React from 'react';

type Props = {
    onCloseMenuClick: Function,
    onMoveMenuClick: Function,
    onRemoveMenuClick: Function,
    onEditTextMenuClick: Function,
    top: number,
    left: number,
    title: string,
    data: object,
}

export default class Menu extends React.Component<Props>{
    render() {
        let {data} = this.props;
        data = data || {};

        return (
            <div id="select-element-menu" style={{top: this.props.top, left: this.props.left}}>
                <h1 className="select-element-menu-handle" id="element-tagName">{this.props.title}</h1>
                <li className="edit-element subContent">
                    Edit
                    <div className="arrow">
                        <div/>
                    </div>
                    <div className="subMenu">
                        {!!this.shouldShowEditText(data) && <span className="subMenuText edit-text"
                                                                onClick={this.props.onEditTextMenuClick}>Edit Text</span>}
                        <span className="subMenuText edit-attr">Edit Attribute</span>
                        {!!this.shouldShowEditImage(data) && <span className="subMenuText change-image">Edit Image</span>}
                        {!!data.editHyperLink && <span className="subMenuText edit-hyper-link">Edit Hyperlink</span>}
                        {!!data.editHyperLink && <span className="subMenuText make-hyper-link">Add Hyperlink</span>}
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
                <li className="element-move" onClick={this.props.onMoveMenuClick} >Move/Resize</li>
                <li className="element-rearrange">Rearrange Element</li>
                <li className="element-remove" onClick={this.props.onRemoveMenuClick}>Remove Element</li>
                <li className="select-element-menu-close" onClick={this.props.onCloseMenuClick}>Close Menu</li>
            </div>
        );
    }

    shouldShowEditImage(data) {
        return data.imgSrc !== undefined;
    }

    shouldShowEditText(data) {
        return !((data.children && data.children.length > 0) || data.tagName === 'img' || data.tagName === 'input');
    }
}
